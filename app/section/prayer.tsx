import { View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { fmtDate } from '@/lib/datetime';
import { PRAYER_META, fetchPrayerTimes, nextPrayerIndex } from '@/lib/prayer';
import { colors, palette, radius, spacing } from '@/theme';

export default function Prayer() {
  const { t, lang, pick, isRTL } = useLang();

  // Live times from Aladhan (Umm Al-Qura method); PRAYER_META is the fallback.
  const { data: prayers = PRAYER_META, isLoading } = useQuery({
    queryKey: ['prayer-times'],
    queryFn: fetchPrayerTimes,
    staleTime: 6 * 60 * 60 * 1000, // refresh roughly twice a day
  });

  const next = nextPrayerIndex(prayers);

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.prayer.title')} subtitle={fmtDate(new Date().toISOString(), lang)} />
      <Screen scroll>
        <View style={{ gap: spacing.sm }}>
          {prayers.map((p, i) => {
            const active = i === next;
            return (
              <Card key={p.key} style={active ? { borderColor: colors.primary, borderWidth: 1.5 } : undefined}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                  <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: active ? colors.primary : colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={p.icon} size={22} color={active ? '#fff' : palette.slate} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text weight="semibold">{pick(p.en, p.ar)}</Text>
                    {active ? (
                      <Text variant="caption" color={colors.primary} weight="semibold">
                        {pick('Next prayer', 'الصلاة القادمة')}
                      </Text>
                    ) : null}
                  </View>
                  <Text weight="bold" variant="subtitle" color={active ? colors.primary : colors.text}>
                    {p.time}
                  </Text>
                </View>
              </Card>
            );
          })}
        </View>

        <Text variant="caption" muted center style={{ marginTop: spacing.lg }}>
          {isLoading ? t('common.loading') : pick('Umm Al-Qura · Riyadh', 'أم القرى · الرياض')}
        </Text>
      </Screen>
    </View>
  );
}
