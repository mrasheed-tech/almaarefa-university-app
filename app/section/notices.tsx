import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Badge, Button, Card, Chip, Header, Screen, SectionHeader, Text, TextField } from '@/components';
import { useLang } from '@/hooks/useLang';
import { useAuth } from '@/lib/auth';
import { getAdvisees, sendNotice } from '@/data';
import { fmtTime } from '@/lib/datetime';
import { colors, spacing } from '@/theme';
import type { BadgeTone } from '@/components';
import type { Advisee } from '@/data/types';

const STATUS: Record<Advisee['status'], { tone: BadgeTone; en: string; ar: string }> = {
  good: { tone: 'success', en: 'Good standing', ar: 'بحالة جيدة' },
  warning: { tone: 'warning', en: 'At risk', ar: 'في خطر' },
  probation: { tone: 'danger', en: 'Probation', ar: 'إنذار أكاديمي' },
};

interface Sent {
  id: string;
  toName: string;
  text: string;
  at: string;
}

export default function Notices() {
  const { t, lang, pick, isRTL } = useLang();
  const { user } = useAuth();
  const advisees = getAdvisees();
  const [selected, setSelected] = useState(advisees[0]?.id ?? '');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState<Sent[]>([]);

  const send = () => {
    const value = message.trim();
    const advisee = advisees.find((a) => a.id === selected);
    if (!value || !advisee || !user) return;
    setSent((s) => [
      { id: Math.random().toString(36).slice(2), toName: pick(advisee.nameEn, advisee.nameAr), text: value, at: new Date().toISOString() },
      ...s,
    ]);
    setMessage('');
    sendNotice(user.id, advisee.id, value);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.notices.title')} subtitle={t('sections.notices.subtitle')} />
      <Screen scroll>
        {/* Composer */}
        <Card>
          <Text variant="subtitle" weight="bold" style={{ marginBottom: spacing.sm }}>
            {t('notices.sendNotice')}
          </Text>
          <Text variant="label" weight="medium" color={colors.textSecondary} style={{ marginBottom: 6 }}>
            {t('notices.to')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm }}>
              {advisees.map((a) => (
                <Chip key={a.id} label={pick(a.nameEn, a.nameAr)} active={selected === a.id} onPress={() => setSelected(a.id)} />
              ))}
            </View>
          </ScrollView>
          <TextField label={t('notices.message')} placeholder={t('notices.messagePlaceholder')} multiline value={message} onChangeText={setMessage} />
          <View style={{ marginTop: spacing.md }}>
            <Button title={t('notices.sendNotice')} icon="send" onPress={send} />
          </View>
        </Card>

        {/* Sent history */}
        {sent.length > 0 ? (
          <>
            <SectionHeader title={t('notices.history')} />
            <View style={{ gap: spacing.sm }}>
              {sent.map((s) => (
                <Card key={s.id}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                    <Text weight="semibold">{s.toName}</Text>
                    <Text variant="caption" muted>
                      {fmtTime(s.at, lang)}
                    </Text>
                  </View>
                  <Text variant="label" muted style={{ marginTop: 2 }}>
                    {s.text}
                  </Text>
                </Card>
              ))}
            </View>
          </>
        ) : null}

        {/* Advisees */}
        <SectionHeader title={t('notices.advisees')} />
        <View style={{ gap: spacing.sm }}>
          {advisees.map((a) => (
            <Card key={a.id} onPress={() => setSelected(a.id)}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.md, alignItems: 'center' }}>
                <Avatar name={pick(a.nameEn, a.nameAr)} size={44} />
                <View style={{ flex: 1 }}>
                  <Text weight="semibold">{pick(a.nameEn, a.nameAr)}</Text>
                  <Text variant="label" muted>
                    {a.universityId} · {pick(a.programEn, a.programAr)} · GPA {a.gpa.toFixed(2)}
                  </Text>
                </View>
                <Badge label={pick(STATUS[a.status].en, STATUS[a.status].ar)} tone={STATUS[a.status].tone} />
              </View>
            </Card>
          ))}
        </View>
      </Screen>
    </View>
  );
}
