import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, TextField } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { colors, gradients, radius, spacing } from '@/theme';
import { demoUsers } from '@/data/mock';
import type { Role } from '@/data/types';

const DEMO_ROLES: Role[] = ['student', 'teacher', 'advisor', 'student_affairs', 'vendor'];

function roleIcon(role: Role): keyof typeof Ionicons.glyphMap {
  switch (role) {
    case 'student':
      return 'school';
    case 'teacher':
      return 'easel';
    case 'advisor':
      return 'compass';
    case 'student_affairs':
      return 'briefcase';
    case 'vendor':
      return 'storefront';
    default:
      return 'person';
  }
}

export default function Login() {
  const insets = useSafeAreaInsets();
  const { t, lang, setLang, isRTL } = useLang();
  const { signInWithId, signInAs } = useAuth();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignIn = async () => {
    setLoading(true);
    await signInWithId(id || demoUsers.student.universityId, password);
    setLoading(false);
  };

  return (
    <LinearGradient colors={gradients.brand} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.xl,
            paddingHorizontal: spacing.lg,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Pressable
              onPress={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: 'rgba(255,255,255,0.18)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: radius.pill,
              }}
            >
              <Ionicons name="language" size={16} color="#fff" />
              <Text color="#fff" weight="semibold" variant="label">
                {lang === 'ar' ? 'English' : 'العربية'}
              </Text>
            </Pressable>
          </View>

          <View style={{ alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl }}>
            <Image
              source={require('../../assets/logo-white.png')}
              resizeMode="contain"
              style={{ width: 240, height: 58 }}
            />
            <Text color="#fff" variant="title" weight="bold" center style={{ marginTop: spacing.xl }}>
              {t('auth.welcome')}
            </Text>
            <Text color="rgba(255,255,255,0.9)" center style={{ marginTop: 4 }}>
              {t('auth.subtitle')}
            </Text>
          </View>

          <View style={{ backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md }}>
            <TextField
              label={t('auth.universityId')}
              icon="person-outline"
              placeholder={t('auth.idPlaceholder')}
              autoCapitalize="none"
              autoCorrect={false}
              value={id}
              onChangeText={setId}
            />
            <TextField
              label={t('auth.password')}
              icon="lock-closed-outline"
              placeholder={t('auth.passwordPlaceholder')}
              secure
              value={password}
              onChangeText={setPassword}
            />
            <Pressable hitSlop={6} style={{ alignSelf: isRTL ? 'flex-start' : 'flex-end' }}>
              <Text variant="label" color={colors.primary} weight="semibold">
                {t('auth.forgotPassword')}
              </Text>
            </Pressable>
            <Button title={t('auth.signIn')} icon="log-in-outline" loading={loading} onPress={onSignIn} />
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: spacing.sm,
                backgroundColor: colors.primaryTint,
                padding: spacing.md,
                borderRadius: radius.md,
              }}
            >
              <Ionicons name="shield-checkmark" size={18} color={colors.primaryDark} />
              <Text variant="caption" color={colors.primaryDark} style={{ flex: 1 }}>
                {t('auth.ssoNote')}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: spacing.xl }}>
            <Text color="#fff" weight="semibold" center>
              {t('auth.demoTitle')}
            </Text>
            <Text color="rgba(255,255,255,0.85)" variant="caption" center style={{ marginTop: 2, marginBottom: spacing.md }}>
              {t('auth.demoNote')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm }}>
              {DEMO_ROLES.map((role) => (
                <Pressable
                  key={role}
                  onPress={() => {
                    setLoading(true);
                    signInAs(role);
                  }}
                  style={{
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: 'rgba(255,255,255,0.16)',
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: radius.md,
                  }}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: demoUsers[role].avatarColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={roleIcon(role)} size={15} color="#fff" />
                  </View>
                  <Text color="#fff" weight="medium" variant="label">
                    {t(`roles.${role}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
