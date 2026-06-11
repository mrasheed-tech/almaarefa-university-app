import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, EmptyState, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { getInvigilations } from '@/data';
import { fmtDate } from '@/lib/datetime';
import { colors, radius, spacing } from '@/theme';

export default function Invigilation() {
  const { t, lang, pick, isRTL } = useLang();
  const duties = getInvigilations().slice().sort((a, b) => a.date.localeCompare(b.date));

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.invigilation.title')} subtitle={t('sections.invigilation.subtitle')} />
      <Screen scroll>
        {duties.length === 0 ? (
          <EmptyState icon="clipboard-outline" title={t('invigilation.empty')} />
        ) : (
          <View style={{ gap: spacing.sm }}>
            {duties.map((d) => (
              <Card key={d.id}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                  <View style={{ width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="clipboard" size={22} color={colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text weight="semibold">{pick(d.examEn, d.examAr)}</Text>
                    <Text variant="label" muted style={{ marginTop: 2 }}>
                      {fmtDate(d.date, lang)} · {d.start}–{d.end}
                    </Text>
                    <Text variant="label" muted>
                      {t('invigilation.room')} {d.room}
                    </Text>
                  </View>
                  <Badge
                    label={d.role === 'chief' ? t('invigilation.chief') : t('invigilation.assistant')}
                    tone={d.role === 'chief' ? 'primary' : 'neutral'}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}
      </Screen>
    </View>
  );
}
