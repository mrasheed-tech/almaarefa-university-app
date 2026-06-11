import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { colors, palette, radius, spacing } from '@/theme';

const LOCATIONS: { icon: keyof typeof Ionicons.glyphMap; en: string; ar: string; tagEn: string; tagAr: string; color: string }[] = [
  { icon: 'school', en: 'College of Medicine', ar: 'كلية الطب', tagEn: 'Building A', tagAr: 'مبنى أ', color: palette.teal },
  { icon: 'flask', en: 'Pharmacy & Labs', ar: 'الصيدلة والمختبرات', tagEn: 'Building P', tagAr: 'مبنى P', color: '#6020D2' },
  { icon: 'library', en: 'Main Library', ar: 'المكتبة الرئيسية', tagEn: 'Building L', tagAr: 'مبنى L', color: palette.blue },
  { icon: 'medkit', en: 'Medical Clinic', ar: 'العيادة الطبية', tagEn: 'Building C', tagAr: 'مبنى C', color: palette.red },
  { icon: 'restaurant', en: 'Food Court', ar: 'ساحة الطعام', tagEn: 'Building C', tagAr: 'مبنى C', color: palette.goldDark },
  { icon: 'bus', en: 'Shuttle Station', ar: 'محطة الباصات', tagEn: 'Main Gate', tagAr: 'البوابة الرئيسية', color: palette.green },
  { icon: 'car', en: 'Parking', ar: 'المواقف', tagEn: 'North', tagAr: 'شمال', color: palette.slate },
  { icon: 'football', en: 'Sports Field', ar: 'الملعب الرياضي', tagEn: 'East', tagAr: 'شرق', color: palette.teal },
];

export default function CampusMap() {
  const { t, pick, isRTL } = useLang();

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.map.title')} subtitle={t('sections.map.subtitle')} />
      <Screen scroll>
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: spacing.sm,
            backgroundColor: colors.primaryTint,
            padding: spacing.md,
            borderRadius: radius.md,
            marginBottom: spacing.md,
          }}
        >
          <Ionicons name="map" size={18} color={colors.primaryDark} />
          <Text variant="caption" color={colors.primaryDark} style={{ flex: 1 }}>
            {pick('Interactive turn-by-turn wayfinding is coming soon. Key campus locations below.', 'الخرائط التفاعلية للإرشاد قادمة قريبًا. أبرز المواقع أدناه.')}
          </Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          {LOCATIONS.map((l) => (
            <Card key={l.en}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: l.color + '1A', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={l.icon} size={22} color={l.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text weight="semibold">{pick(l.en, l.ar)}</Text>
                  <Text variant="label" muted>
                    {pick(l.tagEn, l.tagAr)}
                  </Text>
                </View>
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.textMuted} />
              </View>
            </Card>
          ))}
        </View>
      </Screen>
    </View>
  );
}
