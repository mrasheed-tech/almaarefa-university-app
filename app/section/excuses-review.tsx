import { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Badge, Button, Card, Header, Screen, SegmentedControl, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { useAuth } from '@/lib/auth';
import { getExcusesQueue, reviewExcuse } from '@/data';
import { fmtDate } from '@/lib/datetime';
import { colors, spacing } from '@/theme';
import type { BadgeTone } from '@/components';
import type { Excuse } from '@/data/types';

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

export default function ExcusesReview() {
  const { t, lang, pick, isRTL } = useLang();
  const { user } = useAuth();
  const [list, setList] = useState<Excuse[]>(() => getExcusesQueue().map((e) => ({ ...e })));
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  const setStatus = (id: string, status: 'approved' | 'rejected') => {
    setList((arr) => arr.map((e) => (e.id === id ? { ...e, status } : e)));
    if (user) reviewExcuse(id, status, user.id);
  };

  const visible = list
    .filter((e) => filter === 'all' || e.status === 'pending')
    .sort((a, b) => (a.status === 'pending' ? 0 : 1) - (b.status === 'pending' ? 0 : 1));
  const pendingCount = list.filter((e) => e.status === 'pending').length;

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.excuseReview.title')} subtitle={`${pendingCount} · ${t('excuses.statusPending')}`} />
      <Screen scroll>
        <View style={{ marginBottom: spacing.md }}>
          <SegmentedControl
            value={filter}
            onChange={setFilter}
            options={[
              { label: t('excuses.statusPending'), value: 'pending' },
              { label: t('common.all'), value: 'all' },
            ]}
          />
        </View>

        <View style={{ gap: spacing.md }}>
          {visible.map((e) => (
            <Card key={e.id}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.md, alignItems: 'center' }}>
                <Avatar name={pick(e.studentNameEn, e.studentNameAr)} size={44} />
                <View style={{ flex: 1 }}>
                  <Text weight="semibold">{pick(e.studentNameEn, e.studentNameAr)}</Text>
                  <Text variant="label" muted>
                    {e.studentId} · {t(TYPE_KEY[e.type])}
                  </Text>
                </View>
                <Badge label={t(STATUS[e.status].key)} tone={STATUS[e.status].tone} />
              </View>

              <Text variant="label" style={{ marginTop: spacing.sm }}>
                {e.note}
              </Text>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md, marginTop: 6 }}>
                <Text variant="caption" muted>
                  {fmtDate(e.fromDate, lang)} – {fmtDate(e.toDate, lang)}
                </Text>
                {e.hasAttachment ? (
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 3 }}>
                    <Ionicons name="document-attach" size={14} color={colors.primary} />
                    <Text variant="caption" color={colors.primary}>
                      {pick('View document', 'عرض المستند')}
                    </Text>
                  </View>
                ) : null}
              </View>

              {e.status === 'pending' ? (
                <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Button title={t('excuses.approve')} icon="checkmark" size="sm" onPress={() => setStatus(e.id, 'approved')} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button title={t('excuses.reject')} icon="close" size="sm" variant="danger" onPress={() => setStatus(e.id, 'rejected')} />
                  </View>
                </View>
              ) : null}
            </Card>
          ))}
        </View>
      </Screen>
    </View>
  );
}
