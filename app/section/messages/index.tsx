import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Badge, EmptyState, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { getConversations } from '@/data';
import { fmtTime } from '@/lib/datetime';
import { colors, spacing } from '@/theme';

export default function MessagesList() {
  const { t, lang, pick, isRTL } = useLang();
  const router = useRouter();
  const convos = getConversations();

  return (
    <View style={{ flex: 1 }}>
      <Header
        back
        title={t('sections.messages.title')}
        subtitle={t('sections.messages.subtitle')}
        right={
          <Pressable onPress={() => router.push('/section/messages/new' as never)} hitSlop={10}>
            <Ionicons name="create-outline" size={24} color="#fff" />
          </Pressable>
        }
      />
      <Screen scroll>
        {convos.length === 0 ? (
          <EmptyState icon="chatbubbles-outline" title={t('messages.noConversations')} />
        ) : (
          convos.map((c, i) => (
            <Pressable
              key={c.id}
              onPress={() => router.push(`/section/messages/${c.id}` as never)}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: spacing.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
                borderTopWidth: i === 0 ? 0 : 1,
                borderTopColor: colors.divider,
              }}
            >
              <Avatar name={pick(c.withEn, c.withAr)} size={46} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', gap: spacing.sm }}>
                  <Text weight="semibold" numberOfLines={1} style={{ flex: 1 }}>
                    {pick(c.withEn, c.withAr)}
                  </Text>
                  <Text variant="caption" muted>
                    {fmtTime(c.lastAt, lang)}
                  </Text>
                </View>
                <Text variant="label" muted numberOfLines={1}>
                  {c.lastMessage}
                </Text>
              </View>
              {c.unread > 0 ? <Badge label={String(c.unread)} tone="primary" /> : null}
            </Pressable>
          ))
        )}
      </Screen>
    </View>
  );
}
