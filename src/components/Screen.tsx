import { ReactNode } from 'react';
import { ScrollView, View, ViewStyle, StyleProp, RefreshControlProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: string;
  contentStyle?: StyleProp<ViewStyle>;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  background = colors.background,
  contentStyle,
  refreshControl,
}: Props) {
  const insets = useSafeAreaInsets();
  const pad = padded ? spacing.lg : 0;
  const container: ViewStyle = { flex: 1, backgroundColor: background };

  if (scroll) {
    return (
      <View style={container}>
        <ScrollView
          contentContainerStyle={[
            { padding: pad, paddingBottom: pad + insets.bottom + spacing.xl },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[container, { padding: pad, paddingBottom: pad + insets.bottom }, contentStyle]}>
      {children}
    </View>
  );
}
