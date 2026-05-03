<div align="center">
  <img src="src/assets/logo/logo.png" width="200" alt="Mosaic Logo" />
  <h1>Mosaic</h1>
  <p><i>A hand-drawn, sketchbook-themed music experience.</i></p>
</div>

## Overview
Mosaic is a music application designed with a unique sketchbook and paper-themed aesthetic. It provides a tactile, hand-drawn user experience that combines artistic design with modern functionality. The application features a dynamic theme engine, offline playback, and a streamlined "Compact" dashboard.

## Core Features
- **Offline Downloads**: Save entire playlists directly to your device for listening without an internet connection.
- **Compact Dashboard**: A high-density 3-column grid layout for history and liked songs, designed to maximize screen real estate.
- **Persistent Sessions**: Auto-login capabilities powered by persistent state management—stay logged in even after closing the app.
- **Optimized Search**: Lightning-fast music discovery with intelligent result limits to ensure stability and speed.
- **Sketchbook UI**: A custom design system built with a paper and pencil aesthetic, now featuring "Downloaded" status indicators.

## Technology Stack

### Frontend
- **React Native & Expo**: Core framework for cross-platform mobile development.
- **Zustand**: High-performance state management with persistence for auth and playback.
- **Expo-AV & FileSystem**: Powers the high-fidelity audio engine and offline storage system.
- **React Navigation**: Fluid sidebar and stack-based routing.
- **Lucide Icons**: Clean, consistent iconography throughout the app.

### Backend
- **ASP.NET Core (v10.0)**: High-performance modular web API.
- **Firebase**: Managed service for secure authentication and Firestore database.
- **YoutubeExplode**: Advanced metadata and stream extraction engine.

## Design Philosophy
Mosaic prioritizes visual excellence and user engagement through micro-animations, hand-drawn components, and a curated color palette that avoids harsh digital tones in favor of soft, paper-like textures. It aims to bridge the gap between digital utility and the warmth of a physical sketchbook.

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start the app**: `npx expo start`
4. **Download music**: Open any playlist and tap the "Save Offline" icon!

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
