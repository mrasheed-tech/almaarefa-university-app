import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, Chip, EmptyState, Header, ListItem, Screen, Text, TextField } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import {
  addOfficeHour,
  bookAppointment,
  cancelAppointment,
  deleteOfficeHour,
  fetchBookedSlotTimes,
  fetchMyAppointments,
  listOfficeHourTeachers,
  listOfficeHours,
} from '@/data';
import type { Contact } from '@/data';
import type { Appointment, OfficeHour, Role, User } from '@/data/types';
import { fmtTime, relativeDay } from '@/lib/datetime';
import { colors, radius, spacing } from '@/theme';

const WEEKDAYS = [
  { en: 'Sunday', ar: 'الأحد', short: { en: 'Sun', ar: 'الأحد' } },
  { en: 'Monday', ar: 'الاثنين', short: { en: 'Mon', ar: 'الاثنين' } },
  { en: 'Tuesday', ar: 'الثلاثاء', short: { en: 'Tue', ar: 'الثلاثاء' } },
  { en: 'Wednesday', ar: 'الأربعاء', short: { en: 'Wed', ar: 'الأربعاء' } },
  { en: 'Thursday', ar: 'الخميس', short: { en: 'Thu', ar: 'الخميس' } },
  { en: 'Friday', ar: 'الجمعة', short: { en: 'Fri', ar: 'الجمعة' } },
  { en: 'Saturday', ar: 'السبت', short: { en: 'Sat', ar: 'السبت' } },
];
const FORM_DAYS = [0, 1, 2, 3, 4]; // Sun–Thu (KSA week)
const TIMES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const SLOT_OPTIONS = [15, 20, 30];

interface Slot {
  start: Date;
  end: Date;
  location?: string;
}

function generateSlots(hours: OfficeHour[], bookedMs: Set<number>, daysAhead = 14): Slot[] {
  const out: Slot[] = [];
  const now = new Date();
  for (let d = 0; d < daysAhead; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    const wd = day.getDay();
    for (const o of hours) {
      if (o.weekday !== wd) continue;
      const [sh, sm] = o.start.split(':').map(Number);
      const [eh, em] = o.end.split(':').map(Number);
      const winEnd = new Date(day);
      winEnd.setHours(eh, em, 0, 0);
      const cur = new Date(day);
      cur.setHours(sh, sm, 0, 0);
      while (cur.getTime() + o.slotMinutes * 60000 <= winEnd.getTime()) {
        const s = new Date(cur);
        const e = new Date(cur.getTime() + o.slotMinutes * 60000);
        if (s.getTime() > now.getTime() && !bookedMs.has(s.getTime())) out.push({ start: s, end: e, location: o.location });
        cur.setTime(e.getTime());
      }
    }
  }
  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export default function Appointments() {
  const { user } = useAuth();
  const { t } = useLang();
  if (!user) return null;
  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.appointments.title')} subtitle={t('sections.appointments.subtitle')} />
      {user.role === 'teacher' ? (
        <TeacherView user={user} />
      ) : user.role === 'student' ? (
        <StudentView user={user} />
      ) : (
        <Screen>
          <EmptyState icon="people-outline" title={t('appointments.studentsTeachersOnly')} />
        </Screen>
      )}
    </View>
  );
}

/* --------------------------------- Teacher --------------------------------- */
function TeacherView({ user }: { user: User }) {
  const { t, pick, lang, isRTL } = useLang();
  const [hours, setHours] = useState<OfficeHour[] | null>(null);
  const [bookings, setBookings] = useState<Appointment[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [weekday, setWeekday] = useState(0);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('11:00');
  const [slot, setSlot] = useState(20);
  const [location, setLocation] = useState('');

  useEffect(() => {
    listOfficeHours(user.id).then(setHours);
    fetchMyAppointments(user.id, 'teacher').then(setBookings);
  }, [user.id]);

  const save = async () => {
    if (start >= end) return;
    const created = await addOfficeHour(user.id, weekday, start, end, slot, location.trim());
    if (created) {
      setHours((arr) => [...(arr ?? []), created]);
      setAdding(false);
      setLocation('');
    }
  };
  const removeHour = (id: string) => {
    setHours((arr) => (arr ?? []).filter((h) => h.id !== id));
    deleteOfficeHour(id);
  };
  const cancel = (id: string) => {
    setBookings((arr) => (arr ?? []).filter((a) => a.id !== id));
    cancelAppointment(id);
  };

  return (
    <Screen scroll>
      <Text variant="subtitle" weight="bold" style={{ marginBottom: spacing.sm }}>
        {t('appointments.yourOfficeHours')}
      </Text>

      {hours === null ? (
        <ActivityIndicator color={colors.primary} />
      ) : hours.length === 0 && !adding ? (
        <Card>
          <Text muted>{t('appointments.noOfficeHours')}</Text>
        </Card>
      ) : (
        <Card padded={false}>
          {hours.map((h, i) => (
            <View
              key={h.id}
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.divider }}
            >
              <View style={{ flex: 1 }}>
                <Text weight="semibold">{pick(WEEKDAYS[h.weekday].en, WEEKDAYS[h.weekday].ar)}</Text>
                <Text variant="label" muted>
                  {h.start} – {h.end} · {t('appointments.slotMin', { min: h.slotMinutes })}
                  {h.location ? ` · ${h.location}` : ''}
                </Text>
              </View>
              <Pressable onPress={() => removeHour(h.id)} hitSlop={8}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </Pressable>
            </View>
          ))}
        </Card>
      )}

      {adding ? (
        <Card style={{ marginTop: spacing.md }}>
          <View style={{ gap: spacing.md }}>
            <Field label={t('appointments.weekday')}>
              <ChipRow>
                {FORM_DAYS.map((d) => (
                  <Chip key={d} label={pick(WEEKDAYS[d].short.en, WEEKDAYS[d].short.ar)} active={weekday === d} onPress={() => setWeekday(d)} />
                ))}
              </ChipRow>
            </Field>
            <Field label={t('appointments.start')}>
              <ChipRow>
                {TIMES.slice(0, -1).map((tm) => (
                  <Chip key={tm} label={tm} active={start === tm} onPress={() => setStart(tm)} />
                ))}
              </ChipRow>
            </Field>
            <Field label={t('appointments.end')}>
              <ChipRow>
                {TIMES.filter((tm) => tm > start).map((tm) => (
                  <Chip key={tm} label={tm} active={end === tm} onPress={() => setEnd(tm)} />
                ))}
              </ChipRow>
            </Field>
            <Field label={t('appointments.slotLength')}>
              <ChipRow>
                {SLOT_OPTIONS.map((m) => (
                  <Chip key={m} label={t('appointments.slotMin', { min: m })} active={slot === m} onPress={() => setSlot(m)} />
                ))}
              </ChipRow>
            </Field>
            <TextField label={t('appointments.location')} placeholder={t('appointments.locationPlaceholder')} icon="location-outline" value={location} onChangeText={setLocation} />
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <Button title={t('common.save')} icon="checkmark" onPress={save} />
              </View>
              <View style={{ flex: 1 }}>
                <Button title={t('common.cancel')} variant="outline" onPress={() => setAdding(false)} />
              </View>
            </View>
          </View>
        </Card>
      ) : (
        <View style={{ marginTop: spacing.md }}>
          <Button title={t('appointments.addWindow')} icon="add" variant="outline" onPress={() => setAdding(true)} />
        </View>
      )}

      <Text variant="subtitle" weight="bold" style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
        {t('appointments.upcoming')}
      </Text>
      {bookings === null ? (
        <ActivityIndicator color={colors.primary} />
      ) : bookings.length === 0 ? (
        <Card>
          <Text muted>{t('appointments.noBookings')}</Text>
        </Card>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {bookings.map((a) => (
            <Card key={a.id}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text weight="semibold">{pick(a.studentNameEn ?? '', a.studentNameAr ?? '') || '—'}</Text>
                  <Text variant="label" color={colors.primary} weight="semibold" style={{ marginTop: 2 }}>
                    {relativeDay(a.startsAt, lang, t)} · {fmtTime(a.startsAt, lang)}
                  </Text>
                  {a.reason ? (
                    <Text variant="label" muted style={{ marginTop: 2 }}>
                      {a.reason}
                    </Text>
                  ) : null}
                </View>
                <Pressable onPress={() => cancel(a.id)} hitSlop={6}>
                  <Badge label={t('appointments.cancel')} tone="danger" />
                </Pressable>
              </View>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}

/* --------------------------------- Student --------------------------------- */
function StudentView({ user }: { user: User }) {
  const { t, pick, lang, isRTL } = useLang();
  const [teachers, setTeachers] = useState<Contact[] | null>(null);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [booked, setBooked] = useState<Set<number>>(new Set());
  const [hours, setHours] = useState<OfficeHour[]>([]);
  const [picked, setPicked] = useState<Slot | null>(null);
  const [reason, setReason] = useState('');
  const [mine, setMine] = useState<Appointment[] | null>(null);

  useEffect(() => {
    listOfficeHourTeachers().then(setTeachers);
    fetchMyAppointments(user.id, 'student').then(setMine);
  }, [user.id]);

  const openTeacher = async (c: Contact) => {
    setSelected(c);
    setSlots(null);
    setPicked(null);
    const [oh, bookedTimes] = await Promise.all([listOfficeHours(c.id), fetchBookedSlotTimes(c.id)]);
    const set = new Set(bookedTimes);
    setHours(oh);
    setBooked(set);
    setSlots(generateSlots(oh, set));
  };

  const confirm = async () => {
    if (!selected || !picked) return;
    const appt = await bookAppointment(selected.id, user.id, picked.start.toISOString(), picked.end.toISOString(), reason.trim());
    if (appt) {
      const next = new Set(booked);
      next.add(picked.start.getTime());
      setBooked(next);
      setSlots(generateSlots(hours, next));
      setMine((arr) => [...(arr ?? []), { ...appt, teacherNameEn: selected.nameEn, teacherNameAr: selected.nameAr }].sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
      setPicked(null);
      setReason('');
    } else {
      // Slot likely just taken by someone else — refresh availability.
      const bookedTimes = await fetchBookedSlotTimes(selected.id);
      const set = new Set(bookedTimes);
      setBooked(set);
      setSlots(generateSlots(hours, set));
      setPicked(null);
    }
  };

  const cancel = (id: string) => {
    setMine((arr) => (arr ?? []).filter((a) => a.id !== id));
    cancelAppointment(id);
  };

  const groups = useMemo(() => {
    const gs: { key: string; label: string; slots: Slot[] }[] = [];
    for (const s of slots ?? []) {
      const key = s.start.toDateString();
      let g = gs.find((x) => x.key === key);
      if (!g) {
        g = { key, label: relativeDay(s.start.toISOString(), lang, t), slots: [] };
        gs.push(g);
      }
      g.slots.push(s);
    }
    return gs;
  }, [slots, lang, t]);

  return (
    <Screen scroll>
      {/* My upcoming appointments */}
      {mine && mine.length > 0 ? (
        <View style={{ marginBottom: spacing.lg }}>
          <Text variant="subtitle" weight="bold" style={{ marginBottom: spacing.sm }}>
            {t('appointments.myAppointments')}
          </Text>
          <View style={{ gap: spacing.sm }}>
            {mine.map((a) => (
              <Card key={a.id}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text weight="semibold">{pick(a.teacherNameEn ?? '', a.teacherNameAr ?? '') || '—'}</Text>
                    <Text variant="label" color={colors.primary} weight="semibold" style={{ marginTop: 2 }}>
                      {relativeDay(a.startsAt, lang, t)} · {fmtTime(a.startsAt, lang)}
                    </Text>
                  </View>
                  <Pressable onPress={() => cancel(a.id)} hitSlop={6}>
                    <Badge label={t('appointments.cancel')} tone="danger" />
                  </Pressable>
                </View>
              </Card>
            ))}
          </View>
        </View>
      ) : null}

      <Text variant="subtitle" weight="bold" style={{ marginBottom: spacing.sm }}>
        {selected ? t('appointments.availableWith', { name: pick(selected.nameEn, selected.nameAr) }) : t('appointments.pickTeacher')}
      </Text>

      {/* Teacher picker */}
      {!selected ? (
        teachers === null ? (
          <ActivityIndicator color={colors.primary} />
        ) : teachers.length === 0 ? (
          <EmptyState icon="people-outline" title={t('appointments.noTeachers')} />
        ) : (
          <Card padded={false}>
            {teachers.map((c, i) => (
              <ListItem
                key={c.id}
                icon="person"
                title={pick(c.nameEn, c.nameAr)}
                subtitle={c.universityId}
                chevron
                onPress={() => openTeacher(c)}
                style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.divider }}
              />
            ))}
          </Card>
        )
      ) : (
        <>
          <Pressable onPress={() => setSelected(null)} hitSlop={6} style={{ marginBottom: spacing.md }}>
            <Text variant="label" color={colors.primary} weight="semibold">
              {isRTL ? '→ ' : '← '}
              {t('appointments.changeTeacher')}
            </Text>
          </Pressable>

          {slots === null ? (
            <ActivityIndicator color={colors.primary} />
          ) : groups.length === 0 ? (
            <EmptyState icon="calendar-outline" title={t('appointments.noSlots')} />
          ) : (
            groups.map((g) => (
              <View key={g.key} style={{ marginBottom: spacing.md }}>
                <Text variant="label" weight="semibold" muted style={{ marginBottom: spacing.sm }}>
                  {g.label}
                </Text>
                <ChipRow>
                  {g.slots.map((s) => {
                    const active = picked?.start.getTime() === s.start.getTime();
                    return <Chip key={s.start.toISOString()} label={fmtTime(s.start.toISOString(), lang)} active={active} onPress={() => setPicked(active ? null : s)} />;
                  })}
                </ChipRow>
              </View>
            ))
          )}

          {/* Booking confirmation */}
          {picked ? (
            <Card style={{ marginTop: spacing.sm }}>
              <Text weight="semibold">
                {relativeDay(picked.start.toISOString(), lang, t)} · {fmtTime(picked.start.toISOString(), lang)} – {fmtTime(picked.end.toISOString(), lang)}
              </Text>
              {picked.location ? (
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                  <Text variant="label" muted>
                    {picked.location}
                  </Text>
                </View>
              ) : null}
              <View style={{ marginTop: spacing.md }}>
                <TextField label={t('appointments.reason')} placeholder={t('appointments.reasonPlaceholder')} value={reason} onChangeText={setReason} multiline />
              </View>
              <View style={{ marginTop: spacing.md }}>
                <Button title={t('appointments.confirmBook')} icon="checkmark-circle" onPress={confirm} />
              </View>
            </Card>
          ) : null}
        </>
      )}
    </Screen>
  );
}

/* --------------------------------- helpers --------------------------------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text variant="label" weight="medium" color={colors.textSecondary}>
        {label}
      </Text>
      {children}
    </View>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLang();
  return <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: spacing.sm }}>{children}</View>;
}
