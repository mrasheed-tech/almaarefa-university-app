import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppIcon, Card, Header, Screen, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { servicesByGroup, type ServiceGroup } from '@/features/services/catalog';
import { colors, spacing } from '@/theme';

const GROUPS: ServiceGroup[] = ['academic', 'campus', 'support'];

export default function Services() {
  const { user } = useAuth();
  const { t, isRTL } = useLang();
  const router = useRouter();
  if (!user) return null;
  const chevron = isRTL ? 'chevron-back' : 'chevron-forward';

  return (
    <View style={{ flex: 1 }}>
      <Header title={t('tabs.services')} subtitle={t('services.headerSubtitle')} />
      <Screen scroll>
        {GROUPS.map((group) => {
          const items = servicesByGroup(user.role, group);
          if (items.length === 0) return null;
          return (
            <View key={group} style={{ marginBottom: spacing.lg }}>
              <Text
                variant="label"
                weight="semibold"
                color={colors.textMuted}
                style={{ marginBottom: spacing.sm, textAlign: isRTL ? 'right' : 'left' }}
              >
                {t(`services.${group}`)}
              </Text>
              <Card padded={false}>
                {items.map((s, i) => (
                  <Pressable
                    key={s.key}
                    onPress={() => router.push(s.route as never)}
                    style={({ pressed }) => [
                      {
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        gap: spacing.md,
                        paddingVertical: 14,
                        paddingHorizontal: spacing.md,
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderTopColor: colors.divider,
                      },
                      pressed && { backgroundColor: colors.surfaceAlt },
                    ]}
                  >
                    <AppIcon name={s.icon} size={21} color={colors.textSecondary} />
                    <Text style={{ flex: 1 }}>{t(`sections.${s.key}.title`)}</Text>
                    <Ionicons name={chevron} size={16} color={colors.textMuted} />
                  </Pressable>
                ))}
              </Card>
            </View>
          );
        })}
      </Screen>
    </View>
  );
}
