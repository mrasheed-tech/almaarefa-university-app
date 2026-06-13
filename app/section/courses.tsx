import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, EmptyState, Header, Screen, Text, TextField } from '@/components';
import { useLang } from '@/hooks/useLang';
import {
  clearConnection,
  connect,
  DEFAULT_MOODLE_URL,
  getCourses,
  loadConnection,
  type MoodleConnection,
  type MoodleCourse,
} from '@/lib/moodle';
import { colors, radius, spacing } from '@/theme';

export default function Courses() {
  const { t, isRTL } = useLang();
  const router = useRouter();

  const [conn, setConn] = useState<MoodleConnection | null>(null);
  const [ready, setReady] = useState(false);

  // connect form
  const [url, setUrl] = useState(DEFAULT_MOODLE_URL);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // courses
  const [courses, setCourses] = useState<MoodleCourse[] | null>(null);
  const [coursesError, setCoursesError] = useState(false);

  useEffect(() => {
    loadConnection().then((c) => {
      setConn(c);
      setReady(true);
      if (c) void loadCourses(c);
    });
  }, []);

  const loadCourses = async (c: MoodleConnection) => {
    setCoursesError(false);
    try {
      setCourses(await getCourses(c.url, c.token, c.userId));
    } catch {
      setCoursesError(true);
      setCourses([]);
    }
  };

  const onConnect = async () => {
    if (!username.trim() || !password) return;
    setConnecting(true);
    setError(null);
    try {
      const c = await connect(url, username.trim(), password);
      setPassword('');
      setConn(c);
      void loadCourses(c);
    } catch {
      setError(t('courses.connectError'));
    } finally {
      setConnecting(false);
    }
  };

  const onDisconnect = async () => {
    await clearConnection();
    setConn(null);
    setCourses(null);
  };

  if (!ready) {
    return (
      <View style={{ flex: 1 }}>
        <Header back title={t('sections.courses.title')} subtitle={t('sections.courses.subtitle')} />
        <Screen>
          <ActivityIndicator color={colors.primary} />
        </Screen>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('sections.courses.title')} subtitle={t('sections.courses.subtitle')} />
      <Screen scroll>
        {!conn ? (
          /* ---------------- Connect form ---------------- */
          <Card>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.sm, alignItems: 'center', marginBottom: spacing.md }}>
              <Ionicons name="link" size={20} color={colors.primary} />
              <Text variant="subtitle" weight="bold" style={{ flex: 1 }}>
                {t('courses.connectTitle')}
              </Text>
            </View>
            <Text variant="label" muted style={{ marginBottom: spacing.md }}>
              {t('courses.connectNote')}
            </Text>
            <View style={{ gap: spacing.md }}>
              <TextField label={t('courses.url')} icon="globe-outline" autoCapitalize="none" autoCorrect={false} keyboardType="url" value={url} onChangeText={setUrl} />
              <TextField label={t('courses.username')} icon="person-outline" autoCapitalize="none" autoCorrect={false} value={username} onChangeText={setUsername} />
              <TextField label={t('courses.password')} icon="lock-closed-outline" secure value={password} onChangeText={setPassword} />
            </View>
            {error ? (
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, alignItems: 'flex-start', marginTop: spacing.md }}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} style={{ marginTop: 2 }} />
                <Text variant="label" color={colors.danger} style={{ flex: 1 }}>
                  {error}
                </Text>
              </View>
            ) : null}
            <View style={{ marginTop: spacing.lg }}>
              <Button title={t('courses.connect')} icon="log-in-outline" loading={connecting} disabled={!username.trim() || !password} onPress={onConnect} />
            </View>
          </Card>
        ) : (
          /* ---------------- Connected: course list ---------------- */
          <>
            <Card>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.successTint, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="school" size={22} color={colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text weight="semibold" numberOfLines={1}>
                    {conn.userName || t('courses.connected')}
                  </Text>
                  <Text variant="caption" muted numberOfLines={1}>
                    {conn.url.replace(/^https?:\/\//, '')}
                  </Text>
                </View>
                <Pressable onPress={onDisconnect} hitSlop={8}>
                  <Text variant="label" color={colors.danger} weight="semibold">
                    {t('courses.disconnect')}
                  </Text>
                </Pressable>
              </View>
            </Card>

            <View style={{ marginTop: spacing.md }}>
              {courses === null ? (
                <ActivityIndicator color={colors.primary} />
              ) : coursesError ? (
                <EmptyState icon="cloud-offline-outline" title={t('courses.loadError')} />
              ) : courses.length === 0 ? (
                <EmptyState icon="book-outline" title={t('courses.noCourses')} />
              ) : (
                <View style={{ gap: spacing.sm }}>
                  {courses.map((c) => (
                    <Card key={c.id} onPress={() => router.push(`/section/course/${c.id}?name=${encodeURIComponent(c.fullname)}` as never)}>
                      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                        <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="book" size={20} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text weight="semibold" numberOfLines={2}>
                            {c.fullname}
                          </Text>
                          <Text variant="caption" muted numberOfLines={1}>
                            {c.shortname}
                          </Text>
                          {typeof c.progress === 'number' ? (
                            <View style={{ marginTop: 6 }}>
                              <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' }}>
                                <View style={{ width: `${Math.round(c.progress)}%`, height: 5, backgroundColor: colors.primary }} />
                              </View>
                              <Text variant="caption" muted style={{ marginTop: 2 }}>
                                {t('courses.progress', { percent: Math.round(c.progress) })}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.textMuted} />
                      </View>
                    </Card>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
        <View style={{ marginTop: spacing.lg }}>
          <Button title={t('courses.openMoodle')} icon="open-outline" variant="outline" onPress={() => router.push('/webview/moodle')} />
        </View>
      </Screen>
    </View>
  );
}
