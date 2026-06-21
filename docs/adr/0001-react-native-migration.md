# 0001: React Native Migration Architecture

We are migrating the Workout Tracker React web client to a native mobile application. The existing `react-client` codebase will be preserved intact as a backup. A new directory named `react-native-client` will be created for all native application development.

We decided to use Expo (Managed Workflow) with Expo Router for file-based navigation, NativeWind v4 for styling parity with Tailwind, MMKV for high-performance offline query persistence, victory-native for Skia-powered analytics charts, Moti for UI animations, and a hybrid JWT header/cookie auth mechanism on the NestJS backend to ensure robust, high-performance offline workout logging on native devices.

## Status
Accepted

## Considered Options
- **Target Folder:** Modifying `react-client` in-place (Rejected in favor of creating a new `react-native-client` folder to preserve the web app intact).
- **Framework:** Bare React Native Workflow (Rejected in favor of Expo for rapid development and Config Plugins).
- **Navigation:** React Navigation direct configuration (Rejected in favor of Expo Router for Next-like file routing).
- **Styling:** React Native Stylesheets (Rejected in favor of NativeWind v4 to reuse existing Tailwind classes).
- **Storage:** AsyncStorage (Rejected in favor of MMKV for synchronous speed and no size limits).
- **Auth:** Cookies only (Rejected in favor of adding header-based Bearer JWT support to support native storage easily).
- **Charts:** WebViews (Rejected in favor of victory-native for native smoothness).
- **Animations:** Raw Reanimated (Rejected in favor of Moti for Framer Motion transition parity).
