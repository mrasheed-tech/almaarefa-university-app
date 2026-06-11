import { Linking, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Header, ListItem, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { colors, palette, radius, spacing } from '@/theme';

const SERVICES: { icon: keyof typeof Ionicons.glyphMap; en: string; ar: string; color: string }[] = [
  { icon: 'search', en: 'Search the catalog', ar: 'البحث في الفهرس', color: palette.blue },
  { icon: 'cube', en: 'Digital databases', ar: 'قواعد البيانات الرقمية', color: palette.teal },
  { icon: 'people', en: 'Book a study room', ar: 'حجز قاعة دراسة', color: palette.green },
  { icon: 'book', en: 'My borrowed books', ar: 'كتبي المستعارة', color: palette.goldDark },
];

export default function Library() {
  const { t, pick, isRTL } = useLang();

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.library.title')} subtitle={t('sections.library.subtitle')} />
      <Screen scroll>
        <Card>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
            <View style={{ width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.successTint, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="time" size={22} color={palette.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text weight="semibold">{pick('Open now', 'مفتوحة الآن')}</Text>
              <Text variant="label" muted>
                {pick('Sun–Thu · 8:00 AM – 10:00 PM', 'الأحد–الخميس · ٨ ص – ١٠ م')}
              </Text>
            </View>
          </View>
        </Card>

        <View style={{ marginTop: spacing.md }}>
          <Card>
            {SERVICES.map((s, i) => (
              <View key={s.en} style={{ borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.divider }}>
                <ListItem
                  icon={s.icon}
                  iconColor={s.color}
                  iconBg={s.color + '1A'}
                  title={pick(s.en, s.ar)}
                  chevron
                  onPress={() => Linking.openURL('https://www.um.edu.sa/en/')}
                />
              </View>
            ))}
          </Card>
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <Button title={pick('Open library portal', 'فتح بوابة المكتبة')} icon="open-outline" variant="outline" onPress={() => Linking.openURL('https://www.um.edu.sa/en/')} />
        </View>
      </Screen>
    </View>
  );
}
