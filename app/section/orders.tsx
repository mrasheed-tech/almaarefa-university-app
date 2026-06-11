import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Badge, Card, EmptyState, Header, Screen, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { deliveryLabel, fetchMyOrders } from '@/data';
import { fmtDateTime } from '@/lib/datetime';
import { colors, spacing } from '@/theme';
import type { BadgeTone } from '@/components';
import type { FoodOrder, OrderStatus } from '@/data/types';

const STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  placed: 'primary',
  preparing: 'warning',
  ready: 'success',
  delivered: 'neutral',
  cancelled: 'danger',
};
const STATUS_KEY: Record<OrderStatus, string> = {
  placed: 'food.statusPlaced',
  preparing: 'food.statusPreparing',
  ready: 'food.statusReady',
  delivered: 'food.statusDelivered',
  cancelled: 'common.cancel',
};

export default function MyOrders() {
  const { user } = useAuth();
  const { t, lang, pick, isRTL } = useLang();
  const [orders, setOrders] = useState<FoodOrder[] | null>(null);

  useEffect(() => {
    if (user) fetchMyOrders(user.id).then(setOrders);
  }, [user]);

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('food.myOrders')} subtitle={t('sections.food.title')} />
      <Screen scroll>
        {orders === null ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : orders.length === 0 ? (
          <EmptyState icon="receipt-outline" title={t('food.noOrders')} />
        ) : (
          <View style={{ gap: spacing.md }}>
            {orders.map((o) => (
              <Card key={o.id}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text weight="semibold">{pick(o.vendorNameEn, o.vendorNameAr)}</Text>
                  <Badge label={t(STATUS_KEY[o.status])} tone={STATUS_TONE[o.status]} />
                </View>
                <Text variant="label" muted style={{ marginTop: 2 }}>
                  {o.items.map((i) => `${i.qty}× ${pick(i.nameEn, i.nameAr)}`).join('، ')}
                </Text>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm }}>
                  <Text variant="caption" muted>
                    {t('food.deliverTo')} {deliveryLabel(o.deliverTo, lang)}
                  </Text>
                  <Text variant="label" weight="semibold" color={colors.primary}>
                    {t('food.price', { price: o.total })}
                  </Text>
                </View>
                <Text variant="caption" muted style={{ marginTop: 2 }}>
                  {fmtDateTime(o.createdAt, lang)}
                </Text>
              </Card>
            ))}
          </View>
        )}
      </Screen>
    </View>
  );
}
