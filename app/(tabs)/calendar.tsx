import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Badge, Card, EmptyState, Header, Screen, SegmentedControl, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { colors, radius, spacing } from '@/theme';
import { getInvigilations, getScheduleFor } from '@/data';
import { fmtDate, todayWeekday } from '@/lib/datetime';

const WEEK_DAYS = [0, 1, 2, 3, 4]; // Sun–Thu (KSA academic week)

export default function Calendar() {
  const { user } = useAuth();
  const { t, lang, pick, isRTL } = useLang();
  const [mode, setMode] = useState<'classes' | 'duties'>('classes');
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

  const classes = getScheduleFor(user.role)
    .filter((c) => c.day === day)
    .sort((a, b) => a.start.localeCompare(b.start));
  const duties = getInvigilations().slice().sort((a, b) => a.date.localeCompare(b.date));

  return (
    <View style={{ flex: 1 }}>
      <Header title={t('tabs.calendar')} subtitle={t('sections.calendar.subtitle')} />
      <Screen scroll>
        {user.role === 'teacher' ? (
          <View style={{ marginBottom: spacing.md }}>
            <SegmentedControl
              value={mode}
              onChange={setMode}
              options={[
                { label: t('calendar.classes'), value: 'classes' },
                { label: t('calendar.duties'), value: 'duties' },
              ]}
            />
          </View>
        ) : null}

        {mode === 'classes' ? (
          <>
            {/* Weekday selector */}
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
                      {isToday ? (
                        <View style={{ width: 4, height: 4, borderRadius: 2, marginTop: 2, backgroundColor: active ? '#fff' : colors.primary }} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {classes.length === 0 ? (
              <EmptyState icon="calendar-outline" title={t('calendar.noItems')} />
            ) : (
              <View style={{ gap: spacing.sm }}>
                {classes.map((c) => (
                  <Card key={c.id}>
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
                ))}
              </View>
            )}
          </>
        ) : (
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
                  <Badge
                    label={d.role === 'chief' ? t('invigilation.chief') : t('invigilation.assistant')}
                    tone={d.role === 'chief' ? 'primary' : 'neutral'}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}
      </Screen>
    </View>
  );
}
