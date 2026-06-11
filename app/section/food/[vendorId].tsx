import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, Header, Screen, Text, TextField } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { addMenuItem, getFoodVendors, getMenuFor, setMenuAvailable, uploadMenuImage } from '@/data';
import { colors, radius, spacing } from '@/theme';
import type { MenuItem } from '@/data/types';

export default function VendorMenu() {
  const { vendorId } = useLocalSearchParams<{ vendorId: string }>();
  const { user } = useAuth();
  const { t, lang, pick, isRTL } = useLang();
  const vendor = getFoodVendors().find((v) => v.id === vendorId);
  const manage = user?.role === 'vendor' && vendorId === 'f1';

  const [items, setItems] = useState<MenuItem[]>(() => getMenuFor(vendorId ?? '').map((m) => ({ ...m })));
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  if (!vendor) {
    return (
      <View style={{ flex: 1 }}>
        <Header back title={t('sections.food.title')} />
      </View>
    );
  }

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
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (res.canceled || !res.assets?.[0]?.base64) return;
    setUploadingId(item.id);
    const url = await uploadMenuImage(item.id, res.assets[0].base64);
    setUploadingId(null);
    if (url) setItems((arr) => arr.map((m) => (m.id === item.id ? { ...m, imageUrl: url } : m)));
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

        {categories.map((catName) => (
          <View key={catName} style={{ marginTop: spacing.lg }}>
            <Text variant="subtitle" weight="bold" style={{ marginBottom: spacing.sm }}>
              {catName}
            </Text>
            <Card padded={false}>
              {items
                .filter((i) => i.category === catName)
                .map((m, idx) => (
                  <View
                    key={m.id}
                    style={{
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      gap: spacing.md,
                      padding: spacing.md,
                      borderTopWidth: idx === 0 ? 0 : 1,
                      borderTopColor: colors.divider,
                    }}
                  >
                    {manage ? (
                      <Pressable
                        onPress={() => pickAndUpload(m)}
                        style={{ width: 48, height: 48, borderRadius: radius.sm, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt }}
                      >
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
                    </View>
                    <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end', gap: 4 }}>
                      <Text weight="semibold" color={colors.primary}>
                        {t('food.price', { price: m.price })}
                      </Text>
                      {manage ? (
                        <Pressable onPress={() => toggle(m.id)}>
                          <Badge label={m.available ? t('food.available') : t('food.unavailable')} tone={m.available ? 'success' : 'danger'} />
                        </Pressable>
                      ) : !m.available ? (
                        <Badge label={t('food.unavailable')} tone="danger" />
                      ) : null}
                    </View>
                  </View>
                ))}
            </Card>
          </View>
        ))}
      </Screen>
    </View>
  );
}
