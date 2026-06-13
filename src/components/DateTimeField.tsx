import { createElement, useState } from 'react';
import { Platform, Pressable, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from './Text';
import { colors, radius, spacing, typography } from '@/theme';
import { useLang } from '@/hooks/useLang';
import { fmtDateTime } from '@/lib/datetime';

interface Props {
  label?: string;
  value: Date | null;
  onChange: (d: Date) => void;
  placeholder?: string;
}

const two = (n: number) => String(n).padStart(2, '0');
/** Date → "YYYY-MM-DDTHH:mm" in local time (the format <input type=datetime-local> wants). */
const toLocalInput = (d: Date) => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}T${two(d.getHours())}:${two(d.getMinutes())}`;
const fromFuture = () => new Date(Date.now() + 60 * 60 * 1000);

/**
 * Exact date + time picker that works on every platform:
 * - iOS: inline spinner (datetime)
 * - Android: native date dialog then time dialog
 * - Web: the browser's native <input type="datetime-local">
 */
export function DateTimeField({ label, value, onChange, placeholder }: Props) {
  const { t, lang, isRTL } = useLang();
  const [mode, setMode] = useState<'date' | 'time' | 'datetime' | null>(null);

  const field: ViewStyle = {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  };

  const Label = label ? (
    <Text variant="label" weight="medium" color={colors.textSecondary} style={{ marginBottom: 6 }}>
      {label}
    </Text>
  ) : null;

  if (Platform.OS === 'web') {
    // A real datetime-local input — gives the browser's native date+time UI.
    const input = createElement('input' as never, {
      type: 'datetime-local',
      value: value ? toLocalInput(value) : '',
      onChange: (e: { target: { value: string } }) => {
        const v = e?.target?.value;
        if (v) onChange(new Date(v));
      },
      style: {
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: typography.size.md,
        color: colors.text,
        fontFamily: 'inherit',
        paddingTop: 14,
        paddingBottom: 14,
        textAlign: isRTL ? 'right' : 'left',
      },
    });
    return (
      <View>
        {Label}
        <View style={field}>
          <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
          {input}
        </View>
      </View>
    );
  }

  const open = () => setMode(Platform.OS === 'android' ? 'date' : 'datetime');

  // Android shows date then time as two sequential dialogs.
  const onAndroidChange = (event: { type?: string }, selected?: Date) => {
    if (event?.type === 'dismissed') {
      setMode(null);
      return;
    }
    const val = selected ?? value ?? fromFuture();
    if (mode === 'date') {
      const base = value ?? fromFuture();
      const merged = new Date(val);
      merged.setHours(base.getHours(), base.getMinutes(), 0, 0);
      onChange(merged);
      setMode('time');
    } else {
      const base = value ?? val;
      const merged = new Date(base);
      merged.setHours(val.getHours(), val.getMinutes(), 0, 0);
      onChange(merged);
      setMode(null);
    }
  };

  return (
    <View>
      {Label}
      <Pressable onPress={open} style={field}>
        <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
        <Text style={{ flex: 1 }} color={value ? colors.text : colors.textMuted}>
          {value ? fmtDateTime(value.toISOString(), lang) : placeholder ?? ''}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </Pressable>

      {Platform.OS === 'android' && (mode === 'date' || mode === 'time') ? (
        <DateTimePicker value={value ?? fromFuture()} mode={mode} onChange={onAndroidChange} />
      ) : null}

      {Platform.OS === 'ios' && mode === 'datetime' ? (
        <View style={{ alignItems: 'center', marginTop: spacing.sm }}>
          <DateTimePicker value={value ?? fromFuture()} mode="datetime" display="spinner" onChange={(_e, d) => d && onChange(d)} />
          <Pressable onPress={() => setMode(null)} hitSlop={8} style={{ paddingVertical: spacing.sm, paddingHorizontal: spacing.lg }}>
            <Text color={colors.primary} weight="semibold">
              {t('common.done')}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
