import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/theme';

/**
 * Entry route. The auth gate in app/_layout.tsx immediately redirects to
 * the login screen or the tabs depending on session state.
 */
export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#FFFFFF" />
    </View>
  );
}
