import { useState } from 'react';
import { Pressable, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { colors, radius, spacing, typography } from '@/theme';
import { useLang } from '@/hooks/useLang';

interface Props extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secure?: boolean;
  multiline?: boolean;
}

export function TextField({ label, icon, secure, multiline, style, ...rest }: Props) {
  const { isRTL } = useLang();
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text variant="label" weight="medium" color={colors.textSecondary}>
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          gap: spacing.sm,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: multiline ? spacing.sm : 0,
          minHeight: multiline ? 96 : 50,
        }}
      >
        {icon ? <Ionicons name={icon} size={18} color={colors.textMuted} style={{ marginTop: multiline ? 8 : 0 }} /> : null}
        <TextInput
          style={[
            {
              flex: 1,
              fontSize: typography.size.md,
              color: colors.text,
              textAlign: isRTL ? 'right' : 'left',
              height: multiline ? 88 : '100%',
              textAlignVertical: multiline ? 'top' : 'center',
            },
            style,
          ]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          multiline={multiline}
          {...rest}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
