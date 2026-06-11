/** App-wide configuration sourced from EXPO_PUBLIC_* env vars (see .env.example). */
export const config = {
  portalUrl: process.env.EXPO_PUBLIC_PORTAL_URL ?? 'https://portal.um.edu.sa',
  moodleUrl: process.env.EXPO_PUBLIC_MOODLE_URL ?? 'https://lms.um.edu.sa',
  webmailUrl: process.env.EXPO_PUBLIC_WEBMAIL_URL ?? 'https://outlook.office.com/mail/',
  appVersion: '1.0.0',
} as const;
