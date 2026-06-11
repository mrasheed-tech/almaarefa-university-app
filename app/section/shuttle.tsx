import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { getShuttleRoutes } from '@/data';
import { colors, radius, spacing } from '@/theme';

function nextIndex(times: string[]): number {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < times.length; i++) {
    const [h, m] = times[i].split(':').map(Number);
    if (h * 60 + m >= mins) return i;
  }
  return -1;
}

export default function Shuttle() {
  const { t, pick, isRTL } = useLang();
  const routes = getShuttleRoutes();

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.shuttle.title')} subtitle={t('sections.shuttle.subtitle')} />
      <Screen scroll>
        <View style={{ gap: spacing.md }}>
          {routes.map((r) => {
            const ni = nextIndex(r.times);
            return (
              <Card key={r.id} padded={false}>
                <View style={{ height: 6, backgroundColor: r.color, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg }} />
                <View style={{ padding: spacing.lg }}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text weight="bold" style={{ flex: 1 }}>
                      {pick(r.nameEn, r.nameAr)}
                    </Text>
                    <Badge label={t('shuttle.everyMinutes', { minutes: r.everyMinutes })} tone="neutral" />
                  </View>

                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <Ionicons name="navigate-outline" size={14} color={colors.textMuted} />
                    <Text variant="label" muted>
                      {pick(r.fromEn, r.fromAr)} → {pick(r.toEn, r.toAr)}
                    </Text>
                  </View>

                  <Text variant="caption" weight="semibold" color={colors.textSecondary} style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
                    {t('shuttle.nextDepartures')}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                    {r.times.map((time, i) => {
                      const isNext = i === ni;
                      const passed = ni !== -1 && i < ni;
                      return (
                        <View
                          key={time}
                          style={{
                            paddingHorizontal: spacing.md,
                            paddingVertical: 6,
                            borderRadius: radius.pill,
                            backgroundColor: isNext ? colors.primary : colors.surfaceAlt,
                            opacity: passed ? 0.45 : 1,
                          }}
                        >
                          <Text variant="label" weight={isNext ? 'semibold' : 'regular'} color={isNext ? '#fff' : colors.textSecondary}>
                            {time}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      </Screen>
    </View>
  );
}
