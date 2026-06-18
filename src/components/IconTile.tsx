import { Pressable, View, type DimensionValue } from 'react-native';
import { AppIcon, type AppIconName } from './AppIcon';
import { Text } from './Text';
import { colors, radius } from '@/theme';

interface Props {
  icon: AppIconName;
  label: string;
  color?: string;
  bg?: string;
  count?: number;
  width?: DimensionValue;
  onPress?: () => void;
}

export function IconTile({ icon, label, color = colors.primary, bg = colors.primaryTint, count, width = 76, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', width, gap: 6, marginBottom: 4 }}>
      <View
        style={{
          width: 58,
          height: 58,
          borderRadius: radius.lg,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppIcon name={icon} size={25} color={color} />
        {count && count > 0 ? (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 20,
              height: 20,
              paddingHorizontal: 5,
              borderRadius: 10,
              backgroundColor: colors.danger,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: colors.surface,
            }}
          >
            <Text variant="caption" color="#fff" weight="bold" style={{ fontSize: 10 }}>
              {count > 9 ? '9+' : count}
            </Text>
          </View>
        ) : null}
      </View>
      <Text variant="caption" center numberOfLines={2} weight="medium">
        {label}
      </Text>
    </Pressable>
  );
}
