import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar, EmptyState, Header, Screen, Text, TextField } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { listContactsFor, refreshConversations, startConversation, type Contact } from '@/data';
import { colors, spacing } from '@/theme';

export default function NewMessage() {
  const { user } = useAuth();
  const { t, pick, isRTL } = useLang();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) listContactsFor(user.role).then(setContacts);
  }, [user]);

  const open = async (c: Contact) => {
    if (!user || busy) return;
    setBusy(true);
    const id = await startConversation(c.id);
    if (id) {
      await refreshConversations(user.id);
      router.replace(`/section/messages/${id}` as never);
    } else {
      setBusy(false);
    }
  };

  const query = q.trim().toLowerCase();
  const visible = (contacts ?? []).filter(
    (c) => !query || c.nameEn.toLowerCase().includes(query) || c.nameAr.includes(q) || c.universityId.includes(q),
  );

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('messages.newMessage')} />
      <Screen scroll>
        <View style={{ marginBottom: spacing.md }}>
          <TextField icon="search" placeholder={t('directory.searchPeople')} value={q} onChangeText={setQ} autoCapitalize="none" />
        </View>

        {contacts === null ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : visible.length === 0 ? (
          <EmptyState icon="people-outline" title={t('common.empty')} />
        ) : (
          visible.map((c, i) => (
            <Pressable
              key={c.id}
              onPress={() => open(c)}
              disabled={busy}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: spacing.md,
                paddingVertical: spacing.md,
                borderTopWidth: i === 0 ? 0 : 1,
                borderTopColor: colors.divider,
                opacity: busy ? 0.5 : 1,
              }}
            >
              <Avatar name={pick(c.nameEn, c.nameAr)} size={44} />
              <View style={{ flex: 1 }}>
                <Text weight="semibold">{pick(c.nameEn, c.nameAr)}</Text>
                <Text variant="label" muted>
                  {t(`roles.${c.role}`)} · {c.universityId}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </Screen>
    </View>
  );
}
