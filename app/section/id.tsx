import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Header, Screen, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { uploadAvatar } from '@/data';
import { colors, gradients, radius, shadows, spacing } from '@/theme';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

function Row({ label, value, isRTL }: { label: string; value: string; isRTL: boolean }) {
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
      <Text variant="caption" color="rgba(255,255,255,0.75)">
        {label}
      </Text>
      <Text variant="label" color="#fff" weight="semibold">
        {value}
      </Text>
    </View>
  );
}

export default function DigitalId() {
  const { user } = useAuth();
  const { t, pick, isRTL } = useLang();
  const [photo, setPhoto] = useState<string | undefined>(user?.avatarUrl);
  const [uploading, setUploading] = useState(false);
  if (!user) return null;

  const qrValue = JSON.stringify({ id: user.universityId, name: user.nameEn, role: user.role });
  const programLine = user.role === 'student' ? pick(user.programEn ?? '', user.programAr ?? '') : user.department ?? '';

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.6,
      base64: true,
    });
    if (res.canceled || !res.assets?.[0]?.base64) return;
    setUploading(true);
    const url = await uploadAvatar(user.id, res.assets[0].base64);
    setUploading(false);
    if (url) setPhoto(url);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.id.title')} subtitle={t('sections.id.subtitle')} />
      <Screen scroll>
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: radius.xl, padding: spacing.lg, ...(shadows.md as object) }}
        >
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image source={require('../../assets/logo-white.png')} resizeMode="contain" style={{ width: 140, height: 32 }} />
            <Text variant="caption" color="rgba(255,255,255,0.85)">
              {t('id.campus')}
            </Text>
          </View>

          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.lg, marginTop: spacing.lg, alignItems: 'center' }}>
            <Pressable onPress={pickPhoto} disabled={uploading}>
              <View
                style={{
                  width: 92,
                  height: 116,
                  borderRadius: radius.md,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.6)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : photo ? (
                  <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <Text variant="display" color="#fff" weight="bold">
                    {initials(user.nameEn)}
                  </Text>
                )}
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: -8,
                  alignSelf: 'center',
                  backgroundColor: '#fff',
                  borderRadius: radius.pill,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 3,
                  ...(shadows.sm as object),
                }}
              >
                <Ionicons name="camera" size={11} color={colors.primary} />
                <Text variant="caption" weight="semibold" color={colors.primary}>
                  {photo ? t('studentCard.change') : t('studentCard.add')}
                </Text>
              </View>
            </Pressable>

            <View style={{ flex: 1 }}>
              <Badge label={t(`roles.${user.role}`)} tone="accent" />
              <Text variant="title" color="#fff" weight="bold" style={{ marginTop: spacing.sm }}>
                {pick(user.nameEn, user.nameAr)}
              </Text>
              {programLine ? (
                <Text color="rgba(255,255,255,0.9)" style={{ marginTop: 2 }} numberOfLines={2}>
                  {programLine}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={{ marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: spacing.sm }}>
            <Row label={t('id.studentId')} value={user.universityId} isRTL={isRTL} />
            <Row label={t('id.validThru')} value="08 / 2028" isRTL={isRTL} />
          </View>
        </LinearGradient>

        <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
          <View style={{ backgroundColor: '#fff', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...(shadows.sm as object) }}>
            <QRCode value={qrValue} size={160} color={colors.text} backgroundColor="#FFFFFF" />
          </View>
          <Text variant="caption" muted center style={{ marginTop: spacing.md, maxWidth: 260 }}>
            {t('id.tapToZoom')}
          </Text>
        </View>
      </Screen>
    </View>
  );
}
