import { ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Avatar, Badge, Card, EmptyState, IconTile, SectionHeader, Text } from '@/components';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/hooks/useLang';
import { colors, gradients, palette, radius, spacing } from '@/theme';
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

  const todays = getScheduleFor(role)
    .filter((c) => c.day === todayWeekday())
    .sort((a, b) => a.start.localeCompare(b.start));
  const activeReminders = getReminders().filter((r) => !r.done).slice(0, 3);
  const shuttle = getShuttleRoutes()[0];
  const events = getEvents().slice(0, 2);
  const notices = getNotices().slice(0, 2);
  const showSchedule = role === 'student' || role === 'teacher';

  const quickLinks = [
    { icon: 'globe' as const, label: t('home.openPortal'), color: palette.blue, bg: palette.blueTint, route: '/webview/portal' },
    { icon: 'book' as const, label: t('home.openMoodle'), color: palette.green, bg: palette.greenTint, route: '/webview/moodle' },
    { icon: 'card' as const, label: t('home.digitalId'), color: '#6020D2', bg: '#EEE7FB', route: '/section/id' },
    { icon: 'grid' as const, label: t('home.more'), color: palette.teal, bg: palette.tealTint, route: '/(tabs)/services' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
      >
        {/* Hero */}
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl + spacing.md }}
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

        {/* Quick links card (overlapping hero) */}
        <View style={{ marginTop: -spacing.xxl, marginHorizontal: spacing.lg }}>
          <Card>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
              {quickLinks.map((q) => (
                <IconTile
                  key={q.label}
                  icon={q.icon}
                  label={q.label}
                  color={q.color}
                  bg={q.bg}
                  width={64}
                  onPress={() => router.push(q.route as never)}
                />
              ))}
            </View>
          </Card>
        </View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          <RoleSpotlight role={role} />

          {/* Today's schedule */}
          {showSchedule ? (
            <>
              <SectionHeader title={t('home.todaySchedule')} actionLabel={t('common.seeAll')} onAction={() => router.push('/(tabs)/calendar')} />
              <Card>
                {todays.length === 0 ? (
                  <Text muted center style={{ paddingVertical: spacing.md }}>
                    {role === 'teacher' ? t('home.noDutyToday') : t('home.noClassesToday')}
                  </Text>
                ) : (
                  todays.map((c, i) => (
                    <View
                      key={c.id}
                      style={{
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        gap: spacing.md,
                        paddingVertical: spacing.sm,
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderTopColor: colors.divider,
                      }}
                    >
                      <View style={{ width: 4, height: 40, borderRadius: 2, backgroundColor: c.color }} />
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
              </Card>
            </>
          ) : null}

          {/* Reminders */}
          {showSchedule ? (
            <>
              <SectionHeader title={t('home.remindersDue')} actionLabel={t('common.seeAll')} onAction={() => router.push('/section/reminders')} />
              <Card>
                {activeReminders.length === 0 ? (
                  <Text muted center style={{ paddingVertical: spacing.md }}>
                    {t('reminders.empty')}
                  </Text>
                ) : (
                  activeReminders.map((r, i) => (
                    <View
                      key={r.id}
                      style={{
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        gap: spacing.md,
                        paddingVertical: spacing.sm,
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderTopColor: colors.divider,
                      }}
                    >
                      <Ionicons name="ellipse-outline" size={20} color={colors.primary} />
                      <Text style={{ flex: 1 }} numberOfLines={1}>
                        {r.title}
                      </Text>
                      <Text variant="caption" muted>
                        {relativeDay(r.dueAt, lang, t)}
                      </Text>
                    </View>
                  ))
                )}
              </Card>
            </>
          ) : null}

          {/* Next shuttle */}
          {shuttle ? (
            <>
              <SectionHeader title={t('home.nextShuttle')} actionLabel={t('common.seeAll')} onAction={() => router.push('/section/shuttle')} />
              <Card onPress={() => router.push('/section/shuttle')}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                  <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.successTint, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="bus" size={22} color={palette.green} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text weight="semibold">{pick(shuttle.nameEn, shuttle.nameAr)}</Text>
                    <Text variant="label" muted>
                      {pick(shuttle.fromEn, shuttle.fromAr)} → {pick(shuttle.toEn, shuttle.toAr)}
                    </Text>
                  </View>
                  <Badge label={nextShuttleTime(shuttle.times)} tone="success" />
                </View>
              </Card>
            </>
          ) : null}

          {/* Upcoming events */}
          <SectionHeader title={t('home.upcomingEvents')} actionLabel={t('common.seeAll')} onAction={() => router.push('/section/events')} />
          <View style={{ gap: spacing.sm }}>
            {events.map((e) => (
              <Card key={e.id} onPress={() => router.push('/section/events')}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.md }}>
                  <View style={{ width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="sparkles" size={20} color={palette.goldDark} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text weight="semibold" numberOfLines={1}>
                      {pick(e.titleEn, e.titleAr)}
                    </Text>
                    <Text variant="label" muted numberOfLines={1}>
                      {fmtDate(e.start, lang)} · {fmtTime(e.start, lang)} · {pick(e.locationEn, e.locationAr)}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>

          {/* Latest notices */}
          <SectionHeader title={t('home.latestNotices')} actionLabel={t('common.seeAll')} onAction={() => router.push('/section/news')} />
          <Card>
            {notices.map((n, i) => (
              <View
                key={n.id}
                style={{
                  paddingVertical: spacing.sm,
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: colors.divider,
                }}
              >
                <Text weight="semibold" numberOfLines={1}>
                  {pick(n.titleEn, n.titleAr)}
                </Text>
                <Text variant="label" muted numberOfLines={2}>
                  {pick(n.bodyEn, n.bodyAr)}
                </Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function RoleSpotlight({ role }: { role: string }) {
  const router = useRouter();
  const { t, lang, pick, isRTL } = useLang();

  let content: { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string; title: string; subtitle: string; route: string } | null = null;

  if (role === 'teacher') {
    const next = getInvigilations().slice().sort((a, b) => a.date.localeCompare(b.date))[0];
    if (next) {
      content = {
        icon: 'clipboard',
        color: palette.slate,
        bg: '#ECEFF3',
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
      color: palette.green,
      bg: palette.greenTint,
      title: `${all.length} ${t('notices.advisees')}`,
      subtitle: `${atRisk} ${t('excuses.statusPending')}`,
      route: '/section/notices',
    };
  } else if (role === 'student_affairs') {
    const pending = getExcusesQueue().filter((e) => e.status === 'pending').length;
    content = {
      icon: 'document-attach',
      color: palette.red,
      bg: palette.redTint,
      title: t('sections.excuseReview.title'),
      subtitle: `${pending} · ${t('excuses.statusPending')}`,
      route: '/section/excuses-review',
    };
  } else if (role === 'vendor') {
    content = {
      icon: 'restaurant',
      color: palette.goldDark,
      bg: palette.goldTint,
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
          <View style={{ width: 46, height: 46, borderRadius: radius.md, backgroundColor: content.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={content.icon} size={22} color={content.color} />
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
