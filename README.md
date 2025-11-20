# Quran App

A beautiful and feature-rich mobile application for reading and exploring the Holy Quran, built with React Native and Expo.

## Features

- **Complete Quran**: Browse all 114 Surahs with Arabic text and translations
- **Smart Search**: Search across all verses and Surahs
- **Bookmarks**: Save your reading progress and mark important verses
- **Favorites**: Keep track of your favorite Surahs and verses
- **Theme Support**: Light and dark mode for comfortable reading
- **Offline Support**: Access Quran content without an internet connection
- **Audio Playback**: Listen to Quran recitations (via Expo AV)
- **Beautiful UI**: Modern, clean interface with smooth animations

## Technologies

- **React Native** - Cross-platform mobile development
- **Expo** - Development framework and tooling
- **React Navigation** - Navigation and routing
- **AsyncStorage** - Local data persistence
- **Expo Linear Gradient** - Beautiful gradient effects
- **Expo AV** - Audio playback capabilities

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing)

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quran-app.git
   cd quran-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## Project Structure

```
quran-app/
├── assets/              # Images, fonts, and other static files
├── components/          # Reusable UI components
│   ├── AppHeader.jsx
│   ├── SafeScreen.jsx
│   └── SurahCard.jsx
├── constants/           # App constants and configuration
├── contexts/            # React Context providers
│   └── ThemeContext.js
├── screens/             # Application screens
│   ├── HomeScreen.jsx
│   ├── SurahListScreen.jsx
│   ├── SurahDetailScreen.jsx
│   ├── SearchScreen.jsx
│   ├── BookmarksScreen.jsx
│   ├── FavoritesScreen.jsx
│   └── SplashScreen.jsx
├── utils/               # Utility functions and helpers
├── App.js               # Main application component
└── package.json         # Project dependencies
```

## Key Features Explained

### Surah Reading
- View complete Surahs with verse-by-verse display
- Smooth scrolling with pagination for better performance
- Arabic text with proper formatting

### Bookmarks & Favorites
- Bookmark specific verses to return to them later
- Mark entire Surahs as favorites for quick access
- Persistent storage using AsyncStorage

### Search Functionality
- Search across all Surahs and verses
- Real-time search results
- Navigate directly to search results

### Theme Support
- Toggle between light and dark modes
- Consistent theming across all screens
- Comfortable reading experience in any lighting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Quran data provided by [Al-Quran Cloud API](https://alquran.cloud/api)
- Icons by [Ionicons](https://ionic.io/ionicons)
- Built with [Expo](https://expo.dev/)

## Contact

For questions or suggestions, please open an issue on GitHub.


