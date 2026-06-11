import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, Header, Screen, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { getFoodVendors } from '@/data';
import { colors, palette, radius, spacing } from '@/theme';

export default function FoodList() {
  const { t, pick, isRTL } = useLang();
  const { user } = useAuth();
  const router = useRouter();
  const vendors = getFoodVendors();

  return (
    <View style={{ flex: 1 }}>
      <Header
        back
        title={t('sections.food.title')}
        subtitle={t('sections.food.subtitle')}
        right={
          <Pressable onPress={() => router.push('/section/orders')} hitSlop={10}>
            <Ionicons name="receipt-outline" size={22} color="#fff" />
          </Pressable>
        }
      />
      <Screen scroll>
        <View style={{ gap: spacing.md }}>
          {vendors.map((v) => {
            const owned = user?.role === 'vendor' && v.id === 'f1';
            return (
              <Card key={v.id} onPress={() => router.push(`/section/food/${v.id}` as never)}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.md, alignItems: 'center' }}>
                  <View style={{ width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 28 }}>{v.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.sm }}>
                      <Text weight="semibold" style={{ flex: 1 }} numberOfLines={1}>
                        {pick(v.nameEn, v.nameAr)}
                      </Text>
                      <Badge label={v.open ? t('food.openNow') : t('food.closed')} tone={v.open ? 'success' : 'neutral'} />
                    </View>
                    <Text variant="label" muted numberOfLines={1}>
                      {pick(v.cuisineEn, v.cuisineAr)} · {pick(v.locationEn, v.locationAr)}
                    </Text>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md, marginTop: 4 }}>
                      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 3 }}>
                        <Ionicons name="star" size={13} color={palette.gold} />
                        <Text variant="caption" muted>
                          {v.rating}
                        </Text>
                      </View>
                      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 3 }}>
                        <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                        <Text variant="caption" muted>
                          {v.hours}
                        </Text>
                      </View>
                      {owned ? <Badge label={t('food.manageMenu')} tone="accent" /> : null}
                    </View>
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
