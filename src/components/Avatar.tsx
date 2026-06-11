import { View } from 'react-native';
import { Text } from './Text';
import { palette } from '@/theme';

interface Props {
  name: string;
  size?: number;
  color?: string;
}

function initials(name: string): string {
  const parts = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|أ\.|د\.)\s*/i, '').trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? '';
  return (first + second).toUpperCase();
}

export function Avatar({ name, size = 44, color = palette.teal }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text color="#FFFFFF" weight="bold" style={{ fontSize: size * 0.38 }}>
        {initials(name)}
      </Text>
    </View>
  );
}
