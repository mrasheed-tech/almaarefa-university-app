import { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, Chip, Header, Screen, SectionHeader, Text, TextField } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { getMyExcuses, submitExcuse } from '@/data';
import { fmtDate } from '@/lib/datetime';
import { colors, radius, spacing } from '@/theme';
import type { BadgeTone } from '@/components';
import type { Excuse } from '@/data/types';

const TYPES: Excuse['type'][] = ['sick', 'bereavement', 'official', 'other'];
const TYPE_KEY: Record<Excuse['type'], string> = {
  sick: 'excuses.typeSick',
  bereavement: 'excuses.typeBereavement',
  official: 'excuses.typeOfficial',
  other: 'excuses.typeOther',
};
const STATUS: Record<Excuse['status'], { tone: BadgeTone; key: string }> = {
  pending: { tone: 'warning', key: 'excuses.statusPending' },
  approved: { tone: 'success', key: 'excuses.statusApproved' },
  rejected: { tone: 'danger', key: 'excuses.statusRejected' },
};

export default function Excuses() {
  const { user } = useAuth();
  const { t, lang, isRTL } = useLang();
  const [list, setList] = useState<Excuse[]>(() => getMyExcuses().map((e) => ({ ...e })));
  const [type, setType] = useState<Excuse['type']>('sick');
  const [dates, setDates] = useState('');
  const [note, setNote] = useState('');
  const [attached, setAttached] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const submit = async () => {
    if ((!note.trim() && !dates.trim()) || !user) return;
    const nowIso = new Date().toISOString();
    const today = nowIso.slice(0, 10);
    const fullNote = dates ? `${dates} — ${note}` : note;
    const newExcuse: Excuse = {
      id: Math.random().toString(36).slice(2),
      studentId: user.universityId,
      studentNameEn: user.nameEn,
      studentNameAr: user.nameAr,
      type,
      note: fullNote,
      fromDate: nowIso,
      toDate: nowIso,
      status: 'pending',
      hasAttachment: attached,
      submittedAt: nowIso,
    };
    setList((arr) => [newExcuse, ...arr]);
    setNote('');
    setDates('');
    setAttached(false);
    setJustSubmitted(true);
    await submitExcuse(user.id, { type, note: fullNote, fromDate: today, toDate: today });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.excuses.title')} subtitle={t('sections.excuses.subtitle')} />
      <Screen scroll>
        {justSubmitted ? (
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: spacing.sm,
              backgroundColor: colors.successTint,
              padding: spacing.md,
              borderRadius: radius.md,
              marginBottom: spacing.md,
            }}
          >
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text variant="label" color={colors.success} style={{ flex: 1 }} weight="semibold">
              {t('excuses.submitted')}
            </Text>
          </View>
        ) : null}

        <Card>
          <Text variant="subtitle" weight="bold" style={{ marginBottom: spacing.sm }}>
            {t('excuses.new')}
          </Text>

          <Text variant="label" weight="medium" color={colors.textSecondary} style={{ marginBottom: 6 }}>
            {t('excuses.type')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md }}>
            {TYPES.map((ty) => (
              <Chip key={ty} label={t(TYPE_KEY[ty])} active={type === ty} onPress={() => setType(ty)} />
            ))}
          </View>

          <View style={{ gap: spacing.md }}>
            <TextField label={t('excuses.dateRange')} icon="calendar-outline" placeholder="2026-06-10 → 2026-06-12" value={dates} onChangeText={setDates} />
            <TextField label={t('excuses.note')} placeholder={t('excuses.notePlaceholder')} multiline value={note} onChangeText={setNote} />
            <Button
              title={attached ? t('excuses.attached') : t('excuses.attach')}
              icon={attached ? 'checkmark-circle' : 'attach'}
              variant={attached ? 'secondary' : 'outline'}
              onPress={() => setAttached((a) => !a)}
            />
            <Button title={t('common.submit')} icon="send" onPress={submit} />
          </View>
        </Card>

        <SectionHeader title={t('excuses.myRequests')} />
        <View style={{ gap: spacing.sm }}>
          {list.map((e) => (
            <Card key={e.id}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text weight="semibold">{t(TYPE_KEY[e.type])}</Text>
                <Badge label={t(STATUS[e.status].key)} tone={STATUS[e.status].tone} />
              </View>
              <Text variant="label" muted numberOfLines={2}>
                {e.note}
              </Text>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6 }}>
                {e.hasAttachment ? (
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 3 }}>
                    <Ionicons name="document-attach" size={14} color={colors.textMuted} />
                    <Text variant="caption" muted>
                      medical_note.pdf
                    </Text>
                  </View>
                ) : null}
                <Text variant="caption" muted>
                  {t('excuses.submittedOn', { date: fmtDate(e.submittedAt, lang) })}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </Screen>
    </View>
  );
}
