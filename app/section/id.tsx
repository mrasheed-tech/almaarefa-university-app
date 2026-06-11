import { Image, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Badge, Header, Screen, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { colors, gradients, radius, shadows, spacing } from '@/theme';

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
  if (!user) return null;

  const qrValue = JSON.stringify({ id: user.universityId, name: user.nameEn, role: user.role });
  const programLine = user.role === 'student' ? pick(user.programEn ?? '', user.programAr ?? '') : user.department ?? '';

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
            <Image source={require('../../assets/logo-white.png')} resizeMode="contain" style={{ width: 150, height: 34 }} />
            <Text variant="caption" color="rgba(255,255,255,0.85)">
              {t('id.campus')}
            </Text>
          </View>

          <View style={{ marginTop: spacing.xl }}>
            <Badge label={t(`roles.${user.role}`)} tone="accent" />
            <Text variant="title" color="#fff" weight="bold" style={{ marginTop: spacing.sm }}>
              {pick(user.nameEn, user.nameAr)}
            </Text>
            {programLine ? (
              <Text color="rgba(255,255,255,0.9)" style={{ marginTop: 2 }}>
                {programLine}
              </Text>
            ) : null}
          </View>

          <View style={{ marginTop: spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: spacing.sm }}>
            <Row label={t('id.studentId')} value={user.universityId} isRTL={isRTL} />
            <Row label={t('id.validThru')} value="08 / 2028" isRTL={isRTL} />
          </View>
        </LinearGradient>

        <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
          <View style={{ backgroundColor: '#fff', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...(shadows.sm as object) }}>
            <QRCode value={qrValue} size={180} color={colors.text} backgroundColor="#FFFFFF" />
          </View>
          <Text variant="caption" muted center style={{ marginTop: spacing.md, maxWidth: 240 }}>
            {t('id.tapToZoom')}
          </Text>
        </View>
      </Screen>
    </View>
  );
}
