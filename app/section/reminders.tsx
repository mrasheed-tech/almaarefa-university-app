import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, DateTimeField, EmptyState, Header, Screen, SegmentedControl, Text, TextField } from '@/components';
import { useLang } from '@/hooks/useLang';
import { useAuth } from '@/lib/auth';
import { addReminder, deleteReminder, getReminders, setReminderDone, updateReminder } from '@/data';
import { cancelReminderNotification, scheduleReminderNotification } from '@/lib/notifications';
import { fmtDateTime } from '@/lib/datetime';
import { colors, radius, spacing } from '@/theme';
import type { Reminder } from '@/data/types';

const KIND_ICON: Record<Reminder['kind'], keyof typeof Ionicons.glyphMap> = {
  assignment: 'document-text',
  exam: 'school',
  personal: 'bookmark',
  fee: 'card',
};

const defaultFuture = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d;
};

export default function Reminders() {
  const { t, lang, isRTL } = useLang();
  const { user } = useAuth();
  const [items, setItems] = useState<Reminder[]>(() => getReminders().map((r) => ({ ...r })));
  const [filter, setFilter] = useState<'active' | 'completed'>('active');

  const [draft, setDraft] = useState('');
  const [due, setDue] = useState<Date | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDue, setEditDue] = useState<Date | null>(null);

  const add = async () => {
    const title = draft.trim();
    if (!title || !user) return;
    const dueIso = (due ?? defaultFuture()).toISOString();
    setDraft('');
    setDue(null);
    const created = await addReminder(user.id, title, dueIso);
    if (created) {
      setItems((arr) => [created, ...arr]);
      scheduleReminderNotification(created.id, created.title, created.dueAt);
    }
  };

  const toggle = (id: string) => {
    const current = items.find((x) => x.id === id);
    if (!current) return;
    const next = !current.done;
    setItems((arr) => arr.map((r) => (r.id === id ? { ...r, done: next } : r)));
    setReminderDone(id, next);
    if (next) cancelReminderNotification(id);
    else scheduleReminderNotification(id, current.title, current.dueAt);
  };

  const remove = (id: string) => {
    setItems((arr) => arr.filter((r) => r.id !== id));
    deleteReminder(id);
    cancelReminderNotification(id);
    if (editingId === id) setEditingId(null);
  };

  const startEdit = (r: Reminder) => {
    setEditingId(r.id);
    setEditTitle(r.title);
    setEditDue(new Date(r.dueAt));
  };

  const saveEdit = async () => {
    const title = editTitle.trim();
    if (!editingId || !title) return;
    const current = items.find((x) => x.id === editingId);
    const dueIso = (editDue ?? (current ? new Date(current.dueAt) : defaultFuture())).toISOString();
    setItems((arr) => arr.map((r) => (r.id === editingId ? { ...r, title, dueAt: dueIso } : r)));
    await updateReminder(editingId, title, dueIso);
    cancelReminderNotification(editingId);
    if (current && !current.done) scheduleReminderNotification(editingId, title, dueIso);
    setEditingId(null);
  };

  const visible = items
    .filter((r) => (filter === 'active' ? !r.done : r.done))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.reminders.title')} subtitle={t('sections.reminders.subtitle')} />
      <Screen scroll>
        {/* Add */}
        <Card>
          <View style={{ gap: spacing.md }}>
            <TextField icon="add-circle-outline" placeholder={t('reminders.add')} value={draft} onChangeText={setDraft} />
            <DateTimeField label={t('reminders.when')} value={due} onChange={setDue} placeholder={t('reminders.pickDateTime')} />
            <Button title={t('reminders.add')} icon="add" onPress={add} disabled={!draft.trim()} />
          </View>
        </Card>

        <View style={{ marginVertical: spacing.md }}>
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
            {visible.map((r) =>
              editingId === r.id ? (
                /* ---- inline edit ---- */
                <Card key={r.id}>
                  <View style={{ gap: spacing.md }}>
                    <TextField label={t('reminders.titleLabel')} value={editTitle} onChangeText={setEditTitle} />
                    <DateTimeField label={t('reminders.when')} value={editDue} onChange={setEditDue} placeholder={t('reminders.pickDateTime')} />
                    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                      <View style={{ flex: 1 }}>
                        <Button title={t('reminders.save')} icon="checkmark" onPress={saveEdit} disabled={!editTitle.trim()} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button title={t('common.cancel')} variant="outline" onPress={() => setEditingId(null)} />
                      </View>
                    </View>
                  </View>
                </Card>
              ) : (
                /* ---- row ---- */
                <View
                  key={r.id}
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
                  <Pressable onPress={() => toggle(r.id)} hitSlop={6}>
                    <Ionicons name={r.done ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={r.done ? colors.success : colors.primary} />
                  </Pressable>
                  <Pressable style={{ flex: 1 }} onPress={() => startEdit(r)}>
                    <Text weight="semibold" style={{ textDecorationLine: r.done ? 'line-through' : 'none' }} color={r.done ? colors.textMuted : colors.text}>
                      {r.title}
                    </Text>
                    <Text variant="caption" muted>
                      {fmtDateTime(r.dueAt, lang)}
                    </Text>
                  </Pressable>
                  <View style={{ width: 30, height: 30, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={KIND_ICON[r.kind]} size={15} color={colors.textSecondary} />
                  </View>
                  <Pressable onPress={() => startEdit(r)} hitSlop={6}>
                    <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
                  </Pressable>
                  <Pressable onPress={() => remove(r.id)} hitSlop={6}>
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </Pressable>
                </View>
              ),
            )}
          </View>
        )}
      </Screen>
    </View>
  );
}
