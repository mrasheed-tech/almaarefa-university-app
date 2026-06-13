import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, EmptyState, Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import {
  getAssignments,
  getGradeItems,
  loadConnection,
  type MoodleAssignment,
  type MoodleGradeItem,
} from '@/lib/moodle';
import { fmtDate } from '@/lib/datetime';
import { colors, radius, spacing } from '@/theme';

export default function CourseDetail() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const { t, lang, isRTL } = useLang();
  const courseId = Number(id);

  const [state, setState] = useState<'loading' | 'ready' | 'disconnected' | 'error'>('loading');
  const [assignments, setAssignments] = useState<MoodleAssignment[]>([]);
  const [grades, setGrades] = useState<MoodleGradeItem[]>([]);

  useEffect(() => {
    (async () => {
      const conn = await loadConnection();
      if (!conn) {
        setState('disconnected');
        return;
      }
      try {
        const [a, g] = await Promise.all([
          getAssignments(conn.url, conn.token, [courseId]),
          getGradeItems(conn.url, conn.token, courseId, conn.userId),
        ]);
        setAssignments(a.courses?.[0]?.assignments ?? []);
        setGrades(g.usergrades?.[0]?.gradeitems ?? []);
        setState('ready');
      } catch {
        setState('error');
      }
    })();
  }, [courseId]);

  const title = name ? decodeURIComponent(String(name)) : t('sections.courses.title');

  return (
    <View style={{ flex: 1 }}>
      <Header back title={title} subtitle={t('sections.courses.subtitle')} />
      <Screen scroll>
        {state === 'loading' ? (
          <ActivityIndicator color={colors.primary} />
        ) : state === 'disconnected' ? (
          <EmptyState icon="link-outline" title={t('courses.notConnected')} />
        ) : state === 'error' ? (
          <EmptyState icon="cloud-offline-outline" title={t('courses.loadError')} />
        ) : (
          <>
            {/* Assignments */}
            <Text variant="subtitle" weight="bold" style={{ marginBottom: spacing.sm }}>
              {t('courses.assignments')}
            </Text>
            {assignments.length === 0 ? (
              <Card>
                <Text muted>{t('courses.noAssignments')}</Text>
              </Card>
            ) : (
              <View style={{ gap: spacing.sm }}>
                {assignments.map((a) => {
                  const due = a.duedate ? new Date(a.duedate * 1000) : null;
                  const overdue = !!due && due.getTime() < Date.now();
                  return (
                    <Card key={a.id}>
                      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                        <View style={{ width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="document-text" size={18} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text weight="semibold" numberOfLines={2}>
                            {a.name}
                          </Text>
                          <Text variant="caption" color={overdue ? colors.danger : colors.textMuted} style={{ marginTop: 2 }}>
                            {due ? t('courses.due', { date: fmtDate(due.toISOString(), lang) }) : t('courses.noDue')}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </View>
            )}

            {/* Grades */}
            <Text variant="subtitle" weight="bold" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
              {t('courses.grades')}
            </Text>
            {grades.length === 0 ? (
              <Card>
                <Text muted>{t('courses.noGrades')}</Text>
              </Card>
            ) : (
              <Card padded={false}>
                {grades.map((g, i) => (
                  <View
                    key={i}
                    style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.divider }}
                  >
                    <Text style={{ flex: 1 }} numberOfLines={2}>
                      {g.itemname || t('courses.courseTotal')}
                    </Text>
                    {g.percentageformatted && g.percentageformatted !== '-' ? (
                      <Badge label={g.percentageformatted} tone="info" />
                    ) : null}
                    <Text weight="bold" color={colors.primary}>
                      {g.gradeformatted && g.gradeformatted !== '-' ? g.gradeformatted : '—'}
                    </Text>
                  </View>
                ))}
              </Card>
            )}
          </>
        )}
      </Screen>
    </View>
  );
}
