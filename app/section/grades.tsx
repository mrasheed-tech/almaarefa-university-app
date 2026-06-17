import { useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header, Screen, SegmentedControl, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { getGrades } from '@/data';
import { colors, gradients, radius, spacing } from '@/theme';

function gradeColor(points: number): string {
  if (points >= 3.75) return colors.success;
  if (points >= 3) return colors.primary;
  if (points >= 2) return colors.warning;
  return colors.danger;
}

// Saudi universities issue two warnings before exam denial:
//   إنذار أول  at 10%  (first warning)
//   إنذار ثاني at 20%  (second warning)
//   حرمان      at 25%  (exam denial)
const WARNING_1 = 10;
const WARNING_2 = 20;
const DENIAL_THRESHOLD = 25;

function absenceColor(rate: number): string {
  if (rate >= DENIAL_THRESHOLD) return colors.danger;
  if (rate >= WARNING_2) return '#E07000'; // deep orange for second warning
  if (rate >= WARNING_1) return colors.warning;
  return colors.success;
}

const TOTAL_SESSIONS = 24;

export default function Grades() {
  const { user } = useAuth();
  const { t, pick, isRTL } = useLang();
  const [tab, setTab] = useState<'grades' | 'attendance'>('grades');
  const rows = getGrades();
  const credits = rows.reduce((s, r) => s + r.credits, 0);

  // Attendance is "imported from the university Portal". Until IT exposes a
  // Portal API we derive a deterministic demo record per enrolled course —
  // this map is the single swap point for the real Portal feed.
  const attendance = rows.map((r, i) => {
    // Spread demo absences so a couple of courses approach the denial line.
    const absent = (i * 2) % 7;
    const late = (i + 1) % 2;
    const present = TOTAL_SESSIONS - absent - late;
    return { ...r, present, absent, late, absenceRate: Math.round((absent / TOTAL_SESSIONS) * 100) };
  });
  const overallAbsence = attendance.length
    ? Math.round(attendance.reduce((s, a) => s + a.absenceRate, 0) / attendance.length)
    : 0;

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.grades.title')} subtitle={t('sections.grades.subtitle')} />
      <Screen scroll>
        <View style={{ marginBottom: spacing.md }}>
          <SegmentedControl
            value={tab}
            onChange={setTab}
            options={[
              { label: t('grades.tabGrades'), value: 'grades' },
              { label: t('grades.tabAttendance'), value: 'attendance' },
            ]}
          />
        </View>

        {tab === 'grades' ? (
          <>
            <LinearGradient
              colors={gradients.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: radius.xl, padding: spacing.lg, flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}
            >
              <View>
                <Text color="rgba(255,255,255,0.85)" variant="label">
                  GPA
                </Text>
                <Text color="#fff" weight="bold" style={{ fontSize: 40 }}>
                  {(user?.gpa ?? 0).toFixed(2)}
                </Text>
              </View>
              <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end', justifyContent: 'center' }}>
                <Text color="rgba(255,255,255,0.85)" variant="label">
                  {t('calendar.classes')}
                </Text>
                <Text color="#fff" weight="bold" variant="title">
                  {rows.length} · {credits} cr
                </Text>
              </View>
            </LinearGradient>

            <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
              {rows.map((r) => (
                <Card key={r.code}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                    <View style={{ flex: 1 }}>
                      <Text weight="semibold">{pick(r.titleEn, r.titleAr)}</Text>
                      <Text variant="label" muted>
                        {r.code} · {r.credits} cr
                      </Text>
                    </View>
                    <View
                      style={{
                        minWidth: 46,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: radius.md,
                        backgroundColor: gradeColor(r.points) + '1A',
                        alignItems: 'center',
                      }}
                    >
                      <Text weight="bold" color={gradeColor(r.points)}>
                        {r.grade}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </>
        ) : (
          <>
            <LinearGradient
              colors={gradients.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: radius.xl, padding: spacing.lg, flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <View>
                <Text color="rgba(255,255,255,0.85)" variant="label">
                  {t('grades.absenceRate')}
                </Text>
                <Text color="#fff" weight="bold" style={{ fontSize: 40 }}>
                  {overallAbsence}%
                </Text>
              </View>
              <Ionicons name="people-circle" size={56} color="rgba(255,255,255,0.85)" />
            </LinearGradient>

            <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
              {attendance.map((a) => {
                const barFill = Math.min(100, Math.round((a.absenceRate / DENIAL_THRESHOLD) * 100));
                const warningColor = absenceColor(a.absenceRate);
                const warningLabel =
                  a.absenceRate >= DENIAL_THRESHOLD
                    ? { icon: 'warning' as const, text: t('grades.denied'), color: colors.danger }
                    : a.absenceRate >= WARNING_2
                    ? { icon: 'alert-circle' as const, text: pick('Second warning', 'إنذار ثاني'), color: '#E07000' }
                    : a.absenceRate >= WARNING_1
                    ? { icon: 'alert-circle-outline' as const, text: pick('First warning', 'إنذار أول'), color: colors.warning }
                    : null;
                return (
                  <Card key={a.code}>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                      <View style={{ flex: 1 }}>
                        <Text weight="semibold">{pick(a.titleEn, a.titleAr)}</Text>
                        <Text variant="label" muted style={{ marginTop: 2 }}>
                          {t('grades.absent')} {a.absent} · {t('grades.late')} {a.late} · {t('grades.present')} {a.present}
                        </Text>
                        <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden', marginTop: 6 }}>
                          <View style={{ width: `${barFill}%`, height: 5, backgroundColor: warningColor }} />
                        </View>
                        {warningLabel ? (
                          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                            <Ionicons name={warningLabel.icon} size={13} color={warningLabel.color} />
                            <Text variant="caption" color={warningLabel.color} weight="semibold">
                              {warningLabel.text}
                            </Text>
                          </View>
                        ) : (
                          <Text variant="caption" muted style={{ marginTop: 6 }}>
                            {t('grades.denialWarning', { threshold: DENIAL_THRESHOLD })}
                          </Text>
                        )}
                      </View>
                      <Text weight="bold" color={absenceColor(a.absenceRate)}>
                        {a.absenceRate}%
                      </Text>
                    </View>
                  </Card>
                );
              })}
            </View>
          </>
        )}

        <Text variant="caption" muted center style={{ marginTop: spacing.lg }}>
          {t('grades.syncedFromPortal')}
        </Text>
      </Screen>
    </View>
  );
}
