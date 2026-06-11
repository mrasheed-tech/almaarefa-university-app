import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, EmptyState, Header, Screen, SegmentedControl, Text, TextField } from '@/components';
import { useLang } from '@/hooks/useLang';
import { useAuth } from '@/lib/auth';
import { addReminder, getReminders, setReminderDone } from '@/data';
import { relativeDay } from '@/lib/datetime';
import { colors, radius, spacing } from '@/theme';
import type { Reminder } from '@/data/types';

const KIND_ICON: Record<Reminder['kind'], keyof typeof Ionicons.glyphMap> = {
  assignment: 'document-text',
  exam: 'school',
  personal: 'bookmark',
  fee: 'card',
};

export default function Reminders() {
  const { t, lang, isRTL } = useLang();
  const { user } = useAuth();
  const [items, setItems] = useState<Reminder[]>(() => getReminders().map((r) => ({ ...r })));
  const [filter, setFilter] = useState<'active' | 'completed'>('active');
  const [draft, setDraft] = useState('');

  const toggle = (id: string) => {
    const current = items.find((x) => x.id === id);
    setItems((arr) => arr.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
    if (current) setReminderDone(id, !current.done);
  };
  const add = async () => {
    const title = draft.trim();
    if (!title || !user) return;
    setDraft('');
    const created = await addReminder(user.id, title);
    if (created) setItems((arr) => [created, ...arr]);
  };

  const visible = items
    .filter((r) => (filter === 'active' ? !r.done : r.done))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.reminders.title')} subtitle={t('sections.reminders.subtitle')} />
      <Screen scroll>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          <View style={{ flex: 1 }}>
            <TextField icon="add-circle-outline" placeholder={t('reminders.add')} value={draft} onChangeText={setDraft} onSubmitEditing={add} />
          </View>
          <Button title={t('common.new')} onPress={add} fullWidth={false} size="md" style={{ alignSelf: 'flex-end', height: 50 }} />
        </View>

        <View style={{ marginBottom: spacing.md }}>
          <SegmentedControl
            value={filter}
            onChange={setFilter}
            options={[
              { label: t('reminders.active'), value: 'active' },
              { label: t('reminders.completed'), value: 'completed' },
            ]}
          />
        </View>

        {visible.length === 0 ? (
          <EmptyState icon="checkmark-done-outline" title={t('reminders.empty')} />
        ) : (
          <View style={{ gap: spacing.sm }}>
            {visible.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => toggle(r.id)}
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radius.md,
                  padding: spacing.md,
                }}
              >
                <Ionicons
                  name={r.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={r.done ? colors.success : colors.primary}
                />
                <View style={{ flex: 1 }}>
                  <Text weight="semibold" style={{ textDecorationLine: r.done ? 'line-through' : 'none' }} color={r.done ? colors.textMuted : colors.text}>
                    {r.title}
                  </Text>
                  <Text variant="caption" muted>
                    {t('reminders.due', { when: relativeDay(r.dueAt, lang, t) })}
                  </Text>
                </View>
                <View style={{ width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={KIND_ICON[r.kind]} size={16} color={colors.textSecondary} />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </Screen>
    </View>
  );
}
