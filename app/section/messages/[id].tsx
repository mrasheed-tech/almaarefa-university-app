import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { useAuth } from '@/lib/auth';
import { getConversations, sendMessage, subscribeMessages } from '@/data';
import { fmtTime } from '@/lib/datetime';
import { colors, radius, spacing, typography } from '@/theme';
import type { ChatMessage } from '@/data/types';

export default function Thread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang, pick, isRTL } = useLang();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const convo = getConversations().find((c) => c.id === id);
  const [messages, setMessages] = useState<ChatMessage[]>(convo?.messages ?? []);
  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!user || !id) return;
    return subscribeMessages(id, user.id, (incoming) => setMessages((m) => [...m, incoming]));
  }, [user, id]);

  const send = async () => {
    const value = text.trim();
    if (!value || !user || !id) return;
    setText('');
    setMessages((m) => [...m, { id: Math.random().toString(36).slice(2), mine: true, text: value, at: new Date().toISOString() }]);
    await sendMessage(user.id, id, value);
  };

  if (!convo) {
    return (
      <View style={{ flex: 1 }}>
        <Header back title={t('sections.messages.title')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header back title={pick(convo.withEn, convo.withAr)} subtitle={t(`roles.${convo.roleLabel}`)} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={{
                maxWidth: '82%',
                alignSelf: m.mine ? 'flex-end' : 'flex-start',
                backgroundColor: m.mine ? colors.primary : colors.surface,
                borderColor: colors.border,
                borderWidth: m.mine ? 0 : 1,
                borderRadius: radius.lg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              }}
            >
              <Text color={m.mine ? '#fff' : colors.text}>{m.text}</Text>
              <Text
                variant="caption"
                color={m.mine ? 'rgba(255,255,255,0.8)' : colors.textMuted}
                style={{ marginTop: 2, textAlign: isRTL ? 'left' : 'right' }}
              >
                {fmtTime(m.at, lang)}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: spacing.sm,
            padding: spacing.sm,
            paddingBottom: insets.bottom + spacing.sm,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t('messages.typeMessage')}
            placeholderTextColor={colors.textMuted}
            style={{
              flex: 1,
              backgroundColor: colors.surfaceAlt,
              borderRadius: radius.pill,
              paddingHorizontal: spacing.md,
              paddingVertical: 10,
              fontSize: typography.size.md,
              color: colors.text,
              textAlign: isRTL ? 'right' : 'left',
            }}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Pressable
            onPress={send}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
