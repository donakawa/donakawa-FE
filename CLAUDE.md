# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Donakawa** (도나카와) is a Korean mobile app — a "소비 코치" (spending/shopping coach) — built with **Expo + React Native + TypeScript**. Despite the directory name `flutter_project`, this is an Expo project.

## Commands

```bash
npm install        # Install dependencies
npx expo start     # Start Expo dev server
npx expo start --tunnel  # Use if device connection fails
npm run lint       # Run ESLint
```

Mobile: scan QR code with Expo Go app.

## Architecture

### Directory Structure

```
app/
  (tabs)/
    index.tsx       # Home screen
    mypage.tsx
    _layout.tsx     # Tab navigator
  _layout.tsx       # Root Stack navigator
components/
  common/           # Shared components (Button, Header, etc.)
  home/             # Page-specific components go in a subfolder named after the page
```

Page-specific components live under `components/<pageName>/`, not inline in `app/`.

### Key Dependencies

| Purpose | Package |
|---------|---------|
| Routing | `expo-router` (file-based) |
| Server state | `@tanstack/react-query` |
| Client state | `zustand` |
| HTTP | `axios` |
| Icons | `@expo/vector-icons` (Ionicons) |
| Animations | `react-native-reanimated` |

### Path Aliases
`@/*` maps to the project root. Prefer `@/components/Foo` over relative paths.

### SafeArea
- `SafeAreaProvider` is applied once in `app/_layout.tsx`
- Each page uses `SafeAreaView`

## Git & Commit Conventions

### Branch Naming
Create a branch **after creating an issue**. Format: `<type>/#<issueNumber>/<detail>`

- `init/#1/settings`
- `feat/#3/mainPage`
- Types: `init`, `feat`, `fix`, `refactor`

### Git Flow
`feature` → `develop` → `main`

### Commit Style (Gitmoji)
Use `gitmoji -c` to commit interactively.

| Emoji | Type | Usage |
|-------|------|-------|
| ✨ | Feat | New feature |
| 🐛 | Fix | Bug fix |
| 🎨 | Design | UI/CSS changes |
| ✏️ | Typing Error | Typo fix |
| 📁 | Mod | Folder/file rename or move |
| 💡 | Add | Add files (e.g., images) |
| 🔥 | Del | Delete files |
| ♻️ | Refactor | Code refactoring |
| 🎉 | Init | Project setup |
| 🔀 | Merge | `Merge: branchName(#PRNumber)` |

Format: `<타입>: <작업내용>` — e.g., `Feat: 메인 페이지 개발`

Merge example: `🔀 Merge: init/#1/settings (#2)`

## Code Style

- Styling: `StyleSheet` or `styled-components` (decide per project)
- TypeScript strict mode — no implicit `any`
- PR descriptions and issue titles are written in Korean

### Inner Shadow
inset(inner) box-shadow가 필요한 모든 UI에는 반드시 `components/common/InsetShadow.tsx`를 사용합니다.
- 절대 위치 View로 highlight/shade를 수동 구현하지 말 것
- 기본 props가 디자인 시스템 토큰과 일치하므로 특수한 경우가 아니면 override 금지
- 참고 사용 예: `components/common/FloatingActionButton.tsx`, `components/wish/TournamentBanner.tsx`
