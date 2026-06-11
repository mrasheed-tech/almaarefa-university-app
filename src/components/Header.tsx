import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from './Text';
import { gradients, spacing } from '@/theme';
import { useLang } from '@/hooks/useLang';

interface Props {
  title: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
}

export function Header({ title, subtitle, back = false, onBack, right }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isRTL } = useLang();

  return (
    <LinearGradient
      colors={gradients.brand}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: insets.top + spacing.sm,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        {back ? (
          <Pressable onPress={onBack ?? (() => router.back())} hitSlop={12}>
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={26} color="#fff" />
          </Pressable>
        ) : null}
        <View style={{ flex: 1 }}>
          <Text variant="title" color="#FFFFFF" weight="bold">
            {title}
          </Text>
          {subtitle ? (
            <Text variant="label" color="rgba(255,255,255,0.9)">
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right}
      </View>
    </LinearGradient>
  );
}
