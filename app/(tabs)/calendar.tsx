import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Badge, Card, EmptyState, Header, Screen, SegmentedControl, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { colors, radius, spacing } from '@/theme';
import { getInvigilations, getScheduleFor } from '@/data';
import { fmtDate, todayWeekday } from '@/lib/datetime';
import type { ClassSession } from '@/data/types';

const WEEK_DAYS = [0, 1, 2, 3, 4]; // Sun–Thu (KSA academic week)
type Mode = 'week' | 'day' | 'duties';

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

export default function Calendar() {
  const { user } = useAuth();
  const { t, lang, pick, isRTL } = useLang();
  const router = useRouter();
  const isTeacher = user?.role === 'teacher';
  const [mode, setMode] = useState<Mode>('week');
  const initialDay = WEEK_DAYS.includes(todayWeekday()) ? todayWeekday() : 0;
  const [day, setDay] = useState(initialDay);
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

  const options = isTeacher
    ? [
        { label: t('calendar.week'), value: 'week' as Mode },
        { label: t('calendar.day'), value: 'day' as Mode },
        { label: t('calendar.duties'), value: 'duties' as Mode },
      ]
    : [
        { label: t('calendar.week'), value: 'week' as Mode },
        { label: t('calendar.day'), value: 'day' as Mode },
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

        {mode === 'duties' ? (
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
