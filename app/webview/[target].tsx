import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { config } from '@/lib/config';
import { colors, gradients, spacing } from '@/theme';

const TARGETS: Record<string, { url: string; titleKey: string }> = {
  portal: { url: config.portalUrl, titleKey: 'sections.portal.title' },
  moodle: { url: config.moodleUrl, titleKey: 'sections.moodle.title' },
  webmail: { url: config.webmailUrl, titleKey: 'mail.openWebmail' },
};

export default function WebViewScreen() {
  const { target } = useLocalSearchParams<{ target: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useLang();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const webRef = useRef<WebView>(null);
  const conf = TARGETS[target ?? 'portal'] ?? TARGETS.portal;

  // Safety net so the spinner can never stick forever.
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 12000);
    return () => clearTimeout(id);
  }, []);

  const reload = () => {
    setError(false);
    setLoading(true);
    webRef.current?.reload();
  };

  const Header = (
    <LinearGradient colors={gradients.brand} style={{ paddingTop: insets.top + spacing.sm, paddingBottom: spacing.sm, paddingHorizontal: spacing.md }}>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.sm }}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={26} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text variant="subtitle" color="#fff" weight="bold">
            {t(conf.titleKey)}
          </Text>
          <Text variant="caption" color="rgba(255,255,255,0.85)" numberOfLines={1}>
            {conf.url.replace('https://', '')}
          </Text>
        </View>
        {Platform.OS !== 'web' ? (
          <Pressable onPress={reload} hitSlop={10}>
            <Ionicons name="reload" size={21} color="#fff" />
          </Pressable>
        ) : null}
        <Pressable onPress={() => Linking.openURL(conf.url)} hitSlop={10}>
          <Ionicons name="open-outline" size={22} color="#fff" />
        </Pressable>
      </View>
    </LinearGradient>
  );

  const SecureNote = (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, padding: spacing.sm, backgroundColor: colors.primaryTint }}>
      <Ionicons name="lock-closed" size={13} color={colors.primaryDark} />
      <Text variant="caption" color={colors.primaryDark} style={{ flex: 1 }}>
        {t('webview.secureNote')}
      </Text>
    </View>
  );

  // On web, university portals block being embedded in an iframe, so open externally.
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        {Header}
        {SecureNote}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md }}>
          <Ionicons name="open-outline" size={40} color={colors.primary} />
          <Text center muted>
            {t('webview.openInBrowser')}
          </Text>
          <Button title={t(conf.titleKey)} icon="open-outline" fullWidth={false} onPress={() => Linking.openURL(conf.url)} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {Header}
      {SecureNote}
      <View style={{ flex: 1 }}>
        {error ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md }}>
            <Ionicons name="cloud-offline-outline" size={40} color={colors.textMuted} />
            <Text muted center>
              {t('webview.loadError')}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button title={t('common.retry')} icon="reload" variant="outline" fullWidth={false} onPress={reload} />
              <Button title={t('webview.openInBrowser')} icon="open-outline" fullWidth={false} onPress={() => Linking.openURL(conf.url)} />
            </View>
          </View>
        ) : (
          <WebView
            ref={webRef}
            source={{ uri: conf.url }}
            onLoadProgress={({ nativeEvent }) => {
              if (nativeEvent.progress > 0.66) setLoading(false);
            }}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
            onHttpError={() => setLoading(false)}
            startInLoadingState={false}
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            domStorageEnabled
            javaScriptEnabled
            originWhitelist={['*']}
          />
        )}
        {loading && !error ? (
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
