import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, EmptyState, Header, Screen, SegmentedControl, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { colors, palette, radius, spacing } from '@/theme';
import { fetchMyAppointments, getEvents, getInvigilations, getReminders, getScheduleFor } from '@/data';
import { fmtDate, fmtTime, todayWeekday } from '@/lib/datetime';
import type { Appointment, CampusEvent, ClassSession, Invigilation, Reminder } from '@/data/types';

const WEEK_DAYS = [0, 1, 2, 3, 4]; // Sun–Thu (KSA academic week)
const WEEKDAY_LABELS = [
  { en: 'Sun', ar: 'أحد' },
  { en: 'Mon', ar: 'إثنين' },
  { en: 'Tue', ar: 'ثلاثاء' },
  { en: 'Wed', ar: 'أربعاء' },
  { en: 'Thu', ar: 'خميس' },
  { en: 'Fri', ar: 'جمعة' },
  { en: 'Sat', ar: 'سبت' },
];
type Mode = 'month' | 'week' | 'day' | 'duties';

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const ymdOf = (iso: string) => ymd(new Date(iso));

interface DayItems {
  classes: ClassSession[];
  events: CampusEvent[];
  exams: Invigilation[];
  reminders: Reminder[];
  appointments: Appointment[];
}

function ClassCard({ c }: { c: ClassSession }) {
  const { t, pick, isRTL } = useLang();
  return (
    <Card>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.md }}>
        <View style={{ width: 4, borderRadius: 2, backgroundColor: c.color }} />
        <View style={{ flex: 1 }}>
          <Text weight="semibold">{pick(c.titleEn, c.titleAr)}</Text>
          <Text variant="label" muted style={{ marginTop: 2 }}>
            {c.courseCode} · {t('calendar.room')} {c.room}
          </Text>
          <Text variant="label" muted style={{ marginTop: 2 }}>
            {pick(c.instructorEn, c.instructorAr)}
          </Text>
        </View>
        <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
          <Text weight="semibold" color={colors.primary}>
            {c.start}
          </Text>
          <Text variant="caption" muted>
            {c.end}
          </Text>
        </View>
      </View>
    </Card>
  );
}

function DetailRow({ icon, color, title, subtitle, trailing }: { icon: keyof typeof Ionicons.glyphMap; color: string; title: string; subtitle?: string; trailing?: string }) {
  const { isRTL } = useLang();
  return (
    <Card>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={{ width: 38, height: 38, borderRadius: radius.md, backgroundColor: color + '22', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text weight="semibold" numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="label" muted numberOfLines={1} style={{ marginTop: 2 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {trailing ? (
          <Text variant="label" weight="semibold" color={colors.primary}>
            {trailing}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

function MonthView({
  schedule,
  events,
  invigilations,
  reminders,
  appointments,
}: {
  schedule: ClassSession[];
  events: CampusEvent[];
  invigilations: Invigilation[];
  reminders: Reminder[];
  appointments: Appointment[];
}) {
  const { t, lang, pick, isRTL } = useLang();
  const locale = lang === 'ar' ? ar : enUS;
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState<Date>(today);

  const itemsFor = (date: Date): DayItems => {
    const key = ymd(date);
    const wd = date.getDay();
    return {
      classes: schedule.filter((c) => c.day === wd).sort((a, b) => a.start.localeCompare(b.start)),
      events: events.filter((e) => ymdOf(e.start) === key),
      exams: invigilations.filter((x) => ymdOf(x.date) === key),
      reminders: reminders.filter((r) => ymdOf(r.dueAt) === key),
      appointments: appointments.filter((a) => ymdOf(a.startsAt) === key),
    };
  };

  // Dots: one per item type present, in a fixed order/colour.
  const dotsFor = (date: Date): string[] => {
    const it = itemsFor(date);
    const dots: string[] = [];
    if (it.classes.length) dots.push(colors.primary);
    if (it.events.length) dots.push(palette.gold);
    if (it.exams.length) dots.push(palette.red);
    if (it.reminders.length) dots.push(palette.slate);
    if (it.appointments.length) dots.push(palette.blue);
    return dots;
  };

  // 6 weeks covering the month, starting from the Sunday on/before the 1st.
  const weeks = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const cursor = new Date(first);
    cursor.setDate(1 - first.getDay());
    const out: Date[][] = [];
    for (let w = 0; w < 6; w++) {
      const row: Date[] = [];
      for (let i = 0; i < 7; i++) {
        row.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
      out.push(row);
    }
    return out;
  }, [view]);

  const shift = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };
  const goToday = () => {
    setView({ y: today.getFullYear(), m: today.getMonth() });
    setSelected(today);
  };

  const headerDays = isRTL ? [...WEEKDAY_LABELS].reverse() : WEEKDAY_LABELS;
  const onCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth();
  const sel = itemsFor(selected);
  const selEmpty = !sel.classes.length && !sel.events.length && !sel.exams.length && !sel.reminders.length && !sel.appointments.length;

  return (
    <View>
      {/* Month switcher */}
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        <Pressable onPress={() => shift(-1)} hitSlop={10} style={{ padding: 4 }}>
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={22} color={colors.text} />
        </Pressable>
        <Text variant="subtitle" weight="bold" center style={{ flex: 1 }}>
          {format(new Date(view.y, view.m, 1), 'MMMM yyyy', { locale })}
        </Text>
        <Pressable onPress={() => shift(1)} hitSlop={10} style={{ padding: 4 }}>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={22} color={colors.text} />
        </Pressable>
      </View>

      {!onCurrentMonth ? (
        <Pressable onPress={goToday} hitSlop={6} style={{ alignSelf: isRTL ? 'flex-start' : 'flex-end', marginBottom: spacing.xs }}>
          <Text variant="label" color={colors.primary} weight="semibold">
            {t('common.today')}
          </Text>
        </Pressable>
      ) : null}

      {/* Calendar grid */}
      <Card padded={false} style={{ padding: spacing.sm }}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 4 }}>
          {headerDays.map((d) => (
            <Text key={d.en} variant="caption" muted center weight="semibold" style={{ flex: 1 }}>
              {pick(d.en, d.ar)}
            </Text>
          ))}
        </View>
        {weeks.map((week, wi) => (
          <View key={wi} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            {week.map((date) => {
              const inMonth = date.getMonth() === view.m;
              const isToday = ymd(date) === ymd(today);
              const isSel = ymd(date) === ymd(selected);
              const dots = dotsFor(date);
              return (
                <Pressable key={ymd(date)} onPress={() => setSelected(new Date(date))} style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }}>
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSel ? colors.primary : 'transparent',
                      borderWidth: isToday && !isSel ? 1.5 : 0,
                      borderColor: colors.primary,
                    }}
                  >
                    <Text weight={isToday || isSel ? 'bold' : 'regular'} color={isSel ? '#fff' : inMonth ? colors.text : colors.textMuted}>
                      {date.getDate()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 2, height: 5, marginTop: 3 }}>
                    {dots.slice(0, 4).map((c, i) => (
                      <View key={i} style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: c }} />
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </Card>

      {/* Selected-day details */}
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.sm }}>
        <Text variant="subtitle" weight="bold">
          {format(selected, 'EEEE, d MMMM', { locale })}
        </Text>
        {ymd(selected) === ymd(today) ? <Badge label={t('common.today')} tone="primary" /> : null}
      </View>

      {selEmpty ? (
        <EmptyState icon="calendar-outline" title={t('calendar.noItems')} />
      ) : (
        <View style={{ gap: spacing.lg }}>
          {sel.classes.length ? (
            <Section title={t('calendar.classes')}>
              {sel.classes.map((c) => (
                <ClassCard key={c.id} c={c} />
              ))}
            </Section>
          ) : null}
          {sel.events.length ? (
            <Section title={t('calendar.events')}>
              {sel.events.map((e) => (
                <DetailRow key={e.id} icon="sparkles" color={palette.gold} title={pick(e.titleEn, e.titleAr)} subtitle={pick(e.locationEn, e.locationAr)} trailing={fmtTime(e.start, lang)} />
              ))}
            </Section>
          ) : null}
          {sel.exams.length ? (
            <Section title={t('calendar.exams')}>
              {sel.exams.map((x) => (
                <DetailRow key={x.id} icon="school" color={palette.red} title={pick(x.examEn, x.examAr)} subtitle={`${t('invigilation.room')} ${x.room}`} trailing={`${x.start}–${x.end}`} />
              ))}
            </Section>
          ) : null}
          {sel.reminders.length ? (
            <Section title={t('calendar.reminders')}>
              {sel.reminders.map((r) => (
                <DetailRow key={r.id} icon="alarm" color={palette.slate} title={r.title} trailing={fmtTime(r.dueAt, lang)} />
              ))}
            </Section>
          ) : null}
          {sel.appointments.length ? (
            <Section title={t('calendar.appointments')}>
              {sel.appointments.map((a) => (
                <DetailRow
                  key={a.id}
                  icon="person"
                  color={palette.blue}
                  title={pick(a.teacherNameEn ?? a.studentNameEn ?? '', a.teacherNameAr ?? a.studentNameAr ?? '') || '—'}
                  trailing={fmtTime(a.startsAt, lang)}
                />
              ))}
            </Section>
          ) : null}
        </View>
      )}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.sm }}>
      <Text variant="label" weight="bold" muted>
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function Calendar() {
  const { user } = useAuth();
  const { t, lang, pick, isRTL } = useLang();
  const router = useRouter();
  const isTeacher = user?.role === 'teacher';
  const [mode, setMode] = useState<Mode>('month');
  const initialDay = WEEK_DAYS.includes(todayWeekday()) ? todayWeekday() : 0;
  const [day, setDay] = useState(initialDay);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchMyAppointments(user.id, user.role === 'teacher' ? 'teacher' : 'student')
      .then(setAppointments)
      .catch(() => {});
  }, [user?.id, user?.role]);

  if (!user) return null;

  const locale = lang === 'ar' ? ar : enUS;
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const weekSunday = new Date(base);
  weekSunday.setDate(base.getDate() - base.getDay());
  const weekDates = WEEK_DAYS.map((off) => {
    const d = new Date(weekSunday);
    d.setDate(weekSunday.getDate() + off);
    return d;
  });

  const schedule = getScheduleFor(user.role);
  const classesFor = (d: number) => schedule.filter((c) => c.day === d).sort((a, b) => a.start.localeCompare(b.start));
  const duties = getInvigilations().slice().sort((a, b) => a.date.localeCompare(b.date));

  const options = [
    { label: t('calendar.month'), value: 'month' as Mode },
    { label: t('calendar.week'), value: 'week' as Mode },
    { label: t('calendar.day'), value: 'day' as Mode },
    ...(isTeacher ? [{ label: t('calendar.duties'), value: 'duties' as Mode }] : []),
  ];

  return (
    <View style={{ flex: 1 }}>
      <Header
        back
        onBack={() => (router.canGoBack() ? router.back() : router.navigate('/(tabs)'))}
        title={t('tabs.calendar')}
        subtitle={t('sections.calendar.subtitle')}
      />
      <Screen scroll>
        <View style={{ marginBottom: spacing.md }}>
          <SegmentedControl value={mode} onChange={(v) => setMode(v)} options={options} />
        </View>

        {mode === 'month' ? (
          <MonthView schedule={schedule} events={getEvents()} invigilations={duties} reminders={getReminders()} appointments={appointments} />
        ) : mode === 'duties' ? (
          <View style={{ gap: spacing.sm }}>
            {duties.map((d) => (
              <Card key={d.id}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text weight="semibold">{pick(d.examEn, d.examAr)}</Text>
                    <Text variant="label" muted style={{ marginTop: 2 }}>
                      {fmtDate(d.date, lang)} · {d.start}–{d.end} · {t('invigilation.room')} {d.room}
                    </Text>
                  </View>
                  <Badge label={d.role === 'chief' ? t('invigilation.chief') : t('invigilation.assistant')} tone={d.role === 'chief' ? 'primary' : 'neutral'} />
                </View>
              </Card>
            ))}
          </View>
        ) : mode === 'week' ? (
          <View style={{ gap: spacing.lg }}>
            {weekDates.map((d) => {
              const dayClasses = classesFor(d.getDay());
              const isToday = d.getDay() === todayWeekday();
              return (
                <View key={d.toISOString()}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                    <Text variant="subtitle" weight="bold">
                      {format(d, 'EEEE', { locale })}
                    </Text>
                    <Text variant="label" muted>
                      {format(d, 'd MMM', { locale })}
                    </Text>
                    {isToday ? <Badge label={t('common.today')} tone="primary" /> : null}
                  </View>
                  {dayClasses.length === 0 ? (
                    <Text variant="label" muted>
                      {t('calendar.noItems')}
                    </Text>
                  ) : (
                    <View style={{ gap: spacing.sm }}>
                      {dayClasses.map((c) => (
                        <ClassCard key={c.id} c={c} />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm }}>
                {weekDates.map((d) => {
                  const active = d.getDay() === day;
                  const isToday = d.getDay() === todayWeekday();
                  return (
                    <Pressable
                      key={d.toISOString()}
                      onPress={() => setDay(d.getDay())}
                      style={{
                        width: 56,
                        paddingVertical: spacing.sm,
                        borderRadius: radius.md,
                        alignItems: 'center',
                        backgroundColor: active ? colors.primary : colors.surface,
                        borderWidth: 1,
                        borderColor: active ? colors.primary : colors.border,
                      }}
                    >
                      <Text variant="caption" color={active ? 'rgba(255,255,255,0.85)' : colors.textMuted}>
                        {format(d, 'EEE', { locale })}
                      </Text>
                      <Text variant="subtitle" weight="bold" color={active ? '#fff' : colors.text}>
                        {format(d, 'd', { locale })}
                      </Text>
                      {isToday ? <View style={{ width: 4, height: 4, borderRadius: 2, marginTop: 2, backgroundColor: active ? '#fff' : colors.primary }} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {classesFor(day).length === 0 ? (
              <EmptyState icon="calendar-outline" title={t('calendar.noItems')} />
            ) : (
              <View style={{ gap: spacing.sm }}>
                {classesFor(day).map((c) => (
                  <ClassCard key={c.id} c={c} />
                ))}
              </View>
            )}
          </>
        )}
      </Screen>
    </View>
  );
}
