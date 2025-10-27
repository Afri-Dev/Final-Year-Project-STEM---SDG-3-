# Getting Started

<cite>
**Referenced Files in This Document**
- [QUICKSTART.md](file://QUICKSTART.md)
- [BUILD_GUIDE.md](file://BUILD_GUIDE.md)
- [README.md](file://README.md)
- [package.json](file://package.json)
- [app.json](file://app.json)
- [eas.json](file://eas.json)
- [metro.config.js](file://metro.config.js)
- [babel.config.js](file://babel.config.js)
- [tsconfig.json](file://tsconfig.json)
- [INSTRUCTIONS.txt](file://INSTRUCTIONS.txt)
- [AUTH_GUIDE.md](file://AUTH_GUIDE.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Development Environment Setup](#development-environment-setup)
5. [Running the App](#running-the-app)
6. [Configuration Files](#configuration-files)
7. [Common Setup Issues](#common-setup-issues)
8. [Verification and Testing](#verification-and-testing)
9. [Next Steps](#next-steps)

## Introduction

The STEM Learning App is a comprehensive React Native (Expo) application designed for offline STEM education, targeting students aged 10-20 in Zambia. This guide will walk you through setting up the development environment, installing dependencies, and running the app on various platforms including iOS, Android, and web.

The app features gamification elements, adaptive quizzes, progress tracking, and AI-powered learning recommendations. It operates completely offline, making it ideal for areas with limited internet connectivity.

## Prerequisites

Before starting, ensure your development environment meets the following requirements:

### Required Software
- **Node.js**: Version 16 or higher (check with `node --version`)
- **npm**: Version 8 or higher (check with `npm --version`)
- **Expo CLI**: Latest version for development
- **Watchman**: Required for optimal Metro bundler performance
- **Git**: For version control and repository cloning

### Platform-Specific Requirements

#### For Android Development
- **Android Studio**: Latest version with Android SDK
- **Android Emulator**: Or physical Android device
- **ADB (Android Debug Bridge)**: Included with Android Studio

#### For iOS Development
- **macOS**: Required for iOS development
- **Xcode**: Latest version from Mac App Store
- **iOS Simulator**: Comes with Xcode
- **Apple Developer Account**: Optional for physical device testing

#### For Web Development
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge
- **No additional setup** required for web development

**Section sources**
- [README.md](file://README.md#L30-L40)
- [QUICKSTART.md](file://QUICKSTART.md#L1-L10)

## Installation

### Step 1: Clone the Repository

Open your terminal and navigate to your desired development directory:

```bash
# Clone the repository
git clone https://github.com/your-username/stem-learning-app.git
cd stem-learning-app
```

### Step 2: Install Dependencies

Navigate to the project directory and install all required packages:

```bash
# Install dependencies using npm
npm install

# Alternatively, using yarn
yarn install
```

The installation process will download and configure:
- **Expo SDK**: Core framework for React Native development
- **React Native**: Cross-platform mobile framework
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: Navigation system
- **Zustand**: State management
- **SQLite**: Local database
- **Additional dependencies**: Font loading, gesture handling, animations

### Step 3: Verify Installation

After installation completes, verify the setup:

```bash
# Check Node.js version
node --version  # Should be v16+

# Check npm version
npm --version   # Should be 8+
```

**Section sources**
- [package.json](file://package.json#L1-L43)
- [QUICKSTART.md](file://QUICKSTART.md#L11-L20)

## Development Environment Setup

### Expo CLI Configuration

The app uses Expo CLI for development. Ensure you have the latest version:

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Verify installation
expo --version
```

### EAS Build Setup

For production builds, the app uses Expo Application Services (EAS):

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to EAS
eas login
```

### Watchman Installation

Watchman improves Metro bundler performance:

#### macOS (using Homebrew):
```bash
brew install watchman
```

#### Windows/Linux:
Download from: https://facebook.github.io/watchman/docs/install.html

### TypeScript Configuration

The project uses TypeScript with custom path mapping:

```bash
# TypeScript configuration is already set up
# Paths configured in tsconfig.json:
# - @/* for root imports
# - @components/* for components
# - @screens/* for screens
# - @services/* for services
```

**Section sources**
- [tsconfig.json](file://tsconfig.json#L1-L46)
- [babel.config.js](file://babel.config.js#L1-L8)

## Running the App

### Starting the Development Server

Launch the Expo development server:

```bash
# Start the development server
npm start
```

This command will:
- Start the Metro bundler
- Open the Expo Dev Tools in your browser
- Display QR codes for device scanning

### Running on Different Platforms

#### Android
```bash
# Option 1: Press 'a' in terminal after running npm start
npm start
# Then press 'a' in the terminal

# Option 2: Direct Android run
npm run android
```

#### iOS (macOS only)
```bash
# Option 1: Press 'i' in terminal after running npm start
npm start
# Then press 'i' in the terminal

# Option 2: Direct iOS run
npm run ios
```

#### Web
```bash
# Option 1: Press 'w' in terminal after running npm start
npm start
# Then press 'w' in the terminal

# Option 2: Direct web run
npm run web
```

### Development Commands

The project includes several useful scripts:

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Type checking
npm run type-check

# Linting
npm run lint

# Clear cache and restart
expo start -c
```

**Section sources**
- [package.json](file://package.json#L5-L11)
- [QUICKSTART.md](file://QUICKSTART.md#L21-L35)

## Configuration Files

### app.json - App Configuration

The main configuration file controls app metadata, icons, and platform-specific settings:

```json
{
  "expo": {
    "name": "STEM Learning App",
    "slug": "stem-learning-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#1e3a8a"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.stemlearning.app"
    },
    "android": {
      "package": "com.stemlearning.app",
      "edgeToEdgeEnabled": true
    }
  }
}
```

Key configuration areas:
- **App Identity**: Name, slug, version
- **Platform Identifiers**: Bundle IDs for iOS and Android
- **Assets**: Icons, splash screens, adaptive icons
- **Plugins**: Expo modules enabled

### eas.json - EAS Build Configuration

Configure EAS build profiles for different environments:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### metro.config.js - Metro Bundler Configuration

Custom Metro configuration for Expo:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
module.exports = config;
```

### babel.config.js - Babel Configuration

JavaScript/TypeScript transpilation settings:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
```

**Section sources**
- [app.json](file://app.json#L1-L50)
- [eas.json](file://eas.json#L1-L22)
- [metro.config.js](file://metro.config.js#L1-L8)
- [babel.config.js](file://babel.config.js#L1-L8)

## Common Setup Issues

### Metro Bundler Problems

**Issue**: Metro bundler gets stuck or fails to start
**Solution**:
```bash
# Clear Metro cache
npm start -- --reset-cache

# Or reset completely
expo start -c
```

**Issue**: Modules not found errors
**Solution**:
```bash
# Clean install
rm -rf node_modules
npm install
expo prebuild --clean
```

### Device Connection Issues

**Issue**: Cannot find app on physical device
**Solution**:
1. Install Expo Go app from App Store (iOS) or Play Store (Android)
2. Scan QR code displayed in terminal or Expo Dev Tools
3. Ensure device and computer are on same network

**Issue**: Android device not detected
**Solution**:
```bash
# Enable USB debugging on Android device
# Connect device via USB
adb devices  # Should list your device
npm run android
```

### Permission Configuration

**Issue**: Database initialization errors
**Solution**:
```bash
# Clear app data and reinstall
# Android:
adb uninstall com.stemlearning.app
npm run android

# iOS:
# Delete app from simulator/device
# Run npm run ios
```

### TypeScript Compilation Errors

**Issue**: Type errors preventing compilation
**Solution**:
```bash
# Check TypeScript types
npm run type-check

# Restart your IDE/editor
# Clear TypeScript cache
```

### Performance Issues

**Issue**: Slow app startup or navigation
**Solution**:
```bash
# Disable animations temporarily
# Use development client for faster reloads
# Enable Hermes engine for better performance
```

**Section sources**
- [QUICKSTART.md](file://QUICKSTART.md#L350-L388)
- [INSTRUCTIONS.txt](file://INSTRUCTIONS.txt#L80-L100)

## Verification and Testing

### Successful Installation Checklist

After completing setup, verify the installation with these steps:

1. **Terminal Output**: After `npm start`, you should see:
   - Metro bundler starting
   - Expo Dev Tools URL
   - QR codes for device scanning

2. **App Launch**: Open the app on your chosen platform:
   - **Android**: Scan QR code with camera or Expo Go
   - **iOS**: Scan QR code with camera or Expo Go
   - **Web**: Open browser to Dev Tools URL

3. **Basic Functionality**: Test core features:
   - Splash screen displays (2.5 seconds)
   - Welcome screen loads
   - Navigation between tabs works
   - Theme toggle switches between light/dark modes

### Testing Authentication

Verify the authentication system works correctly:

```bash
# Test registration flow
1. Open app
2. Go to registration tab
3. Fill in test user data
4. Click "Create Account"
5. Verify automatic login to dashboard

# Test login flow
1. Logout from app
2. Go to login tab
3. Enter credentials
4. Verify login success
```

### Database Verification

Ensure the SQLite database is functioning:

```bash
# Check if database initializes
# Look for "Database ready" in console logs
# Test user registration creates database entries
```

### Performance Testing

Verify app performance:
- **Cold Start**: Close app completely, reopen, verify fast startup
- **Navigation**: Smooth transitions between screens
- **Memory Usage**: Monitor memory consumption during usage

**Section sources**
- [INSTRUCTIONS.txt](file://INSTRUCTIONS.txt#L20-L60)
- [AUTH_GUIDE.md](file://AUTH_GUIDE.md#L450-L505)

## Next Steps

### Development Workflow

Once your environment is set up, follow this progression:

1. **Explore the Codebase**: Understand the project structure
2. **Test Core Features**: Verify all basic functionality works
3. **Read Documentation**: Study BUILD_GUIDE.md for feature development
4. **Start Building**: Begin implementing missing features

### Recommended First Features

Based on the project status, prioritize these features:

1. **Welcome Screen**: Complete user registration and login
2. **Dashboard**: Build the main navigation hub
3. **Subject Menu**: Implement subject browsing
4. **Quiz System**: Add quiz functionality
5. **Profile Screen**: Complete user profile features

### Learning Resources

Utilize these resources for development:

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **Expo Router**: https://docs.expo.dev/router/introduction/
- **TypeScript**: https://www.typescriptlang.org/

### Contributing Guidelines

Follow these best practices:
- **Code Quality**: Maintain clean, well-documented code
- **Testing**: Test all features thoroughly
- **Documentation**: Update documentation for changes
- **Performance**: Optimize for offline-first operation

**Section sources**
- [BUILD_GUIDE.md](file://BUILD_GUIDE.md#L1-L50)
- [QUICKSTART.md](file://QUICKSTART.md#L389-L389)