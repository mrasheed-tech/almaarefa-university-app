import { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Header, Screen, Text, TextField } from '@/components';
import { useLang } from '@/hooks/useLang';
import { supabase } from '@/lib/supabase';
import { checkPwnedPassword } from '@/lib/pwned';
import { colors, spacing } from '@/theme';

const MIN_LENGTH = 8;

export default function ChangePassword() {
  const { t, isRTL } = useLang();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setError(null);
    setDone(false);
  };

  const submit = async () => {
    setError(null);
    if (pw.length < MIN_LENGTH) {
      setError(t('changePassword.tooShort', { count: MIN_LENGTH }));
      return;
    }
    if (pw !== confirm) {
      setError(t('changePassword.mismatch'));
      return;
    }

    setLoading(true);
    // Leaked-password check first (free HIBP equivalent of the Supabase Pro feature).
    const breaches = await checkPwnedPassword(pw);
    if (breaches > 0) {
      setLoading(false);
      setError(t('changePassword.leaked'));
      return;
    }

    const { error: upErr } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    setPw('');
    setConfirm('');
    setDone(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.changePassword.title')} subtitle={t('sections.changePassword.subtitle')} />
      <Screen scroll>
        <Card>
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              gap: spacing.sm,
              alignItems: 'flex-start',
              marginBottom: spacing.md,
            }}
          >
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} style={{ marginTop: 2 }} />
            <Text variant="caption" muted style={{ flex: 1 }}>
              {t('changePassword.intro')}
            </Text>
          </View>

          <View style={{ gap: spacing.md }}>
            <TextField
              label={t('changePassword.newPassword')}
              icon="lock-closed-outline"
              secure
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={t('changePassword.placeholder')}
              value={pw}
              onChangeText={onChange(setPw)}
            />
            <TextField
              label={t('changePassword.confirm')}
              icon="lock-closed-outline"
              secure
              autoCapitalize="none"
              autoCorrect={false}
              value={confirm}
              onChangeText={onChange(setConfirm)}
            />
          </View>

          {error ? (
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: 6,
                alignItems: 'flex-start',
                marginTop: spacing.md,
              }}
            >
              <Ionicons name="alert-circle" size={16} color={colors.danger} style={{ marginTop: 2 }} />
              <Text variant="caption" color={colors.danger} style={{ flex: 1 }}>
                {error}
              </Text>
            </View>
          ) : null}

          {done ? (
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: 6,
                alignItems: 'center',
                marginTop: spacing.md,
              }}
            >
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text variant="caption" color={colors.success} style={{ flex: 1 }}>
                {t('changePassword.success')}
              </Text>
            </View>
          ) : null}

          <View style={{ marginTop: spacing.lg }}>
            <Button
              title={t('changePassword.submit')}
              icon="checkmark"
              loading={loading}
              disabled={!pw || !confirm}
              onPress={submit}
            />
          </View>
        </Card>

        <Text variant="caption" muted center style={{ marginTop: spacing.lg }}>
          {t('changePassword.hibpNote')}
        </Text>
      </Screen>
    </View>
  );
}
