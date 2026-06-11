/**
 * Almaarefa University brand palette — extracted from the live um.edu.sa site & logo.
 * Primary teal #00ADCA, gold accent #FFB606, slate neutral #4C6176.
 */
export const palette = {
  teal: '#00ADCA',
  tealDark: '#18A4BD',
  tealDeep: '#0B6E80',
  tealTint: '#E3F6FA',
  gold: '#FFB606',
  goldDark: '#E0A000',
  goldTint: '#FFF4DA',
  green: '#4AA485',
  greenTint: '#E5F3EE',
  slate: '#4C6176',
  ink: '#222B36',
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F7FAFC',
  gray100: '#F1F5F8',
  gray200: '#E5EAF0',
  gray300: '#CBD5E0',
  gray400: '#94A3B8',
  gray500: '#64748B',
  red: '#E5484D',
  redTint: '#FDECEC',
  blue: '#2E67F5',
  blueTint: '#E7EEFE',
} as const;

export const colors = {
  // Brand
  primary: palette.teal,
  primaryDark: palette.tealDeep,
  primaryTint: palette.tealTint,
  accent: palette.gold,
  accentTint: palette.goldTint,
  secondary: palette.green,

  // Surfaces
  background: palette.gray100,
  surface: palette.white,
  surfaceAlt: palette.gray50,
  border: palette.gray200,
  divider: palette.gray200,

  // Text
  text: palette.ink,
  textSecondary: palette.slate,
  textMuted: palette.gray400,
  textOnPrimary: palette.white,

  // Status
  success: palette.green,
  successTint: palette.greenTint,
  warning: palette.gold,
  warningTint: palette.goldTint,
  danger: palette.red,
  dangerTint: palette.redTint,
  info: palette.blue,
  infoTint: palette.blueTint,

  // Navigation
  tabActive: palette.teal,
  tabInactive: palette.gray400,
} as const;

/** Header / hero gradients (use with a gradient component or layered views). */
export const gradients = {
  brand: [palette.teal, palette.tealDark] as const,
  brandDeep: [palette.tealDark, palette.tealDeep] as const,
  gold: [palette.gold, palette.goldDark] as const,
};

export type ColorToken = keyof typeof colors;
