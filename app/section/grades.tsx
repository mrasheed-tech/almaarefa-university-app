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

// Absence is what students watch: in Saudi universities, crossing the denial
// threshold (typically 25%) bars you from the final exam (حرمان).
const DENIAL_THRESHOLD = 25;

function absenceColor(rate: number): string {
  if (rate >= DENIAL_THRESHOLD) return colors.danger;
  if (rate >= 15) return colors.warning;
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
                const denialRisk = a.absenceRate >= DENIAL_THRESHOLD;
                // Bar fills toward the denial threshold so students see how close they are.
                const barFill = Math.min(100, Math.round((a.absenceRate / DENIAL_THRESHOLD) * 100));
                return (
                  <Card key={a.code}>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                      <View style={{ flex: 1 }}>
                        <Text weight="semibold">{pick(a.titleEn, a.titleAr)}</Text>
                        <Text variant="label" muted style={{ marginTop: 2 }}>
                          {t('grades.absent')} {a.absent} · {t('grades.late')} {a.late} · {t('grades.present')} {a.present}
                        </Text>
                        <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden', marginTop: 6 }}>
                          <View style={{ width: `${barFill}%`, height: 5, backgroundColor: absenceColor(a.absenceRate) }} />
                        </View>
                        {denialRisk ? (
                          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                            <Ionicons name="warning" size={13} color={colors.danger} />
                            <Text variant="caption" color={colors.danger} weight="semibold">
                              {t('grades.denied')}
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
