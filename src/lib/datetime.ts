import { format, isToday, isTomorrow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import type { Lang } from './i18n';

const localeFor = (lang: Lang) => (lang === 'ar' ? ar : enUS);

export function fmtTime(iso: string, lang: Lang): string {
  return format(new Date(iso), 'h:mm a', { locale: localeFor(lang) });
}

export function fmtDate(iso: string, lang: Lang): string {
  return format(new Date(iso), 'EEE, d MMM', { locale: localeFor(lang) });
}

export function fmtDateTime(iso: string, lang: Lang): string {
  return format(new Date(iso), 'EEE, d MMM · h:mm a', { locale: localeFor(lang) });
}

/** Today / Tomorrow / formatted date. `t` provides the localized today/tomorrow words. */
export function relativeDay(iso: string, lang: Lang, t: (k: string) => string): string {
  const d = new Date(iso);
  if (isToday(d)) return t('common.today');
  if (isTomorrow(d)) return t('common.tomorrow');
  return fmtDate(iso, lang);
}

/** 0 = Sunday … 6 = Saturday (matches ClassSession.day). */
export function todayWeekday(): number {
  return new Date().getDay();
}
