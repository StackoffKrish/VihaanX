# Mohalla Mart

Kirana Pay Later for Saket, Delhi. This is **Step 1: skeleton only**: all data and actions are mock placeholders. There is no backend, Supabase, Mapbox, Gemini or payments integration.

## Prerequisites

- Node.js 20 and npm (workspaces supported).
- Run `npm install` once from the repository root. The app dependencies follow the official Expo SDK 53 Router template.
- An SDK 53-compatible Expo Go build or a simulator for native testing. Current app-store Expo Go versions may not support SDK 53; check https://expo.dev/go for available builds. NativeWind and fonts are installed through the workspace.

## Start an app

From the repository root, choose one:

```sh
cd apps/customer && npx expo start
cd apps/kirana && npx expo start
cd apps/rider && npx expo start
```

Run each command in a separate terminal, or return to the repository root before running another. Scan the QR code with Expo Go, or use the Expo CLI shortcuts for Android/iOS.

## Run on web

From the repository root, choose one (run in separate terminals):

```sh
cd apps/customer && npx expo start --web
cd apps/kirana && npx expo start --web
cd apps/rider && npx expo start --web
```

If running more than one at once, Expo will prompt to use a different port; alternatively pass `--port 8082` or `--port 8083` for the additional apps. For a clean cache, append `--clear`.

### Kirana or Rider shows plain text with no styles

The three apps share one hoisted `node_modules` and, by default, one Metro transform cache. Without a per-app cache key, the app bundled first leaks its route folder and `global.css` into the others, so NativeWind never runs for them and the screens render unstyled. Each `metro.config.js` therefore sets `config.cacheVersion` to the app's package name; keep that line when editing the Metro config. If an app still looks unstyled after pulling, start it once with `--clear`.

## Type checking

```sh
npm run typecheck
```

The shared package contains the theme, mock state, domain types, and common components. Monetary domain values are integer paise. Language state is in-memory per app and resets on reload. The font files for Inter and Noto Sans Devanagari come from the Expo Google Fonts packages.

The Step 0 `.env.example` is empty because the requested exact key names were not provided; fill only the agreed key names later, without secrets. No credentials are needed for this skeleton.

NativeWind 4.1.23 is pinned for SDK 53’s Reanimated 3. `query-string` 7 is explicit because Expo Router 5 imports it without declaring it; `expo-asset` and `react-native-css-interop` are explicit to support workspace hoisting.
