import { Pressable, View } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing } from '@/theme';
import { useLang } from '@/hooks/useLang';

interface Option<T extends string> {
  label: string;
  value: T;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  const { isRTL } = useLang();
  return (
    <View
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        backgroundColor: colors.surfaceAlt,
        borderRadius: radius.md,
        padding: 4,
        gap: 4,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              borderRadius: radius.sm,
              backgroundColor: active ? colors.surface : 'transparent',
              alignItems: 'center',
              ...(active ? { shadowColor: '#0B2B33', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 } : {}),
            }}
          >
            <Text
              variant="label"
              weight={active ? 'semibold' : 'regular'}
              color={active ? colors.primary : colors.textSecondary}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
