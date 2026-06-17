import { Alert, Linking, Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, EmptyState, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { getMail } from '@/data';
import { fmtDate, fmtTime } from '@/lib/datetime';
import { colors, spacing } from '@/theme';

export default function MailMessageDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang, pick, isRTL } = useLang();
  const router = useRouter();
  const message = getMail().find((m) => m.id === id);

  if (!message) {
    return (
      <View style={{ flex: 1 }}>
        <Header back title={t('tabs.mail')} />
        <EmptyState icon="mail-outline" title={t('mail.empty')} />
      </View>
    );
  }

  const openWebmail = () => Linking.openURL('https://outlook.office.com/mail/');

  const handleReply = () => {
    Alert.alert(
      pick('Reply', 'رد'),
      pick(
        'Replies are sent from Outlook. Would you like to open Webmail?',
        'تُرسَل الردود عبر Outlook. هل تريد فتح البريد الإلكتروني؟'
      ),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: pick('Open Webmail', 'فتح البريد'), onPress: openWebmail },
      ],
    );
  };

  const handleForward = () => {
    Alert.alert(
      pick('Forward', 'إعادة إرسال'),
      pick(
        'Forwarding is done from Outlook. Would you like to open Webmail?',
        'تُرسَل الإحالة عبر Outlook. هل تريد فتح البريد الإلكتروني؟'
      ),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: pick('Open Webmail', 'فتح البريد'), onPress: openWebmail },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      pick('Delete message', 'حذف الرسالة'),
      pick('This will delete the message from the list.', 'سيتم حذف الرسالة من القائمة.'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: pick('Delete', 'حذف'),
          style: 'destructive',
          onPress: () => router.back(),
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('tabs.mail')} />
      <Screen scroll>
        <Text variant="title" weight="bold" style={{ textAlign: isRTL ? 'right' : 'left' }}>
          {pick(message.subjectEn, message.subjectAr)}
        </Text>

        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: spacing.md,
            marginTop: spacing.md,
            paddingBottom: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
          }}
        >
          <Avatar name={pick(message.fromEn, message.fromAr)} size={44} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text weight="semibold" numberOfLines={1}>
              {pick(message.fromEn, message.fromAr)}
            </Text>
            <Text variant="caption" muted>
              {fmtDate(message.date, lang)} · {fmtTime(message.date, lang)}
            </Text>
          </View>
        </View>

        <Text style={{ marginTop: spacing.lg, lineHeight: 24, textAlign: isRTL ? 'right' : 'left' }}>
          {pick(message.bodyEn, message.bodyAr)}
        </Text>

        {/* Action bar */}
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: spacing.sm,
            marginTop: spacing.xl,
            paddingTop: spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.divider,
          }}
        >
          {[
            { icon: 'arrow-undo-outline' as const, label: pick('Reply', 'رد'), onPress: handleReply },
            { icon: 'arrow-redo-outline' as const, label: pick('Forward', 'إحالة'), onPress: handleForward },
            { icon: 'trash-outline' as const, label: pick('Delete', 'حذف'), onPress: handleDelete, danger: true },
          ].map((action) => (
            <Pressable
              key={action.label}
              onPress={action.onPress}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                gap: 4,
                paddingVertical: spacing.sm,
                borderRadius: 8,
                backgroundColor: pressed ? colors.surfaceAlt : 'transparent',
              })}
            >
              <Ionicons
                name={action.icon}
                size={22}
                color={action.danger ? colors.danger : colors.primary}
              />
              <Text
                variant="caption"
                weight="semibold"
                color={action.danger ? colors.danger : colors.primary}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Screen>
    </View>
  );
}
