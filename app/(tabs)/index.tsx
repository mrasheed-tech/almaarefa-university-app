import { Pressable, ScrollView, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Avatar, Badge, Card, IconTile, SectionHeader, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { colors, gradients, radius, spacing } from '@/theme';
import {
  getAdvisees,
  getEvents,
  getExcusesQueue,
  getInvigilations,
  getNotices,
  getReminders,
  getScheduleFor,
  getShuttleRoutes,
} from '@/data';
import { fmtDate, fmtTime, relativeDay, todayWeekday } from '@/lib/datetime';

function nextShuttleTime(times: string[]): string {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  for (const tt of times) {
    const [h, m] = tt.split(':').map(Number);
    if (h * 60 + m >= mins) return tt;
  }
  return times[0];
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { t, lang, pick, isRTL } = useLang();
  if (!user) return null;

  const role = user.role;
  const firstName = pick(user.nameEn, user.nameAr).split(' ').slice(0, 2).join(' ');
  const hour = new Date().getHours();
  const greetKey = hour < 12 ? 'home.greetingMorning' : hour < 18 ? 'home.greetingAfternoon' : 'home.greetingEvening';
  const chevron = isRTL ? 'chevron-back' : 'chevron-forward';

  const news = getNotices();
  const featured = news[0];
  const moreNews = news.slice(1, 3);
  const todays = getScheduleFor(role)
    .filter((c) => c.day === todayWeekday())
    .sort((a, b) => a.start.localeCompare(b.start));
  const activeReminders = getReminders().filter((r) => !r.done).slice(0, 3);
  const shuttle = getShuttleRoutes()[0];
  const nextEvent = getEvents()[0];
  const showSchedule = role === 'student' || role === 'teacher';

  const quickLinks = [
    { icon: 'book' as const, label: t('home.openMoodle'), route: '/webview/moodle' },
    { icon: 'card' as const, label: t('home.digitalId'), route: '/section/id' },
    { icon: 'grid' as const, label: t('home.more'), route: '/(tabs)/services' },
  ];

  const row = (top: boolean): ViewStyle => ({
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderTopWidth: top ? 1 : 0,
    borderTopColor: colors.divider,
  });
  const tile: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: '#ECEFF3',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
        {/* Hero */}
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }}
        >
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text color="rgba(255,255,255,0.9)">{t(greetKey)}</Text>
              <Text variant="title" color="#fff" weight="bold" numberOfLines={1}>
                {firstName}
              </Text>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginTop: 6 }}>
                <Badge label={t(`roles.${role}`)} tone="accent" />
              </View>
            </View>
            <Avatar name={pick(user.nameEn, user.nameAr)} size={52} color="rgba(255,255,255,0.22)" />
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
          {/* University news — first thing on the page */}
          <SectionHeader title={t('home.universityNews')} actionLabel={t('common.seeAll')} onAction={() => router.push('/section/news')} />
          {featured ? (
            <Card onPress={() => router.push('/section/news')}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.md }}>
                <View style={tile}>
                  <Ionicons name="newspaper" size={21} color={colors.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text weight="bold" numberOfLines={2}>
                    {pick(featured.titleEn, featured.titleAr)}
                  </Text>
                  <Text variant="label" muted numberOfLines={2} style={{ marginTop: 2 }}>
                    {pick(featured.bodyEn, featured.bodyAr)}
                  </Text>
                  <Text variant="caption" muted style={{ marginTop: 4 }}>
                    {fmtDate(featured.date, lang)}
                  </Text>
                </View>
              </View>
            </Card>
          ) : null}
          {moreNews.length ? (
            <Card padded={false} style={{ marginTop: spacing.sm }}>
              {moreNews.map((n, i) => (
                <Pressable
                  key={n.id}
                  onPress={() => router.push('/section/news')}
                  style={({ pressed }) => [row(i > 0), pressed && { backgroundColor: colors.surfaceAlt }]}
                >
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
                  <Text style={{ flex: 1 }} numberOfLines={1}>
                    {pick(n.titleEn, n.titleAr)}
                  </Text>
                  <Text variant="caption" muted>
                    {fmtDate(n.date, lang)}
                  </Text>
                </Pressable>
              ))}
            </Card>
          ) : null}

          <RoleSpotlight role={role} />

          {/* Quick links */}
          <View style={{ marginTop: spacing.lg }}>
            <Card>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                {quickLinks.map((q) => (
                  <IconTile key={q.label} icon={q.icon} label={q.label} color={colors.textSecondary} bg="#ECEFF3" width={64} onPress={() => router.push(q.route as never)} />
                ))}
              </View>
            </Card>
          </View>

          {/* Today: schedule + reminders combined */}
          {showSchedule ? (
            <>
              <SectionHeader title={t('home.today')} actionLabel={t('common.seeAll')} onAction={() => router.push('/(tabs)/calendar')} />
              <Card padded={false}>
                {todays.length === 0 ? (
                  <Text muted center style={{ paddingVertical: spacing.md }}>
                    {role === 'teacher' ? t('home.noDutyToday') : t('home.noClassesToday')}
                  </Text>
                ) : (
                  todays.map((c, i) => (
                    <View key={c.id} style={row(i > 0)}>
                      <View style={{ width: 4, height: 36, borderRadius: 2, backgroundColor: c.color }} />
                      <View style={{ flex: 1 }}>
                        <Text weight="semibold" numberOfLines={1}>
                          {pick(c.titleEn, c.titleAr)}
                        </Text>
                        <Text variant="label" muted>
                          {c.courseCode} · {t('calendar.room')} {c.room}
                        </Text>
                      </View>
                      <Text variant="label" weight="semibold" color={colors.textSecondary}>
                        {c.start}
                      </Text>
                    </View>
                  ))
                )}
                {activeReminders.length ? (
                  <View style={{ borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: spacing.sm }}>
                    <Text variant="caption" weight="semibold" muted style={{ paddingHorizontal: spacing.md, textAlign: isRTL ? 'right' : 'left' }}>
                      {t('home.remindersDue')}
                    </Text>
                    {activeReminders.map((r) => (
                      <Pressable
                        key={r.id}
                        onPress={() => router.push('/section/reminders')}
                        style={({ pressed }) => [
                          { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
                          pressed && { backgroundColor: colors.surfaceAlt },
                        ]}
                      >
                        <Ionicons name="ellipse-outline" size={18} color={colors.primary} />
                        <Text style={{ flex: 1 }} numberOfLines={1}>
                          {r.title}
                        </Text>
                        <Text variant="caption" muted>
                          {relativeDay(r.dueAt, lang, t)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </Card>
            </>
          ) : null}

          {/* Around campus: shuttle + next event combined */}
          {shuttle || nextEvent ? (
            <>
              <SectionHeader title={t('home.aroundCampus')} />
              <Card padded={false}>
                {shuttle ? (
                  <Pressable onPress={() => router.push('/section/shuttle')} style={({ pressed }) => [row(false), pressed && { backgroundColor: colors.surfaceAlt }]}>
                    <View style={tile}>
                      <Ionicons name="bus" size={20} color={colors.textSecondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text weight="semibold" numberOfLines={1}>
                        {t('home.nextShuttle')}
                      </Text>
                      <Text variant="label" muted numberOfLines={1}>
                        {pick(shuttle.fromEn, shuttle.fromAr)} → {pick(shuttle.toEn, shuttle.toAr)}
                      </Text>
                    </View>
                    <Badge label={nextShuttleTime(shuttle.times)} tone="neutral" />
                  </Pressable>
                ) : null}
                {nextEvent ? (
                  <Pressable onPress={() => router.push('/section/events')} style={({ pressed }) => [row(!!shuttle), pressed && { backgroundColor: colors.surfaceAlt }]}>
                    <View style={tile}>
                      <Ionicons name="sparkles" size={20} color={colors.textSecondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text weight="semibold" numberOfLines={1}>
                        {pick(nextEvent.titleEn, nextEvent.titleAr)}
                      </Text>
                      <Text variant="label" muted numberOfLines={1}>
                        {fmtDate(nextEvent.start, lang)} · {fmtTime(nextEvent.start, lang)}
                      </Text>
                    </View>
                    <Ionicons name={chevron} size={16} color={colors.textMuted} />
                  </Pressable>
                ) : null}
              </Card>
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function RoleSpotlight({ role }: { role: string }) {
  const router = useRouter();
  const { t, lang, pick, isRTL } = useLang();

  let content: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; route: string } | null = null;

  if (role === 'teacher') {
    const next = getInvigilations().slice().sort((a, b) => a.date.localeCompare(b.date))[0];
    if (next) {
      content = {
        icon: 'clipboard',
        title: pick(next.examEn, next.examAr),
        subtitle: `${fmtDate(next.date, lang)} · ${next.start} · ${t('invigilation.room')} ${next.room}`,
        route: '/section/invigilation',
      };
    }
  } else if (role === 'advisor') {
    const all = getAdvisees();
    const atRisk = all.filter((a) => a.status !== 'good').length;
    content = {
      icon: 'compass',
      title: `${all.length} ${t('notices.advisees')}`,
      subtitle: `${atRisk} ${t('excuses.statusPending')}`,
      route: '/section/notices',
    };
  } else if (role === 'student_affairs') {
    const pending = getExcusesQueue().filter((e) => e.status === 'pending').length;
    content = {
      icon: 'document-attach',
      title: t('sections.excuseReview.title'),
      subtitle: `${pending} · ${t('excuses.statusPending')}`,
      route: '/section/excuses-review',
    };
  } else if (role === 'vendor') {
    content = {
      icon: 'restaurant',
      title: t('food.manageMenu'),
      subtitle: t('sections.food.subtitle'),
      route: '/section/food',
    };
  }

  if (!content) return null;
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Card onPress={() => router.push(content!.route as never)}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ width: 46, height: 46, borderRadius: radius.md, backgroundColor: '#ECEFF3', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={content.icon} size={22} color={colors.textSecondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text weight="semibold" numberOfLines={1}>
              {content.title}
            </Text>
            <Text variant="label" muted numberOfLines={1}>
              {content.subtitle}
            </Text>
          </View>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.textMuted} />
        </View>
      </Card>
    </View>
  );
}
