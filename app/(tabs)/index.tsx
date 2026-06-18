import { ScrollView, View } from 'react-native';
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
  getMail,
  getNotices,
  getReminders,
  getScheduleFor,
} from '@/data';
import { fmtDate, todayWeekday } from '@/lib/datetime';

type Tile = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  count?: number;
};

/** Notices posted within the last week count as "new". */
function recentCount<T extends { date: string }>(items: T[], days = 7): number {
  const cutoff = Date.now() - days * 86_400_000;
  return items.filter((n) => new Date(n.date).getTime() >= cutoff).length;
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

  // ---- live counts for the notification badges -------------------------
  const todaysClasses = getScheduleFor(role).filter((c) => c.day === todayWeekday()).length;
  const dueReminders = getReminders().filter((r) => !r.done).length;
  const unreadMail = getMail().filter((m) => m.unread).length;
  const upcomingEvents = getEvents().filter((e) => new Date(e.start).getTime() >= Date.now()).length;
  const newNews = recentCount(getNotices());

  const news = getNotices();
  const featured = news[0];

  // ---- role-aware shortcut grid ----------------------------------------
  const tiles: Tile[] = [];
  if (role === 'student') {
    tiles.push(
      { key: 'calendar', icon: 'calendar', route: '/(tabs)/calendar', count: todaysClasses },
      { key: 'reminders', icon: 'alarm', route: '/section/reminders', count: dueReminders },
      { key: 'mail', icon: 'mail', route: '/(tabs)/mail', count: unreadMail },
      { key: 'grades', icon: 'school', route: '/section/grades' },
      { key: 'events', icon: 'sparkles', route: '/section/events', count: upcomingEvents },
      { key: 'id', icon: 'card', route: '/section/id' },
      { key: 'moodle', icon: 'book', route: '/webview/moodle' },
      { key: 'prayer', icon: 'moon', route: '/section/prayer' },
      { key: 'shuttle', icon: 'bus', route: '/section/shuttle' },
      { key: 'food', icon: 'restaurant', route: '/section/food' },
      { key: 'directory', icon: 'people', route: '/section/directory' },
      { key: 'news', icon: 'newspaper', route: '/section/news', count: newNews },
    );
  } else if (role === 'teacher') {
    const upcomingDuty = getInvigilations().filter((i) => new Date(i.date).getTime() >= Date.now()).length;
    tiles.push(
      { key: 'calendar', icon: 'calendar', route: '/(tabs)/calendar', count: todaysClasses },
      { key: 'invigilation', icon: 'clipboard', route: '/section/invigilation', count: upcomingDuty },
      { key: 'mail', icon: 'mail', route: '/(tabs)/mail', count: unreadMail },
      { key: 'id', icon: 'card', route: '/section/id' },
      { key: 'moodle', icon: 'book', route: '/webview/moodle' },
      { key: 'prayer', icon: 'moon', route: '/section/prayer' },
      { key: 'shuttle', icon: 'bus', route: '/section/shuttle' },
      { key: 'directory', icon: 'people', route: '/section/directory' },
      { key: 'news', icon: 'newspaper', route: '/section/news', count: newNews },
    );
  } else if (role === 'advisor') {
    const atRisk = getAdvisees().filter((a) => a.status !== 'good').length;
    tiles.push(
      { key: 'advisees', icon: 'compass', route: '/section/notices', count: atRisk },
      { key: 'mail', icon: 'mail', route: '/(tabs)/mail', count: unreadMail },
      { key: 'calendar', icon: 'calendar', route: '/(tabs)/calendar', count: todaysClasses },
      { key: 'id', icon: 'card', route: '/section/id' },
      { key: 'prayer', icon: 'moon', route: '/section/prayer' },
      { key: 'directory', icon: 'people', route: '/section/directory' },
      { key: 'news', icon: 'newspaper', route: '/section/news', count: newNews },
      { key: 'services', icon: 'grid', route: '/(tabs)/services' },
    );
  } else if (role === 'student_affairs') {
    const pending = getExcusesQueue().filter((e) => e.status === 'pending').length;
    tiles.push(
      { key: 'excuses', icon: 'document-attach', route: '/section/excuses-review', count: pending },
      { key: 'mail', icon: 'mail', route: '/(tabs)/mail', count: unreadMail },
      { key: 'id', icon: 'card', route: '/section/id' },
      { key: 'prayer', icon: 'moon', route: '/section/prayer' },
      { key: 'directory', icon: 'people', route: '/section/directory' },
      { key: 'news', icon: 'newspaper', route: '/section/news', count: newNews },
      { key: 'services', icon: 'grid', route: '/(tabs)/services' },
    );
  } else if (role === 'vendor') {
    tiles.push(
      { key: 'food', icon: 'restaurant', route: '/section/food' },
      { key: 'orders', icon: 'receipt', route: '/section/orders' },
      { key: 'mail', icon: 'mail', route: '/(tabs)/mail', count: unreadMail },
      { key: 'id', icon: 'card', route: '/section/id' },
      { key: 'prayer', icon: 'moon', route: '/section/prayer' },
      { key: 'services', icon: 'grid', route: '/(tabs)/services' },
    );
  } else {
    tiles.push(
      { key: 'mail', icon: 'mail', route: '/(tabs)/mail', count: unreadMail },
      { key: 'directory', icon: 'people', route: '/section/directory' },
      { key: 'news', icon: 'newspaper', route: '/section/news', count: newNews },
      { key: 'services', icon: 'grid', route: '/(tabs)/services' },
    );
  }

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
          {/* Shortcut grid — icon-first, with notification badges */}
          <SectionHeader title={t('home.shortcuts')} />
          <Card>
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                flexWrap: 'wrap',
                rowGap: spacing.md,
                justifyContent: 'space-between',
              }}
            >
              {tiles.map((tile) => (
                <IconTile
                  key={tile.key}
                  icon={tile.icon}
                  label={t(`home.grid.${tile.key}`)}
                  count={tile.count}
                  width="25%"
                  onPress={() => router.push(tile.route as never)}
                />
              ))}
            </View>
          </Card>

          {/* University news — kept as one compact featured card */}
          {featured ? (
            <>
              <SectionHeader title={t('home.universityNews')} actionLabel={t('common.seeAll')} onAction={() => router.push('/section/news')} />
              <Card onPress={() => router.push('/section/news')}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing.md }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: radius.md,
                      backgroundColor: '#ECEFF3',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="newspaper" size={21} color={colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text weight="bold" numberOfLines={2}>
                      {pick(featured.titleEn, featured.titleAr)}
                    </Text>
                    <Text variant="caption" muted style={{ marginTop: 4 }}>
                      {fmtDate(featured.date, lang)}
                    </Text>
                  </View>
                </View>
              </Card>
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
