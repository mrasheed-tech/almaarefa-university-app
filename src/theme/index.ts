export { colors, palette, gradients } from './colors';
export type { ColorToken } from './colors';
export { spacing, radius, typography, shadows } from './tokens';

import { colors, palette, gradients } from './colors';
import { spacing, radius, typography, shadows } from './tokens';

export const theme = {
  colors,
  palette,
  gradients,
  spacing,
  radius,
  typography,
  shadows,
} as const;

export type Theme = typeof theme;
