# Frontend Documentation

This document provides an overview of the modules and libraries used in the Mosaic mobile application (Expo/React Native).

## Modules

The frontend is organized into modular feature areas:

- **Auth**: Logic for user login, registration, and persistent session management.
- **Dashboard**: The main home screen, providing a "Compact" grid view of history and liked songs.
- **Music**: The core playback engine.
    - **Player**: Full-screen player with controls, progress bar, and queue management.
    - **Search**: Interface for finding new music via the backend API.
- **Playlists**: Complete management of personal playlists.
- **Liked**: Dedicated screen for the user's "Liked Songs" collection.
- **History**: Provides access to the user's listening history.
- **Offline**: Manages local downloads using `expo-file-system` for playback without internet.
- **Profile**: User account settings and profile overview.
- **Landing**: Initial onboarding and welcome experience.

## State Management

- **Zustand**: Used for high-performance, lightweight state management.
    - `auth.slice.ts`: Manages user sessions with `persist` middleware for auto-login.
    - `music.slice.ts`: Manages the active track, playback state, and the play queue.

## Libraries & Frameworks

- **Expo (v54)**: The development platform and framework for the React Native application.
- **React Native (v0.81.5)**: The underlying UI framework.
- **React Navigation (v7)**: Handles all routing and screen transitions (Stack and Sidebar navigation).
- **Expo-AV**: Used for high-quality audio playback and hardware integration.
- **Expo-FileSystem (Legacy)**: Powers the offline download feature by saving audio streams to local storage.
- **Axios**: Used for all network requests to the backend API.
- **Lucide React Native**: Providing a clean, consistent set of icons throughout the app.
- **React Native Reanimated**: Powers smooth animations and transitions.
- **AsyncStorage**: Used for persistent local storage of settings, auth sessions, and offline metadata.
- **Google Fonts (Patrick Hand)**: Used for the signature "Paper/Sketch" aesthetic of the application.
