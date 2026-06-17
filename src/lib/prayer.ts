/**
 * Prayer times for the Almaarefa University campus (Riyadh / Diriyah).
 *
 * Fetched live from the Aladhan API using method 4 (Umm Al-Qura University,
 * Makkah) — the standard calculation for Saudi Arabia. If the network call
 * fails we fall back to a fixed schedule so the screen always shows something.
 */
import { Ionicons } from '@expo/vector-icons';

// Campus coordinates (Diriyah, Riyadh).
const LAT = 24.7975;
const LNG = 46.5783;
const METHOD = 4; // Umm Al-Qura University, Makkah

export interface PrayerTime {
  key: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  en: string;
  ar: string;
  icon: keyof typeof Ionicons.glyphMap;
  time: string; // "HH:MM"
}

// Order + labels + icons. Times here are the offline fallback only.
export const PRAYER_META: PrayerTime[] = [
  { key: 'Fajr', en: 'Fajr', ar: 'الفجر', icon: 'cloudy-night', time: '03:48' },
  { key: 'Dhuhr', en: 'Dhuhr', ar: 'الظهر', icon: 'sunny', time: '11:54' },
  { key: 'Asr', en: 'Asr', ar: 'العصر', icon: 'partly-sunny', time: '15:20' },
  { key: 'Maghrib', en: 'Maghrib', ar: 'المغرب', icon: 'cloudy-night', time: '18:42' },
  { key: 'Isha', en: 'Isha', ar: 'العشاء', icon: 'moon', time: '20:12' },
];

// Aladhan returns times like "04:13 (+03)" — keep just HH:MM.
const clean = (raw: string): string => raw.trim().slice(0, 5);

export async function fetchPrayerTimes(): Promise<PrayerTime[]> {
  const url = `https://api.aladhan.com/v1/timings?latitude=${LAT}&longitude=${LNG}&method=${METHOD}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Aladhan API ${res.status}`);
  const json = await res.json();
  const timings = json?.data?.timings;
  if (!timings) throw new Error('Aladhan API: missing timings');

  return PRAYER_META.map((p) => ({
    ...p,
    time: timings[p.key] ? clean(timings[p.key]) : p.time,
  }));
}

export function nextPrayerIndex(prayers: PrayerTime[]): number {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < prayers.length; i++) {
    const [h, m] = prayers[i].time.split(':').map(Number);
    if (h * 60 + m >= mins) return i;
  }
  return 0;
}
