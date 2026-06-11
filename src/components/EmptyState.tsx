import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { colors, spacing } from '@/theme';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon = 'sparkles-outline', title, subtitle }: Props) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl, gap: spacing.sm }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.primaryTint,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={30} color={colors.primary} />
      </View>
      <Text variant="subtitle" weight="semibold" center>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body" muted center style={{ maxWidth: 260 }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
