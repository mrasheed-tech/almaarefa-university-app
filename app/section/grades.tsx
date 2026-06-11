import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Header, Screen, Text } from '@/components';
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

export default function Grades() {
  const { user } = useAuth();
  const { t, pick, isRTL } = useLang();
  const rows = getGrades();
  const credits = rows.reduce((s, r) => s + r.credits, 0);

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.grades.title')} subtitle={t('sections.grades.subtitle')} />
      <Screen scroll>
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
      </Screen>
    </View>
  );
}
