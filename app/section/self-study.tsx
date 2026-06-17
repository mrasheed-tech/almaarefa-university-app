import { Linking, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, Header, Screen, SectionHeader, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { GRAMMAR_TOPICS, type GrammarTopic } from '@/data/grammar';
import { colors, palette, radius, spacing } from '@/theme';

interface Tool {
  name: string;
  domain: string;
  url: string;
  route?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  descKey: string;
}

const TOOLS: Tool[] = [
  {
    name: 'CourseParse',
    domain: 'courseparse.com',
    url: 'https://www.courseparse.com',
    route: '/webview/courseparse',
    icon: 'document-text',
    color: palette.teal,
    bg: palette.tealTint,
    descKey: 'selfStudy.courseparseDesc',
  },
  {
    name: 'Cambridge One',
    domain: 'cambridgeone.org',
    url: 'https://www.cambridgeone.org',
    route: '/webview/cambridgeone',
    icon: 'school',
    color: palette.blue,
    bg: palette.blueTint,
    descKey: 'selfStudy.cambridgeDesc',
  },
];

const TINTS = [
  { color: palette.teal, bg: palette.tealTint },
  { color: palette.goldDark, bg: palette.goldTint },
  { color: palette.green, bg: palette.greenTint },
  { color: palette.blue, bg: palette.blueTint },
  { color: '#6020D2', bg: '#EEE7FB' },
];

const LEVELS: { level: GrammarTopic['level']; unlock: number; label: { en: string; ar: string } }[] = [
  { level: 'A1', unlock: 1, label: { en: 'Beginner', ar: 'مبتدئ' } },
  { level: 'A2', unlock: 2, label: { en: 'Elementary', ar: 'أساسي' } },
  { level: 'B1', unlock: 3, label: { en: 'Intermediate', ar: 'متوسط' } },
  { level: 'B2', unlock: 4, label: { en: 'Upper-intermediate', ar: 'فوق المتوسط' } },
];

export default function SelfStudy() {
  const { t, pick, isRTL } = useLang();
  const router = useRouter();
  const chevron = isRTL ? 'chevron-back' : 'chevron-forward';

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.selfStudy.title')} subtitle={t('sections.selfStudy.subtitle')} />
      <Screen scroll>
        <Card>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
            <Ionicons name="bulb" size={20} color={palette.goldDark} style={{ marginTop: 2 }} />
            <Text variant="label" muted style={{ flex: 1 }}>
              {t('selfStudy.intro')}
            </Text>
          </View>
        </Card>

        <SectionHeader title={t('selfStudy.toolsTitle')} />
        <View style={{ gap: spacing.md }}>
          {TOOLS.map((tool) => (
            <Card key={tool.name} onPress={() => (tool.route ? router.push(tool.route as never) : Linking.openURL(tool.url))}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: radius.md,
                    backgroundColor: tool.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={tool.icon} size={24} color={tool.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Text weight="bold">{tool.name}</Text>
                    <Ionicons name={tool.route ? chevron : 'open-outline'} size={14} color={colors.textMuted} />
                  </View>
                  <Text variant="label" muted style={{ marginTop: 2 }}>
                    {t(tool.descKey)}
                  </Text>
                  <Text variant="caption" color={tool.color} weight="semibold" style={{ marginTop: 4 }}>
                    {tool.domain}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
        <Text variant="caption" muted style={{ marginTop: spacing.sm }}>
          {t('selfStudy.opensExternally')}
        </Text>

        <SectionHeader title={t('selfStudy.grammarTitle')} />
        {LEVELS.map(({ level, unlock, label }) => {
          const items = GRAMMAR_TOPICS.filter((tp) => tp.level === level);
          if (items.length === 0) return null;
          return (
            <View key={level} style={{ marginBottom: spacing.md }}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                <Badge label={level} tone="info" />
                <Text variant="label" weight="semibold" muted>
                  {pick(label.en, label.ar)} · Unlock {unlock}
                </Text>
              </View>
              <Card padded={false}>
                {items.map((topic, i) => {
                  const tint = TINTS[GRAMMAR_TOPICS.indexOf(topic) % TINTS.length];
                  return (
                    <Pressable
                      key={topic.id}
                      onPress={() => router.push(`/section/grammar/${topic.id}` as never)}
                      style={({ pressed }) => [
                        {
                          flexDirection: isRTL ? 'row-reverse' : 'row',
                          alignItems: 'center',
                          gap: spacing.md,
                          padding: spacing.md,
                          borderTopWidth: i === 0 ? 0 : 1,
                          borderTopColor: colors.divider,
                        },
                        pressed && { opacity: 0.6 },
                      ]}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: radius.md,
                          backgroundColor: tint.bg,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons name={topic.icon as keyof typeof Ionicons.glyphMap} size={20} color={tint.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text weight="semibold" numberOfLines={1}>
                          {pick(topic.title.en, topic.title.ar)}
                        </Text>
                        <Text variant="label" muted numberOfLines={1} style={{ marginTop: 1 }}>
                          {pick(topic.summary.en, topic.summary.ar)}
                        </Text>
                      </View>
                      <Ionicons name={chevron} size={18} color={colors.textMuted} />
                    </Pressable>
                  );
                })}
              </Card>
            </View>
          );
        })}
      </Screen>
    </View>
  );
}
