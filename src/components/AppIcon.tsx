import type { StyleProp, TextStyle } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

/**
 * Most app icons come from Ionicons, but a few Islamic concepts only exist in
 * FontAwesome5 (e.g. the Ka'ba for prayer — Ionicons has no equivalent, and the
 * MaterialCommunityIcons bundled with this SDK predates its `kaaba` glyph).
 * AppIcon renders the right family by name so callers don't have to care.
 */
const FA5_ICONS = ['kaaba', 'mosque'] as const;
type Fa5Name = (typeof FA5_ICONS)[number];

export type AppIconName = keyof typeof Ionicons.glyphMap | Fa5Name;

function isFa5(name: AppIconName): name is Fa5Name {
  return (FA5_ICONS as readonly string[]).includes(name);
}

interface Props {
  name: AppIconName;
  size: number;
  color: string;
  style?: StyleProp<TextStyle>;
}

export function AppIcon({ name, size, color, style }: Props) {
  if (isFa5(name)) {
    return <FontAwesome5 name={name} size={size} color={color} style={style} solid />;
  }
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
