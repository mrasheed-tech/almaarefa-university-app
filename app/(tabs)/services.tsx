import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconTile, Screen, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { servicesByGroup, type ServiceGroup } from '@/features/services/catalog';
import { spacing } from '@/theme';

const GROUPS: ServiceGroup[] = ['academic', 'campus', 'support'];

export default function Services() {
  const { user } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  if (!user) return null;

  return (
    <View style={{ flex: 1 }}>
      <Header title={t('tabs.services')} subtitle={t('services.headerSubtitle')} />
      <Screen scroll>
        {GROUPS.map((group) => {
          const items = servicesByGroup(user.role, group);
          if (items.length === 0) return null;
          return (
            <View key={group} style={{ marginBottom: spacing.md }}>
              <Text variant="subtitle" weight="bold" style={{ marginBottom: spacing.md, marginTop: spacing.sm }}>
                {t(`services.${group}`)}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, rowGap: spacing.lg }}>
                {items.map((s) => (
                  <IconTile
                    key={s.key}
                    icon={s.icon}
                    color={s.color}
                    bg={s.bg}
                    label={t(`sections.${s.key}.title`)}
                    onPress={() => router.push(s.route as never)}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </Screen>
    </View>
  );
}
