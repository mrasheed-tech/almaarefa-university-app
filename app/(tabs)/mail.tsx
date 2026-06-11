import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, EmptyState, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { getMail, markMailRead } from '@/data';
import { fmtDate } from '@/lib/datetime';
import { colors, spacing } from '@/theme';
import type { MailMessage } from '@/data/types';

export default function Mail() {
  const { t, lang, pick, isRTL } = useLang();
  const router = useRouter();
  const all = getMail();
  const [readIds, setReadIds] = useState<string[]>([]);
  const isUnread = (m: MailMessage) => m.unread && !readIds.includes(m.id);
  const unreadCount = all.filter(isUnread).length;

  return (
    <View style={{ flex: 1 }}>
      <Header
        back
        onBack={() => (router.canGoBack() ? router.back() : router.navigate('/(tabs)'))}
        title={t('tabs.mail')}
        subtitle={unreadCount > 0 ? t('mail.unread', { count: unreadCount }) : t('mail.inbox')}
        right={
          <Pressable onPress={() => router.push('/webview/webmail')} hitSlop={10}>
            <Ionicons name="open-outline" size={22} color="#fff" />
          </Pressable>
        }
      />
      <Screen scroll>
        {all.length === 0 ? (
          <EmptyState icon="mail-outline" title={t('mail.empty')} />
        ) : (
          all.map((m, i) => (
            <Pressable
              key={m.id}
              onPress={() => {
                setReadIds((ids) => (ids.includes(m.id) ? ids : [...ids, m.id]));
                if (m.unread) markMailRead(m.id);
              }}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: spacing.md,
                paddingVertical: spacing.md,
                borderTopWidth: i === 0 ? 0 : 1,
                borderTopColor: colors.divider,
              }}
            >
              <Avatar name={pick(m.fromEn, m.fromAr)} size={42} color={isUnread(m) ? colors.primary : colors.textMuted} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}>
                  <Text weight={isUnread(m) ? 'bold' : 'semibold'} numberOfLines={1} style={{ flex: 1 }}>
                    {pick(m.fromEn, m.fromAr)}
                  </Text>
                  <Text variant="caption" muted>
                    {fmtDate(m.date, lang)}
                  </Text>
                </View>
                <Text weight={isUnread(m) ? 'semibold' : 'regular'} numberOfLines={1}>
                  {pick(m.subjectEn, m.subjectAr)}
                </Text>
                <Text variant="label" muted numberOfLines={1}>
                  {pick(m.previewEn, m.previewAr)}
                </Text>
              </View>
              {isUnread(m) ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 }} /> : null}
            </Pressable>
          ))
        )}
      </Screen>
    </View>
  );
}
