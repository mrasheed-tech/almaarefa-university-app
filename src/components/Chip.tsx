import { Pressable } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing } from '@/theme';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function Chip({ label, active = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderRadius: radius.pill,
        backgroundColor: active ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
      }}
    >
      <Text variant="label" weight={active ? 'semibold' : 'regular'} color={active ? '#fff' : colors.textSecondary}>
        {label}
      </Text>
    </Pressable>
  );
}
