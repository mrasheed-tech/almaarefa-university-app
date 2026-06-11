# Almaarefa University — Mobile App

A cross-platform (iOS + Android) campus "super-app" for **Almaarefa University** (جامعة المعرفة),
built with **Expo / React Native + TypeScript**. Students, faculty, academic advisors, and student
affairs get one branded, bilingual (Arabic/English, full RTL) home for everything on campus.

> **Phase 1 (this codebase):** a complete, runnable UI with role-aware navigation and realistic
> seeded data. **Phase 2** swaps the data layer to a live **Supabase** backend and adds the secure
> university SSO. The Portal and Moodle already open inside a secure in-app WebView on their own login
> pages — the app never stores university passwords.

## Prerequisites

- **Node.js 20 LTS** (Expo SDK 52 requires Node 18+). Check with `node -v`.
  - Upgrade: `brew install node@20` or `nvm install 20 && nvm use 20`.
- **Xcode** (iOS simulator) and/or **Android Studio** (Android emulator), or the **Expo Go** app on a
  physical phone.

## Run it

```bash
npm install
npx expo start          # press i (iOS), a (Android), or scan the QR with Expo Go
# or:  npm run web       # open in a browser
```

If `expo-doctor` reports version mismatches, run `npx expo install --fix`.

## Demo accounts

The login screen has one-tap **demo role buttons** (no real password needed yet):

| Role | Sees |
|---|---|
| **Student** | schedule, grades, reminders, excuses upload, messages, digital ID |
| **Faculty** | teaching schedule, invigilation duties, message students |
| **Academic Advisor** | advisee list + send individual notices |
| **Student Affairs** | excuse review queue (approve/reject) |
| **Vendor** | manage their café's menu items |

You can also type any of the seeded IDs (e.g. `4210234`) with any password.

## Features

Home dashboard · Calendar (class schedule + teacher invigilation) · Mail + Messaging · Reminders ·
Events · Shuttle service · Food services (vendor menus + self-service) · Research · News · Directory ·
Digital campus ID (QR) · Campus map · Grades · Library · Prayer times · Safety & Emergency ·
Portal & Moodle (secure WebView) · bilingual AR/EN with RTL · Settings.

## Project structure

```
app/                    Expo Router routes
  _layout.tsx           providers + auth gate
  (auth)/login.tsx      branded login + demo roles
  (tabs)/               Home · Calendar · Mail · Services · More
  section/              every feature screen (reminders, food, excuses, id, …)
  webview/[target].tsx  Portal / Moodle / webmail in-app
src/
  theme/                brand palette + design tokens
  components/           themed UI kit (Text, Card, Button, ListItem, …)
  lib/                  i18n, auth, supabase (Phase 2), config, datetime
  data/                 types, seeded mock data, data-access layer
  features/services/    service catalog (drives the Services hub)
  locales/              en.json · ar.json
assets/                 icon, splash logo
```

## Brand palette (from um.edu.sa)

Primary teal `#00ADCA` · dark teal `#18A4BD` · gold `#FFB606` · green `#4AA485` · slate `#4C6176`.

## Phase 2 — connecting Supabase

1. Create a Supabase project; put the URL + anon key in `.env` (see `.env.example`).
2. Apply the schema + Row Level Security migrations (to be added under `supabase/migrations/`).
3. The functions in `src/data/index.ts` become Supabase queries — screens stay unchanged.
4. Add real university SSO and Moodle Web Services / SIS API adapters.

---
Built with the Almaarefa brand identity. Not yet an official university release.
