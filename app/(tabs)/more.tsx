import { useState } from 'react';
import { Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Badge, Button, Card, Header, ListItem, Screen, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { config } from '@/lib/config';
import { colors, palette, spacing } from '@/theme';

function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.divider }} />;
}

export default function More() {
  const { user, signOut } = useAuth();
  const { t, lang, setLang, pick, isRTL } = useLang();
  const router = useRouter();
  const [notif, setNotif] = useState(true);
  if (!user) return null;

  return (
    <View style={{ flex: 1 }}>
      <Header title={t('tabs.more')} subtitle={t('sections.settings.subtitle')} />
      <Screen scroll>
        <Card>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
            <Avatar name={pick(user.nameEn, user.nameAr)} size={60} color={user.avatarColor} />
            <View style={{ flex: 1 }}>
              <Text variant="subtitle" weight="bold">
                {pick(user.nameEn, user.nameAr)}
              </Text>
              <Text variant="label" muted numberOfLines={1}>
                {user.universityId} · {user.email}
              </Text>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginTop: 6 }}>
                <Badge label={t(`roles.${user.role}`)} tone="primary" />
              </View>
            </View>
          </View>
          {user.department ? (
            <View style={{ marginTop: spacing.md, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="business-outline" size={15} color={colors.textMuted} />
              <Text variant="label" muted>
                {user.department}
              </Text>
            </View>
          ) : null}
        </Card>

        <Text variant="subtitle" weight="bold" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
          {t('sections.settings.title')}
        </Text>
        <Card>
          <ListItem
            icon="language"
            iconColor={colors.textSecondary}
            iconBg="#ECEFF3"
            title={t('settings.language')}
            value={lang === 'ar' ? 'العربية' : 'English'}
            chevron
            onPress={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          />
          <Divider />
          <ListItem
            icon="key"
            iconColor={colors.textSecondary}
            iconBg="#ECEFF3"
            title={t('settings.changePassword')}
            chevron
            onPress={() => router.push('/section/change-password')}
          />
          <Divider />
          <ListItem
            icon="notifications"
            iconColor={colors.textSecondary}
            iconBg="#ECEFF3"
            title={t('settings.notifications')}
            trailing={<Switch value={notif} onValueChange={setNotif} trackColor={{ true: colors.primary, false: palette.gray300 }} thumbColor="#fff" />}
          />
          <Divider />
          <ListItem icon="information-circle" iconColor={colors.textSecondary} iconBg="#ECEFF3" title={t('settings.about')} value={`v${config.appVersion}`} />
        </Card>

        <View style={{ marginTop: spacing.lg }}>
          <Button title={t('settings.logout')} icon="log-out-outline" variant="danger" onPress={signOut} />
        </View>

        <Text variant="caption" muted center style={{ marginTop: spacing.lg }}>
          {t('common.appName')} · v{config.appVersion}
        </Text>
      </Screen>
    </View>
  );
}
