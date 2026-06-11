import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Card, Chip, EmptyState, Header, Screen, SegmentedControl, Text, TextField } from '@/components';
import { useLang } from '@/hooks/useLang';
import { useAuth } from '@/lib/auth';
import { addReminder, deleteReminder, getReminders, setReminderDone } from '@/data';
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

type PickerMode = 'date' | 'time' | 'datetime' | null;
const defaultFuture = () => new Date(Date.now() + 60 * 60 * 1000);

export default function Reminders() {
  const { t, lang, pick, isRTL } = useLang();
  const { user } = useAuth();
  const [items, setItems] = useState<Reminder[]>(() => getReminders().map((r) => ({ ...r })));
  const [filter, setFilter] = useState<'active' | 'completed'>('active');
  const [draft, setDraft] = useState('');
  const [due, setDue] = useState<Date | null>(null);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);

  const openPicker = () => setPickerMode(Platform.OS === 'android' ? 'date' : 'datetime');

  const onAndroidChange = (event: { type?: string }, selected?: Date) => {
    if (event?.type === 'dismissed') {
      setPickerMode(null);
      return;
    }
    const value = selected ?? due ?? defaultFuture();
    if (pickerMode === 'date') {
      const base = due ?? defaultFuture();
      const merged = new Date(value);
      merged.setHours(base.getHours(), base.getMinutes(), 0, 0);
      setDue(merged);
      setPickerMode('time');
    } else {
      const base = due ?? value;
      const merged = new Date(base);
      merged.setHours(value.getHours(), value.getMinutes(), 0, 0);
      setDue(merged);
      setPickerMode(null);
    }
  };

  const add = async () => {
    const title = draft.trim();
    if (!title || !user) return;
    const dueIso = (due ?? (() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); return d; })()).toISOString();
    setDraft('');
    setDue(null);
    setPickerMode(null);
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
  };

  const visible = items
    .filter((r) => (filter === 'active' ? !r.done : r.done))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.reminders.title')} subtitle={t('sections.reminders.subtitle')} />
      <Screen scroll>
        <Card>
          <TextField icon="add-circle-outline" placeholder={t('reminders.add')} value={draft} onChangeText={setDraft} />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' }}>
            {Platform.OS === 'web' ? (
              <>
                <Chip label={pick('In 1 hour', 'خلال ساعة')} onPress={() => setDue(defaultFuture())} />
                <Chip label={pick('This evening', 'هذا المساء')} onPress={() => { const d = new Date(); d.setHours(20, 0, 0, 0); setDue(d); }} />
                <Chip label={pick('Tomorrow 9 AM', 'غدًا ٩ ص')} onPress={() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); setDue(d); }} />
              </>
            ) : (
              <Button
                title={due ? fmtDateTime(due.toISOString(), lang) : t('reminders.setTime')}
                icon="calendar-outline"
                variant="outline"
                size="sm"
                fullWidth={false}
                onPress={openPicker}
              />
            )}
          </View>

          {due ? (
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm }}>
              <Ionicons name="notifications-outline" size={14} color={colors.primary} />
              <Text variant="caption" color={colors.primary}>
                {pick("We'll remind you ", 'سنذكّرك ')}
                {fmtDateTime(due.toISOString(), lang)}
              </Text>
            </View>
          ) : null}

          <View style={{ marginTop: spacing.md }}>
            <Button title={t('reminders.add')} icon="add" onPress={add} />
          </View>

          {/* Android: sequential date then time dialogs */}
          {Platform.OS === 'android' && (pickerMode === 'date' || pickerMode === 'time') ? (
            <DateTimePicker value={due ?? defaultFuture()} mode={pickerMode} onChange={onAndroidChange} />
          ) : null}

          {/* iOS: inline datetime picker + Done */}
          {Platform.OS === 'ios' && pickerMode === 'datetime' ? (
            <View style={{ alignItems: 'center', marginTop: spacing.sm }}>
              <DateTimePicker
                value={due ?? defaultFuture()}
                mode="datetime"
                display="spinner"
                onChange={(_e, d) => d && setDue(d)}
              />
              <Button title={t('common.done')} size="sm" fullWidth={false} onPress={() => setPickerMode(null)} />
            </View>
          ) : null}
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
            {visible.map((r) => (
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
                <View style={{ flex: 1 }}>
                  <Text weight="semibold" style={{ textDecorationLine: r.done ? 'line-through' : 'none' }} color={r.done ? colors.textMuted : colors.text}>
                    {r.title}
                  </Text>
                  <Text variant="caption" muted>
                    {fmtDateTime(r.dueAt, lang)}
                  </Text>
                </View>
                <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={KIND_ICON[r.kind]} size={15} color={colors.textSecondary} />
                </View>
                <Pressable onPress={() => remove(r.id)} hitSlop={6}>
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </Screen>
    </View>
  );
}
