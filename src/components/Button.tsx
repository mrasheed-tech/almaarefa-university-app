import { ActivityIndicator, Pressable, View, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { colors, radius, spacing } from '@/theme';
import { useLang } from '@/hooks/useLang';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const heights: Record<Size, number> = { sm: 38, md: 48, lg: 54 };
const fontSizes: Record<Size, number> = { sm: 14, md: 16, lg: 17 };

function palette(variant: Variant): { bg: string; fg: string; border: string } {
  switch (variant) {
    case 'primary':
      return { bg: colors.primary, fg: colors.textOnPrimary, border: colors.primary };
    case 'secondary':
      return { bg: colors.accent, fg: '#3D2B00', border: colors.accent };
    case 'danger':
      return { bg: colors.danger, fg: colors.textOnPrimary, border: colors.danger };
    case 'outline':
      return { bg: 'transparent', fg: colors.primary, border: colors.primary };
    case 'ghost':
    default:
      return { bg: 'transparent', fg: colors.primary, border: 'transparent' };
  }
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: Props) {
  const { isRTL } = useLang();
  const { bg, fg, border } = palette(variant);
  const isDisabled = disabled || loading;

  const container: ViewStyle = {
    height: heights[size],
    backgroundColor: bg,
    borderColor: border,
    borderWidth: variant === 'outline' ? 1.5 : 0,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: isRTL ? 'row-reverse' : 'row',
    gap: spacing.sm,
    opacity: isDisabled ? 0.5 : 1,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [container, pressed && !isDisabled && { opacity: 0.85 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.sm }}>
          {icon ? <Ionicons name={icon} size={fontSizes[size] + 2} color={fg} /> : null}
          <Text color={fg} weight="semibold" style={{ fontSize: fontSizes[size] }}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
