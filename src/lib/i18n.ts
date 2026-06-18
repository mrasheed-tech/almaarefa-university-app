import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, DevSettings, Platform } from 'react-native';
import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

export type Lang = 'en' | 'ar';
export const LANGUAGE_KEY = 'app.language';
export const SUPPORTED_LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

function detectInitialLanguage(): Lang {
  try {
    const code = Localization.getLocales?.()?.[0]?.languageCode;
    return code === 'ar' ? 'ar' : 'en';
  } catch {
    return 'en';
  }
}

const initial = detectInitialLanguage();

// Set direction as early as possible — module import runs before the first render.
I18nManager.allowRTL(true);
I18nManager.forceRTL(initial === 'ar');

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, ar: { translation: ar } },
    lng: initial,
    fallbackLng: 'en',
    defaultNS: 'translation',
    interpolation: { escapeValue: false },
    returnNull: false,
    react: { useSuspense: false },
  });
}

export function directionFor(lang: string): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Reload the JS bundle so native RTL/LTR mirroring takes effect.
 * Production builds must use expo-updates' reloadAsync — DevSettings.reload
 * is a development-only API and crashes the app in a release build (the cause
 * of the "app closes when switching language" bug). DevSettings is used only
 * under __DEV__ where expo-updates reload is unavailable.
 */
async function reloadApp() {
  if (__DEV__) {
    try {
      DevSettings.reload();
    } catch {
      // no-op
    }
    return;
  }
  try {
    await Updates.reloadAsync();
  } catch {
    // no-op in environments without expo-updates — applies on next launch
  }
}

function applyDirection(lang: Lang, reload: boolean) {
  const shouldRTL = lang === 'ar';
  if (I18nManager.isRTL !== shouldRTL) {
    I18nManager.allowRTL(shouldRTL);
    I18nManager.forceRTL(shouldRTL);
    // Native layout mirroring only fully applies after a reload. On web,
    // react-native-web flips direction live, so no reload is needed.
    if (reload && Platform.OS !== 'web') {
      reloadApp();
    }
  }
}

/** Restore the saved language on startup (call once from the root layout). */
export async function restoreLanguage(): Promise<void> {
  try {
    const saved = (await SecureStore.getItemAsync(LANGUAGE_KEY)) as Lang | null;
    if (saved && saved !== i18n.language) {
      await i18n.changeLanguage(saved);
      applyDirection(saved, false);
    }
  } catch {
    // ignore
  }
}

/** Change the app language, persist it, and flip RTL/LTR (reloads to mirror layout). */
export async function setAppLanguage(lang: Lang): Promise<void> {
  await i18n.changeLanguage(lang);
  try {
    await SecureStore.setItemAsync(LANGUAGE_KEY, lang);
  } catch {
    // ignore persistence errors
  }
  applyDirection(lang, true);
}

export default i18n;
