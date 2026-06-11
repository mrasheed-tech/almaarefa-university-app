import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, Chip, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { getResearch } from '@/data';
import { fmtDate } from '@/lib/datetime';
import { colors, palette, radius, spacing } from '@/theme';
import type { ResearchItem } from '@/data/types';

const TYPE_META: Record<ResearchItem['type'], { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string; labelKey: string; tone: 'info' | 'success' | 'warning' }> = {
  publication: { icon: 'document-text', color: palette.blue, bg: palette.blueTint, labelKey: 'research.publications', tone: 'info' },
  opportunity: { icon: 'briefcase', color: palette.green, bg: palette.greenTint, labelKey: 'research.opportunities', tone: 'success' },
  grant: { icon: 'cash', color: palette.goldDark, bg: palette.goldTint, labelKey: 'research.grants', tone: 'warning' },
};

const FILTERS: Array<'all' | ResearchItem['type']> = ['all', 'publication', 'opportunity', 'grant'];

export default function Research() {
  const { t, lang, pick, isRTL } = useLang();
  const all = getResearch();
  const [filter, setFilter] = useState<'all' | ResearchItem['type']>('all');
  const visible = all.filter((r) => filter === 'all' || r.type === filter);

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.research.title')} subtitle={t('sections.research.subtitle')} />
      <Screen scroll>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm }}>
            {FILTERS.map((f) => (
              <Chip
                key={f}
                label={f === 'all' ? t('common.all') : t(TYPE_META[f].labelKey)}
                active={filter === f}
                onPress={() => setFilter(f)}
              />
            ))}
          </View>
        </ScrollView>

        <View style={{ gap: spacing.md }}>
          {visible.map((r) => {
            const meta = TYPE_META[r.type];
            return (
              <Card key={r.id}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.md }}>
                  <View style={{ width: 46, height: 46, borderRadius: radius.md, backgroundColor: meta.bg, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={meta.icon} size={22} color={meta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Badge label={t(meta.labelKey)} tone={meta.tone} style={{ marginBottom: 6 }} />
                    <Text weight="semibold">{pick(r.titleEn, r.titleAr)}</Text>
                    <Text variant="label" muted style={{ marginTop: 2 }}>
                      {pick(r.metaEn, r.metaAr)} · {fmtDate(r.date, lang)}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      </Screen>
    </View>
  );
}
