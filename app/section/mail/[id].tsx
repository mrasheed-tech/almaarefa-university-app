import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Avatar, EmptyState, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { getMail } from '@/data';
import { fmtDate, fmtTime } from '@/lib/datetime';
import { colors, spacing } from '@/theme';

export default function MailMessageDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang, pick, isRTL } = useLang();
  const message = getMail().find((m) => m.id === id);

  if (!message) {
    return (
      <View style={{ flex: 1 }}>
        <Header back title={t('tabs.mail')} />
        <EmptyState icon="mail-outline" title={t('mail.empty')} />
      </View>
    );
  }

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
      </Screen>
    </View>
  );
}
