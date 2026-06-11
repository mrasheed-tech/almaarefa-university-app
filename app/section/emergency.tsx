import { Linking, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { getEmergencyContacts } from '@/data';
import { colors, palette, radius, spacing } from '@/theme';

export default function Emergency() {
  const { t, isRTL } = useLang();
  const contacts = getEmergencyContacts();
  const security = contacts[0];

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.emergency.title')} subtitle={t('sections.emergency.subtitle')} />
      <Screen scroll>
        {/* SOS */}
        <Pressable
          onPress={() => Linking.openURL(`tel:${security.number}`)}
          style={{
            backgroundColor: colors.danger,
            borderRadius: radius.xl,
            padding: spacing.xl,
            alignItems: 'center',
            gap: spacing.sm,
          }}
        >
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="warning" size={32} color="#fff" />
          </View>
          <Text variant="title" color="#fff" weight="bold">
            {t('emergency.sos')}
          </Text>
          <Text color="rgba(255,255,255,0.9)" center variant="label">
            {t('emergency.sosNote')}
          </Text>
        </Pressable>

        <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
          {contacts.map((c) => (
            <Card key={c.id} onPress={() => Linking.openURL(`tel:${c.number}`)}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.dangerTint, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={22} color={colors.danger} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text weight="semibold">{t(c.labelKey)}</Text>
                  <Text variant="label" muted>
                    {c.number}
                  </Text>
                </View>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="call" size={18} color="#fff" />
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <Text variant="caption" muted>
            {t('emergency.tip')}
          </Text>
        </View>
      </Screen>
    </View>
  );
}
