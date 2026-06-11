import { View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { colors, palette, radius, spacing } from '@/theme';

export type BadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'neutral';

const tones: Record<BadgeTone, { bg: string; fg: string }> = {
  primary: { bg: colors.primaryTint, fg: colors.primaryDark },
  success: { bg: colors.successTint, fg: palette.green },
  warning: { bg: colors.warningTint, fg: palette.goldDark },
  danger: { bg: colors.dangerTint, fg: colors.danger },
  info: { bg: colors.infoTint, fg: colors.info },
  accent: { bg: colors.accentTint, fg: palette.goldDark },
  neutral: { bg: palette.gray100, fg: colors.textSecondary },
};

interface Props {
  label: string;
  tone?: BadgeTone;
  dot?: boolean;
  style?: ViewStyle;
}

export function Badge({ label, tone = 'neutral', dot = false, style }: Props) {
  const c = tones[tone];
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          alignSelf: 'flex-start',
          backgroundColor: c.bg,
          paddingHorizontal: spacing.sm,
          paddingVertical: 3,
          borderRadius: radius.pill,
        },
        style,
      ]}
    >
      {dot ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.fg }} /> : null}
      <Text variant="caption" weight="semibold" color={c.fg}>
        {label}
      </Text>
    </View>
  );
}
