import { useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, Chip, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { useAuth } from '@/lib/auth';
import { getEvents, setRsvp } from '@/data';
import { fmtDate, fmtTime } from '@/lib/datetime';
import { colors, palette, radius, spacing } from '@/theme';
import type { CampusEvent } from '@/data/types';

const CAT_LABEL: Record<CampusEvent['category'], { en: string; ar: string }> = {
  academic: { en: 'Academic', ar: 'أكاديمي' },
  workshop: { en: 'Workshop', ar: 'ورشة' },
  social: { en: 'Social', ar: 'اجتماعي' },
  sports: { en: 'Sports', ar: 'رياضة' },
  health: { en: 'Health', ar: 'صحة' },
};

export default function Events() {
  const { t, lang, pick, isRTL } = useLang();
  const { user } = useAuth();
  const all = getEvents();
  const [cat, setCat] = useState<'all' | CampusEvent['category']>('all');
  const [going, setGoing] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(all.map((e) => [e.id, e.going])),
  );

  const cats = useMemo(() => Array.from(new Set(all.map((e) => e.category))), [all]);
  const visible = all.filter((e) => cat === 'all' || e.category === cat);

  const apply = (e: CampusEvent, next: boolean) => {
    setGoing((g) => ({ ...g, [e.id]: next }));
    if (user) setRsvp(user.id, e.id, next);
  };

  const confirmRsvp = (e: CampusEvent) => {
    const next = !going[e.id];
    const title = pick(e.titleEn, e.titleAr);
    Alert.alert(
      next ? t('events.confirmTitle') : t('events.cancelTitle'),
      (next ? t('events.confirmMsg', { title }) : t('events.cancelMsg', { title })) as string,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: next ? t('events.register') : t('events.cancelYes'),
          style: next ? 'default' : 'destructive',
          onPress: () => apply(e, next),
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.events.title')} subtitle={t('sections.events.subtitle')} />
      <Screen scroll>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm }}>
            <Chip label={t('events.categoryAll')} active={cat === 'all'} onPress={() => setCat('all')} />
            {cats.map((c) => (
              <Chip key={c} label={pick(CAT_LABEL[c].en, CAT_LABEL[c].ar)} active={cat === c} onPress={() => setCat(c)} />
            ))}
          </View>
        </ScrollView>

        <View style={{ gap: spacing.md }}>
          {visible.map((e) => (
            <Card key={e.id}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.md }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: radius.md,
                    backgroundColor: colors.accentTint,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text variant="caption" color={palette.goldDark} weight="semibold">
                    {fmtDate(e.start, lang).split(' ')[0]}
                  </Text>
                  <Text variant="subtitle" weight="bold" color={palette.goldDark}>
                    {new Date(e.start).getDate()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text weight="semibold">{pick(e.titleEn, e.titleAr)}</Text>
                  <Text variant="label" muted numberOfLines={2} style={{ marginTop: 2 }}>
                    {pick(e.descEn, e.descAr)}
                  </Text>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                    <Text variant="caption" muted>
                      {fmtTime(e.start, lang)} · {pick(e.locationEn, e.locationAr)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: spacing.md }}>
                <Button
                  title={going[e.id] ? t('events.going') : t('events.rsvp')}
                  icon={going[e.id] ? 'checkmark-circle' : 'add-circle-outline'}
                  variant={going[e.id] ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => confirmRsvp(e)}
                />
              </View>
            </Card>
          ))}
        </View>
      </Screen>
    </View>
  );
}
