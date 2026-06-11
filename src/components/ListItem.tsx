import { ReactNode } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { colors, radius, spacing } from '@/theme';
import { useLang } from '@/hooks/useLang';

interface Props {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  value?: string;
  chevron?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ListItem({
  title,
  subtitle,
  icon,
  iconColor = colors.primary,
  iconBg = colors.primaryTint,
  leading,
  trailing,
  value,
  chevron = false,
  onPress,
  style,
}: Props) {
  const { isRTL } = useLang();
  const row: ViewStyle = {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  };

  const content = (
    <View style={[row, style]}>
      {leading
        ? leading
        : icon
          ? (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.md,
                backgroundColor: iconBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={icon} size={20} color={iconColor} />
            </View>
          )
          : null}

      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body" weight="semibold" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="label" muted numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {value ? (
        <Text variant="label" weight="semibold" color={colors.textSecondary}>
          {value}
        </Text>
      ) : null}
      {trailing}
      {chevron ? (
        <Ionicons
          name={isRTL ? 'chevron-back' : 'chevron-forward'}
          size={18}
          color={colors.textMuted}
        />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.6 }}>
        {content}
      </Pressable>
    );
  }
  return content;
}
