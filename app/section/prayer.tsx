import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { fmtDate } from '@/lib/datetime';
import { colors, palette, radius, spacing } from '@/theme';

const PRAYERS: { en: string; ar: string; time: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { en: 'Fajr', ar: 'الفجر', time: '03:48', icon: 'cloudy-night' },
  { en: 'Dhuhr', ar: 'الظهر', time: '11:54', icon: 'sunny' },
  { en: 'Asr', ar: 'العصر', time: '15:20', icon: 'partly-sunny' },
  { en: 'Maghrib', ar: 'المغرب', time: '18:42', icon: 'cloudy-night' },
  { en: 'Isha', ar: 'العشاء', time: '20:12', icon: 'moon' },
];

function nextPrayerIndex(): number {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < PRAYERS.length; i++) {
    const [h, m] = PRAYERS[i].time.split(':').map(Number);
    if (h * 60 + m >= mins) return i;
  }
  return 0;
}

export default function Prayer() {
  const { t, lang, pick, isRTL } = useLang();
  const next = nextPrayerIndex();

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.prayer.title')} subtitle={fmtDate(new Date().toISOString(), lang)} />
      <Screen scroll>
        <View style={{ gap: spacing.sm }}>
          {PRAYERS.map((p, i) => {
            const active = i === next;
            return (
              <Card key={p.en} style={active ? { borderColor: colors.primary, borderWidth: 1.5 } : undefined}>
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
      </Screen>
    </View>
  );
}
