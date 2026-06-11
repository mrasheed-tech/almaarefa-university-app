import { View } from 'react-native';
import { Badge, Card, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { getNotices } from '@/data';
import { fmtDate } from '@/lib/datetime';
import { spacing } from '@/theme';
import type { BadgeTone } from '@/components';
import type { Notice } from '@/data/types';

const CAT: Record<Notice['category'], { tone: BadgeTone; en: string; ar: string }> = {
  academic: { tone: 'primary', en: 'Academic', ar: 'أكاديمي' },
  event: { tone: 'accent', en: 'Event', ar: 'فعالية' },
  urgent: { tone: 'danger', en: 'Urgent', ar: 'عاجل' },
  general: { tone: 'neutral', en: 'General', ar: 'عام' },
};

export default function News() {
  const { t, lang, pick, isRTL } = useLang();
  const notices = getNotices();

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.news.title')} subtitle={t('sections.news.subtitle')} />
      <Screen scroll>
        <View style={{ gap: spacing.md }}>
          {notices.map((n) => (
            <Card key={n.id}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <Badge label={pick(CAT[n.category].en, CAT[n.category].ar)} tone={CAT[n.category].tone} />
                <Text variant="caption" muted>
                  {fmtDate(n.date, lang)}
                </Text>
              </View>
              <Text weight="bold" style={{ marginBottom: 4 }}>
                {pick(n.titleEn, n.titleAr)}
              </Text>
              <Text variant="label" muted>
                {pick(n.bodyEn, n.bodyAr)}
              </Text>
            </Card>
          ))}
        </View>
      </Screen>
    </View>
  );
}
