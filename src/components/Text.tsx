import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { colors, typography } from '@/theme';
import { useLang } from '@/hooks/useLang';

type Variant = 'display' | 'title' | 'heading' | 'subtitle' | 'body' | 'label' | 'caption';
type Weight = keyof typeof typography.weight;

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  weight?: Weight;
  center?: boolean;
  muted?: boolean;
}

const sizeFor: Record<Variant, number> = {
  display: typography.size.display,
  title: typography.size.xxl,
  heading: typography.size.xl,
  subtitle: typography.size.lg,
  body: typography.size.md,
  label: typography.size.sm,
  caption: typography.size.xs,
};

const defaultWeight: Record<Variant, Weight> = {
  display: 'bold',
  title: 'bold',
  heading: 'semibold',
  subtitle: 'semibold',
  body: 'regular',
  label: 'medium',
  caption: 'regular',
};

export function Text({ variant = 'body', color, weight, center, muted, style, ...rest }: Props) {
  const { dir } = useLang();
  const resolved: TextStyle = {
    fontSize: sizeFor[variant],
    color: color ?? (muted ? colors.textSecondary : colors.text),
    fontWeight: typography.weight[weight ?? defaultWeight[variant]] as TextStyle['fontWeight'],
    textAlign: center ? 'center' : dir === 'rtl' ? 'right' : 'left',
    writingDirection: dir,
  };
  return <RNText style={[resolved, style]} {...rest} />;
}
