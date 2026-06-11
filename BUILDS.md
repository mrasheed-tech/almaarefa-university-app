# Building & Releasing — Almaarefa University App

Uses **EAS Build / Submit**. Run everything with **Node 20**:

```bash
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"   # or: nvm use 20
cd "/Users/mustafamustafa/Almaarefa University App"
```

EAS project: `@mustafarasheed/almaarefa-university-app` · bundle id / package: `sa.edu.um.app`.

## Profiles (`eas.json`)
- **preview** — internal testing. Android → installable **APK**; iOS → simulator build.
- **production** — store builds. Android → **AAB**; iOS → store **.ipa**.

`EXPO_PUBLIC_*` env vars are injected per-profile in `eas.json` (the local `.env` is gitignored, so it is **not** uploaded to EAS — keep build env in `eas.json` or EAS env vars).

> EAS uploads from **git**, so commit changes before building (`git add -A && git commit`).

---

## Android

**Internal APK (no store account needed)** — ✅ done:
```bash
npx eas-cli build -p android --profile preview
# → returns an install link / QR for any Android device
```

**Play Store** (requires a **Google Play Console** account, $25 one-time):
1. Create the app in Play Console with package `sa.edu.um.app`; create an **Internal testing** track.
2. Create a Google Cloud **service account** with Play access and download its **JSON key**.
3. In `eas.json` → `submit.production`:
   ```json
   "android": { "serviceAccountKeyPath": "./private/play-service-account.json", "track": "internal" }
   ```
4. Build + submit:
   ```bash
   npx eas-cli build  -p android --profile production
   npx eas-cli submit -p android --profile production
   ```

---

## iOS / TestFlight (requires **Apple Developer Program**, $99/yr)

**Recommended — non-interactive via App Store Connect API key:**
1. App Store Connect → **Users and Access → Integrations → Team Keys** → generate (role **App Manager**). Download the **`.p8`**, note **Key ID** + **Issuer ID**. Get your **Team ID** from developer.apple.com/account (Membership). Put the `.p8` somewhere like `./private/asc.p8` (gitignored).
2. In `eas.json` → `submit.production`:
   ```json
   "ios": {
     "ascApiKeyPath": "./private/asc.p8",
     "ascApiKeyId": "XXXXXXXXXX",
     "ascApiKeyIssuerId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "appleTeamId": "XXXXXXXXXX"
   }
   ```
3. Build + submit:
   ```bash
   npx eas-cli build  -p ios --profile production --non-interactive
   npx eas-cli submit -p ios --profile production --non-interactive
   ```
4. In App Store Connect → **TestFlight**, add internal/external testers.

**Alternative — interactive:** `npx eas-cli build -p ios --profile production` and log in to Apple (with 2FA) when prompted; EAS auto-manages the signing certificate + provisioning profile. Then run the submit command.

---

## OTA updates (optional, nice-to-have)
Ship JS-only changes without a new store build:
```bash
npx expo install expo-updates
eas update:configure
eas update --branch preview -m "message"
```
