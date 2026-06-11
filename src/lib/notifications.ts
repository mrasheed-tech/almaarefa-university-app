import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const REMINDER_NOTIF_PREFIX = 'reminder.notif.';

/** Schedule a local notification to fire at a reminder's due time. */
export async function scheduleReminderNotification(reminderId: string, title: string, dueAtISO: string): Promise<void> {
  try {
    if (Platform.OS === 'web') return;
    const date = new Date(dueAtISO);
    if (isNaN(date.getTime()) || date.getTime() <= Date.now()) return; // only future times
    await cancelReminderNotification(reminderId);
    const notifId = await Notifications.scheduleNotificationAsync({
      content: { title: 'Reminder', body: title, sound: 'default' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date } as any,
    });
    await AsyncStorage.setItem(REMINDER_NOTIF_PREFIX + reminderId, notifId);
  } catch (e) {
    console.warn('[reminder] schedule failed:', (e as Error).message);
  }
}

/** Cancel a previously scheduled reminder notification. */
export async function cancelReminderNotification(reminderId: string): Promise<void> {
  try {
    const key = REMINDER_NOTIF_PREFIX + reminderId;
    const notifId = await AsyncStorage.getItem(key);
    if (notifId) {
      await Notifications.cancelScheduledNotificationAsync(notifId);
      await AsyncStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

// How notifications behave when received while the app is foregrounded.
Notifications.setNotificationHandler({
  handleNotification: async () =>
    ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }) as any,
});

function getProjectId(): string | undefined {
  return (
    (Constants?.expoConfig as any)?.extra?.eas?.projectId ??
    (Constants as any)?.easConfig?.projectId
  );
}

/**
 * Ask for permission, get the device's Expo push token, and store it.
 * No-ops safely on web, on emulators, or before `npx eas init` provides a projectId.
 */
export async function registerForPushNotifications(userId: string): Promise<void> {
  try {
    if (Platform.OS === 'web') return;

    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== 'granted') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        lightColor: '#00ADCA',
      });
    }

    const projectId = getProjectId();
    if (!projectId) {
      console.warn('[push] No EAS projectId yet — run `npx eas init`. Skipping token registration.');
      return;
    }

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    await supabase
      .from('push_tokens')
      .upsert({ user_id: userId, token, platform: Platform.OS }, { onConflict: 'token' });
  } catch (e) {
    console.warn('[push] registration skipped:', (e as Error).message);
  }
}

/** Ask the backend to send a push to a user (via the send-push Edge Function). */
export async function sendPush(params: {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}): Promise<void> {
  try {
    await supabase.functions.invoke('send-push', { body: params });
  } catch (e) {
    console.warn('[push] send failed:', (e as Error).message);
  }
}
