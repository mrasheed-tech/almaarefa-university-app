import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, EmptyState, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { getGrammarTopic, type GrammarQuestion } from '@/data/grammar';
import { colors, palette, radius, spacing } from '@/theme';

export default function GrammarTopicScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const { t, pick, isRTL } = useLang();
  const data = useMemo(() => getGrammarTopic(String(topic)), [topic]);
  /** questionIndex -> chosen option index */
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (!data) {
    return (
      <View style={{ flex: 1 }}>
        <Header back title={t('sections.selfStudy.title')} />
        <Screen>
          <EmptyState icon="help-circle-outline" title={t('grammar.notFound')} />
        </Screen>
      </View>
    );
  }

  const total = data.questions.length;
  const correct = data.questions.reduce((n, q, i) => (answers[i] === q.answer ? n + 1 : n), 0);
  const answered = Object.keys(answers).length;
  const allDone = answered === total;

  const select = (qi: number, oi: number) => {
    if (answers[qi] != null) return; // lock once answered
    setAnswers((prev) => ({ ...prev, [qi]: oi }));
  };

  return (
    <View style={{ flex: 1 }}>
      <Header back title={pick(data.title.en, data.title.ar)} subtitle={pick(data.summary.en, data.summary.ar)} />
      <Screen scroll>
        {/* Rule */}
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
          <Text variant="subtitle" weight="bold">
            {t('grammar.rule')}
          </Text>
          <Badge label={data.level} tone="info" />
        </View>
        <Card>
          <View style={{ gap: spacing.sm }}>
            {data.rules.map((r, i) => (
              <View key={i} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 8 }} />
                <Text style={{ flex: 1 }}>{pick(r.en, r.ar)}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Examples */}
        <Text variant="subtitle" weight="bold" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
          {t('grammar.examples')}
        </Text>
        <Card>
          <View style={{ gap: spacing.sm }}>
            {data.examples.map((ex, i) => (
              <View key={i} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm, alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                {/* Examples stay in English (left-to-right) — the learning model. */}
                <Text style={{ flex: 1, writingDirection: 'ltr', textAlign: isRTL ? 'right' : 'left' }}>{ex}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Practice */}
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: spacing.lg,
            marginBottom: spacing.sm,
          }}
        >
          <Text variant="subtitle" weight="bold">
            {t('grammar.practice')}
          </Text>
          {answered > 0 ? (
            <Badge label={t('grammar.scoreLine', { correct, total })} tone={allDone && correct === total ? 'success' : 'neutral'} />
          ) : null}
        </View>

        <View style={{ gap: spacing.md }}>
          {data.questions.map((q, qi) => (
            <QuestionCard key={qi} q={q} index={qi} selected={answers[qi]} onSelect={select} />
          ))}
        </View>

        {allDone ? (
          <Card style={{ marginTop: spacing.md, alignItems: 'center' }}>
            <Ionicons
              name={correct === total ? 'trophy' : 'sparkles'}
              size={28}
              color={correct === total ? palette.goldDark : colors.primary}
            />
            <Text variant="subtitle" weight="bold" center style={{ marginTop: spacing.sm }}>
              {t('grammar.resultTitle', { correct, total })}
            </Text>
            <View style={{ marginTop: spacing.md, alignSelf: 'stretch' }}>
              <Button title={t('grammar.tryAgain')} icon="refresh" variant="outline" onPress={() => setAnswers({})} />
            </View>
          </Card>
        ) : null}
      </Screen>
    </View>
  );
}

function QuestionCard({
  q,
  index,
  selected,
  onSelect,
}: {
  q: GrammarQuestion;
  index: number;
  selected: number | undefined;
  onSelect: (qi: number, oi: number) => void;
}) {
  const { t, isRTL } = useLang();
  const answered = selected != null;
  const wasCorrect = selected === q.answer;

  return (
    <Card>
      <Text weight="semibold" style={{ writingDirection: 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
        {index + 1}. {q.prompt}
      </Text>

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        {q.options.map((opt, oi) => {
          const isAnswer = oi === q.answer;
          const isChosen = oi === selected;
          let bg: string = colors.surface;
          let border: string = colors.border;
          let icon: keyof typeof Ionicons.glyphMap | null = null;
          let iconColor: string = colors.textMuted;
          if (answered && isAnswer) {
            bg = colors.successTint;
            border = colors.success;
            icon = 'checkmark-circle';
            iconColor = colors.success;
          } else if (answered && isChosen) {
            bg = colors.dangerTint;
            border = colors.danger;
            icon = 'close-circle';
            iconColor = colors.danger;
          }
          return (
            <Pressable
              key={oi}
              disabled={answered}
              onPress={() => onSelect(index, oi)}
              style={({ pressed }) => [
                {
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderWidth: 1.5,
                  borderColor: border,
                  borderRadius: radius.md,
                  backgroundColor: bg,
                },
                pressed && !answered && { opacity: 0.7 },
              ]}
            >
              <Text style={{ flex: 1, writingDirection: 'ltr', textAlign: isRTL ? 'right' : 'left' }}>{opt}</Text>
              {icon ? <Ionicons name={icon} size={18} color={iconColor} /> : null}
            </Pressable>
          );
        })}
      </View>

      {answered ? (
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: spacing.sm,
            alignItems: 'flex-start',
            marginTop: spacing.md,
          }}
        >
          <Ionicons
            name={wasCorrect ? 'thumbs-up' : 'information-circle'}
            size={16}
            color={wasCorrect ? colors.success : colors.info}
            style={{ marginTop: 2 }}
          />
          <View style={{ flex: 1 }}>
            <Text variant="label" weight="semibold" color={wasCorrect ? colors.success : colors.info}>
              {wasCorrect ? t('grammar.correct') : t('grammar.incorrect')}
            </Text>
            <Text variant="label" muted style={{ marginTop: 1 }}>
              {q.explain}
            </Text>
          </View>
        </View>
      ) : null}
    </Card>
  );
}
