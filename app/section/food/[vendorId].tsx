import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, Chip, Header, Screen, Text, TextField } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import {
  addMenuItem,
  getFoodVendors,
  getMenuFor,
  setMenuAvailable,
  uploadMenuImage,
  placeOrder,
  fetchVendorOrders,
  updateOrderStatus,
  deliveryLabel,
  DELIVERY_LOCATIONS,
} from '@/data';
import { fmtDateTime } from '@/lib/datetime';
import { colors, radius, spacing } from '@/theme';
import type { BadgeTone } from '@/components';
import type { FoodOrder, MenuItem, OrderItem, OrderStatus } from '@/data/types';

const NEXT_STATUS: Partial<Record<OrderStatus, { next: OrderStatus; key: string }>> = {
  placed: { next: 'preparing', key: 'food.markPreparing' },
  preparing: { next: 'ready', key: 'food.markReady' },
  ready: { next: 'delivered', key: 'food.markDelivered' },
};
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

export default function VendorMenu() {
  const { vendorId } = useLocalSearchParams<{ vendorId: string }>();
  const { user } = useAuth();
  const { t, lang, pick, isRTL } = useLang();
  const insets = useSafeAreaInsets();
  const vendor = getFoodVendors().find((v) => v.id === vendorId);
  const manage = !!user && user.role === 'vendor' && vendor?.ownerId === user.id;

  const [items, setItems] = useState<MenuItem[]>(() => getMenuFor(vendorId ?? '').map((m) => ({ ...m })));
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [orders, setOrders] = useState<FoodOrder[] | null>(null);

  const [cart, setCart] = useState<Record<string, number>>({});
  const [checkingOut, setCheckingOut] = useState(false);
  const [deliverTo, setDeliverTo] = useState<string | null>(null);
  const [placedAt, setPlacedAt] = useState<string | null>(null);

  useEffect(() => {
    if (manage && vendorId) fetchVendorOrders(vendorId).then(setOrders);
  }, [manage, vendorId]);

  if (!vendor) {
    return (
      <View style={{ flex: 1 }}>
        <Header back title={t('sections.food.title')} />
      </View>
    );
  }

  // ---- vendor menu management ----
  const toggle = (id: string) => {
    const cur = items.find((m) => m.id === id);
    setItems((arr) => arr.map((m) => (m.id === id ? { ...m, available: !m.available } : m)));
    if (cur) setMenuAvailable(id, !cur.available);
  };
  const addItem = async () => {
    if (!name.trim() || !vendorId) return;
    const created = await addMenuItem(vendorId, name.trim(), Number(price) || 0);
    setName('');
    setPrice('');
    setAdding(false);
    if (created) setItems((arr) => [created, ...arr]);
  };
  const pickAndUpload = async (item: MenuItem) => {
    if (!vendorId) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5, base64: true });
    if (res.canceled || !res.assets?.[0]?.base64) return;
    setUploadingId(item.id);
    const url = await uploadMenuImage(item.id, res.assets[0].base64);
    setUploadingId(null);
    if (url) setItems((arr) => arr.map((m) => (m.id === item.id ? { ...m, imageUrl: url } : m)));
  };
  const advance = async (o: FoodOrder, next: OrderStatus) => {
    setOrders((arr) => arr?.map((x) => (x.id === o.id ? { ...x, status: next } : x)) ?? null);
    updateOrderStatus(o.id, next);
  };

  // ---- customer cart ----
  const inc = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const n = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  const cartItems: OrderItem[] = items
    .filter((m) => (cart[m.id] ?? 0) > 0)
    .map((m) => ({ menuItemId: m.id, nameEn: m.nameEn, nameAr: m.nameAr, price: m.price, qty: cart[m.id], emoji: m.emoji }));
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const submitOrder = async () => {
    if (!user || !vendorId || !deliverTo || cartItems.length === 0) return;
    const order = await placeOrder(user.id, vendorId, cartItems, deliverTo, cartTotal);
    if (order) {
      setCart({});
      setCheckingOut(false);
      setPlacedAt(deliverTo);
      setDeliverTo(null);
    }
  };

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <View style={{ flex: 1 }}>
      <Header back title={pick(vendor.nameEn, vendor.nameAr)} subtitle={pick(vendor.cuisineEn, vendor.cuisineAr)} />
      <Screen scroll>
        <Card>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
            <Text style={{ fontSize: 34 }}>{vendor.emoji}</Text>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                <Text variant="label" muted>
                  {pick(vendor.locationEn, vendor.locationAr)}
                </Text>
              </View>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                <Text variant="label" muted>
                  {vendor.hours}
                </Text>
              </View>
            </View>
            <Badge label={vendor.open ? t('food.openNow') : t('food.closed')} tone={vendor.open ? 'success' : 'neutral'} />
          </View>
        </Card>

        {placedAt ? (
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.successTint, padding: spacing.md, borderRadius: radius.md, marginTop: spacing.md }}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text variant="label" color={colors.success} weight="semibold" style={{ flex: 1 }}>
              {t('food.orderPlaced')} — {t('food.deliverTo')} {deliveryLabel(placedAt, lang)}
            </Text>
          </View>
        ) : null}

        {/* Vendor: incoming orders */}
        {manage ? (
          <View style={{ marginTop: spacing.lg }}>
            <Text variant="subtitle" weight="bold" style={{ marginBottom: spacing.sm }}>
              {t('food.incomingOrders')}
            </Text>
            {orders === null ? (
              <ActivityIndicator color={colors.primary} />
            ) : orders.length === 0 ? (
              <Text muted>{t('food.noOrders')}</Text>
            ) : (
              <View style={{ gap: spacing.sm }}>
                {orders.map((o) => (
                  <Card key={o.id}>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text weight="semibold">{pick(o.customerNameEn ?? '', o.customerNameAr ?? '') || '—'}</Text>
                      <Badge label={t(STATUS_KEY[o.status])} tone={STATUS_TONE[o.status]} />
                    </View>
                    <Text variant="label" muted style={{ marginTop: 2 }}>
                      {o.items.map((i) => `${i.qty}× ${pick(i.nameEn, i.nameAr)}`).join('، ')}
                    </Text>
                    <Text variant="caption" muted style={{ marginTop: 2 }}>
                      {t('food.deliverTo')} {deliveryLabel(o.deliverTo, lang)} · {t('food.price', { price: o.total })} · {fmtDateTime(o.createdAt, lang)}
                    </Text>
                    {NEXT_STATUS[o.status] ? (
                      <View style={{ marginTop: spacing.sm }}>
                        <Button size="sm" fullWidth={false} title={t(NEXT_STATUS[o.status]!.key)} onPress={() => advance(o, NEXT_STATUS[o.status]!.next)} />
                      </View>
                    ) : null}
                  </Card>
                ))}
              </View>
            )}
          </View>
        ) : null}

        {/* Vendor: add menu item */}
        {manage ? (
          <View style={{ marginTop: spacing.md }}>
            {adding ? (
              <Card>
                <View style={{ gap: spacing.sm }}>
                  <TextField label={t('food.addItem')} value={name} onChangeText={setName} />
                  <TextField label={pick('Price (SAR)', 'السعر (ريال)')} keyboardType="numeric" value={price} onChangeText={setPrice} />
                  <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <View style={{ flex: 1 }}>
                      <Button title={t('common.save')} onPress={addItem} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button title={t('common.cancel')} variant="outline" onPress={() => setAdding(false)} />
                    </View>
                  </View>
                </View>
              </Card>
            ) : (
              <Button title={t('food.addItem')} icon="add" variant="outline" onPress={() => setAdding(true)} />
            )}
          </View>
        ) : null}

        {/* Menu */}
        {categories.map((catName) => (
          <View key={catName} style={{ marginTop: spacing.lg }}>
            <Text variant="subtitle" weight="bold" style={{ marginBottom: spacing.sm }}>
              {catName}
            </Text>
            <Card padded={false}>
              {items
                .filter((i) => i.category === catName)
                .map((m, idx) => (
                  <View key={m.id} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderTopWidth: idx === 0 ? 0 : 1, borderTopColor: colors.divider }}>
                    {manage ? (
                      <Pressable onPress={() => pickAndUpload(m)} style={{ width: 48, height: 48, borderRadius: radius.sm, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt }}>
                        {uploadingId === m.id ? (
                          <ActivityIndicator color={colors.primary} />
                        ) : m.imageUrl ? (
                          <Image source={{ uri: m.imageUrl }} style={{ width: 48, height: 48 }} />
                        ) : (
                          <Text style={{ fontSize: 24 }}>{m.emoji}</Text>
                        )}
                        <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.primary, borderRadius: 8, padding: 2 }}>
                          <Ionicons name="camera" size={11} color="#fff" />
                        </View>
                      </Pressable>
                    ) : m.imageUrl ? (
                      <Image source={{ uri: m.imageUrl }} style={{ width: 44, height: 44, borderRadius: radius.sm }} />
                    ) : (
                      <Text style={{ fontSize: 24 }}>{m.emoji}</Text>
                    )}

                    <View style={{ flex: 1 }}>
                      <Text weight="semibold" color={m.available ? colors.text : colors.textMuted}>
                        {pick(m.nameEn, m.nameAr)}
                      </Text>
                      {pick(m.descEn, m.descAr) ? (
                        <Text variant="caption" muted numberOfLines={1}>
                          {pick(m.descEn, m.descAr)}
                        </Text>
                      ) : null}
                      <Text weight="semibold" color={colors.primary} style={{ marginTop: 2 }}>
                        {t('food.price', { price: m.price })}
                      </Text>
                    </View>

                    {manage ? (
                      <Pressable onPress={() => toggle(m.id)}>
                        <Badge label={m.available ? t('food.available') : t('food.unavailable')} tone={m.available ? 'success' : 'danger'} />
                      </Pressable>
                    ) : !m.available ? (
                      <Badge label={t('food.unavailable')} tone="danger" />
                    ) : (cart[m.id] ?? 0) > 0 ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <Pressable onPress={() => dec(m.id)} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="remove" size={18} color={colors.primary} />
                        </Pressable>
                        <Text weight="bold" style={{ minWidth: 16, textAlign: 'center' }}>
                          {cart[m.id]}
                        </Text>
                        <Pressable onPress={() => inc(m.id)} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="add" size={18} color="#fff" />
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable onPress={() => inc(m.id)} style={{ paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.primary }}>
                        <Text variant="label" weight="semibold" color={colors.primary}>
                          {t('food.order')}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                ))}
            </Card>
          </View>
        ))}
      </Screen>

      {/* Customer cart / checkout bar */}
      {!manage && cartCount > 0 ? (
        <View style={{ backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.md, paddingBottom: insets.bottom + spacing.md, gap: spacing.sm }}>
          {checkingOut ? (
            <>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="label" weight="semibold">
                  {t('food.deliverTo')}
                </Text>
                <Pressable onPress={() => setCheckingOut(false)} hitSlop={8}>
                  <Ionicons name="close" size={20} color={colors.textMuted} />
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm }}>
                  {DELIVERY_LOCATIONS.map((loc) => (
                    <Chip key={loc.id} label={pick(loc.en, loc.ar)} active={deliverTo === loc.id} onPress={() => setDeliverTo(loc.id)} />
                  ))}
                </View>
              </ScrollView>
              <Button title={`${t('food.placeOrder')} · ${t('food.price', { price: cartTotal })}`} icon="checkmark-circle" disabled={!deliverTo} onPress={submitOrder} />
            </>
          ) : (
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text weight="semibold">{t('food.items', { count: cartCount })}</Text>
                <Text variant="label" muted>
                  {t('food.price', { price: cartTotal })}
                </Text>
              </View>
              <Button title={t('food.checkout')} icon="cart" fullWidth={false} onPress={() => setCheckingOut(true)} />
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}
