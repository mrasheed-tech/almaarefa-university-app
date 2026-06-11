import { useTranslation } from 'react-i18next';
import { setAppLanguage, directionFor, type Lang } from '@/lib/i18n';

/** One hook for translation + current language + text direction. */
export function useLang() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as Lang;
  const dir = directionFor(lang);
  /** Pick the localized value of a bilingual field. */
  const pick = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  return {
    t,
    lang,
    dir,
    isRTL: dir === 'rtl',
    setLang: setAppLanguage,
    pick,
  };
}
