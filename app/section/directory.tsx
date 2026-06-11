import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Card, EmptyState, Header, Screen, Text, TextField } from '@/components';
import { useLang } from '@/hooks/useLang';
import { getDirectory } from '@/data';
import { colors, radius, spacing } from '@/theme';

function Action({ icon, onPress }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name={icon} size={18} color={colors.primary} />
    </Pressable>
  );
}

export default function Directory() {
  const { t, pick, isRTL } = useLang();
  const [q, setQ] = useState('');
  const all = getDirectory();
  const query = q.trim().toLowerCase();
  const visible = all.filter(
    (d) =>
      !query ||
      d.nameEn.toLowerCase().includes(query) ||
      d.nameAr.includes(q) ||
      d.department.toLowerCase().includes(query),
  );

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.directory.title')} subtitle={t('sections.directory.subtitle')} />
      <Screen scroll>
        <View style={{ marginBottom: spacing.md }}>
          <TextField icon="search" placeholder={t('directory.searchPeople')} value={q} onChangeText={setQ} autoCapitalize="none" />
        </View>

        {visible.length === 0 ? (
          <EmptyState icon="people-outline" title={t('common.empty')} />
        ) : (
          <View style={{ gap: spacing.md }}>
            {visible.map((d) => (
              <Card key={d.id}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.md, alignItems: 'center' }}>
                  <Avatar name={pick(d.nameEn, d.nameAr)} size={46} />
                  <View style={{ flex: 1 }}>
                    <Text weight="semibold" numberOfLines={1}>
                      {pick(d.nameEn, d.nameAr)}
                    </Text>
                    <Text variant="label" muted numberOfLines={1}>
                      {pick(d.titleEn, d.titleAr)} · {t('directory.office')} {d.office}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm, marginTop: spacing.md }}>
                  <Action icon="call" onPress={() => Linking.openURL(`tel:${d.phone}`)} />
                  <Action icon="mail" onPress={() => Linking.openURL(`mailto:${d.email}`)} />
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text variant="caption" muted numberOfLines={1}>
                      {d.department}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </Screen>
    </View>
  );
}
