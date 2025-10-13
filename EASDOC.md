# EAS (Expo Application Services) Documentation

## Overview
Complete documentation for building, deploying, and managing the STEM Learning App using Expo Application Services (EAS).

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [EAS Configuration](#eas-configuration)
4. [Build Profiles](#build-profiles)
5. [Building the App](#building-the-app)
6. [Submission to App Stores](#submission-to-app-stores)
7. [Updates (OTA)](#updates-ota)
8. [Environment Variables](#environment-variables)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Prerequisites

### Required Software
- **Node.js**: v18 or higher
- **npm** or **yarn**: Latest version
- **Expo CLI**: Latest version
- **EAS CLI**: v16.20.4 or higher
- **Git**: For version control

### Account Requirements
- **Expo Account**: [expo.dev](https://expo.dev)
- **Apple Developer Account**: For iOS builds ($99/year)
- **Google Play Console Account**: For Android builds ($25 one-time)

### Install EAS CLI
```bash
npm install -g eas-cli
```

### Login to Expo
```bash
eas login
```

---

## Initial Setup

### 1. Configure Project ID
The project is already configured with EAS:

**Project ID**: `9e177354-8042-4fcf-8d06-449684969dd3`

Located in `app.json`:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "9e177354-8042-4fcf-8d06-449684969dd3"
      }
    }
  }
}
```

### 2. Link Project (if needed)
```bash
eas init
```

### 3. Configure Credentials
```bash
# For iOS
eas credentials

# For Android
eas credentials -p android
```

---

## EAS Configuration

### Current `eas.json` Configuration

```json
{
  "cli": {
    "version": ">= 16.20.4",
    "appVersionSource": "remote"
  },
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
  },
  "submit": {
    "production": {}
  }
}
```

### Configuration Breakdown

#### CLI Settings
- **version**: Requires EAS CLI >= 16.20.4
- **appVersionSource**: Uses remote version tracking

#### Build Profiles
1. **development**: Development builds with expo-dev-client
2. **preview**: Internal testing builds
3. **production**: Production builds for app stores

---

## Build Profiles

### 1. Development Profile
**Purpose**: Local development and debugging

**Features**:
- Development client enabled
- Internal distribution
- Faster build times
- Debug symbols included

**Use Case**:
- Testing new features
- Debugging issues
- Local development

### 2. Preview Profile
**Purpose**: Internal testing and QA

**Features**:
- Internal distribution
- Optimized build
- Testing environment

**Use Case**:
- Team testing
- QA validation
- Beta testing
- Stakeholder reviews

### 3. Production Profile
**Purpose**: App store releases

**Features**:
- Auto-increment version
- Fully optimized
- Production signing
- Store-ready builds

**Use Case**:
- App Store submission
- Google Play submission
- Public releases

---

## Building the App

### iOS Builds

#### Development Build
```bash
eas build --platform ios --profile development
```

#### Preview Build
```bash
eas build --platform ios --profile preview
```

#### Production Build
```bash
eas build --platform ios --profile production
```

### Android Builds

#### Development Build
```bash
eas build --platform android --profile development
```

#### Preview Build
```bash
eas build --platform android --profile preview
```

#### Production Build
```bash
eas build --platform android --profile production
```

### Build Both Platforms
```bash
# Development
eas build --profile development

# Preview
eas build --profile preview

# Production
eas build --profile production
```

### Build Status
Check build status:
```bash
eas build:list
```

View specific build:
```bash
eas build:view [BUILD_ID]
```

---

## Submission to App Stores

### iOS - App Store

#### Prerequisites
1. **Apple Developer Account** ($99/year)
2. **App Store Connect** setup
3. **App ID** created in Developer Portal
4. **Certificates and Provisioning Profiles** configured

#### Submit to TestFlight
```bash
eas submit --platform ios --profile production
```

#### Manual Submission Steps
1. Build production iOS app
2. Download `.ipa` file
3. Use Transporter app to upload
4. Submit for review in App Store Connect

#### App Store Connect Setup
```
1. Create App in App Store Connect
2. Fill in app information:
   - Name: STEM Learning App
   - Bundle ID: com.stemlearning.app
   - SKU: unique identifier
   - Primary Language: English
3. Add screenshots and descriptions
4. Set pricing and availability
5. Submit for review
```

### Android - Google Play

#### Prerequisites
1. **Google Play Console Account** ($25 one-time)
2. **App created** in Play Console
3. **Signing keys** configured

#### Submit to Google Play
```bash
eas submit --platform android --profile production
```

#### Manual Submission Steps
1. Build production Android app
2. Download `.aab` file
3. Upload to Play Console
4. Complete store listing
5. Submit for review

#### Play Console Setup
```
1. Create App in Play Console
2. Fill in app details:
   - App name: STEM Learning App
   - Package: com.stemlearning.app
   - Language: English
3. Add screenshots (phone, tablet, TV if needed)
4. Write description and promotional text
5. Set pricing and distribution
6. Submit for review
```

---

## Updates (OTA)

### Expo Updates Setup

EAS Updates allows publishing JavaScript/asset changes without rebuilding.

#### Configure Updates
```bash
eas update:configure
```

#### Publish Update
```bash
# Publish to production
eas update --branch production --message "Bug fixes and improvements"

# Publish to preview
eas update --branch preview --message "Testing new features"
```

#### View Updates
```bash
eas update:list
```

#### Update Channels
```
- production: Live users
- preview: Beta testers
- development: Development team
```

### Automated Updates
Add to `app.json`:
```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    }
  }
}
```

---

## Environment Variables

### Using EAS Secrets

#### Add Secret
```bash
eas secret:create --scope project --name SECRET_NAME --value secret_value
```

#### List Secrets
```bash
eas secret:list
```

#### Delete Secret
```bash
eas secret:delete --name SECRET_NAME
```

### Environment-Specific Variables

#### Create `.env` files
```bash
# .env.development
API_URL=https://dev-api.stemlearning.app
ENABLE_ANALYTICS=false

# .env.preview  
API_URL=https://staging-api.stemlearning.app
ENABLE_ANALYTICS=true

# .env.production
API_URL=https://api.stemlearning.app
ENABLE_ANALYTICS=true
```

#### Configure in `eas.json`
```json
{
  "build": {
    "development": {
      "env": {
        "APP_ENV": "development"
      }
    },
    "preview": {
      "env": {
        "APP_ENV": "preview"
      }
    },
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
```

---

## App Configuration

### Current App Settings

#### From `app.json`:

```json
{
  "name": "STEM Learning App",
  "slug": "stem-learning-app",
  "version": "1.0.0",
  "orientation": "portrait",
  "scheme": "stemlearning",
  "bundleIdentifier": "com.stemlearning.app",
  "package": "com.stemlearning.app"
}
```

### Version Management

#### Semantic Versioning
```
MAJOR.MINOR.PATCH
1.0.0 -> 1.0.1 -> 1.1.0 -> 2.0.0
```

#### Auto-Increment (Production)
Production builds automatically increment version:
```json
{
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
```

#### Manual Version Update
Edit `app.json`:
```json
{
  "version": "1.1.0"
}
```

For iOS (versionCode):
```json
{
  "ios": {
    "buildNumber": "2"
  }
}
```

For Android (versionCode):
```json
{
  "android": {
    "versionCode": 2
  }
}
```

---

## Build Optimization

### Performance Settings

#### Enable Hermes (Android)
```json
{
  "android": {
    "jsEngine": "hermes"
  }
}
```

#### Bundle Size Optimization
```json
{
  "assetBundlePatterns": [
    "assets/images/**",
    "assets/fonts/**"
  ]
}
```

### Build Cache
EAS automatically caches dependencies for faster builds.

Clear cache if needed:
```bash
eas build --clear-cache
```

---

## Troubleshooting

### Common Issues

#### 1. Build Fails - Missing Credentials
**Problem**: iOS or Android credentials not configured

**Solution**:
```bash
# Configure credentials interactively
eas credentials

# Or reset and reconfigure
eas credentials --clear-provisioning-profile
```

#### 2. Version Conflict
**Problem**: Version number already exists in store

**Solution**:
- Update version in `app.json`
- Or use auto-increment for production builds

#### 3. Build Timeout
**Problem**: Build takes too long and times out

**Solution**:
- Check for large assets
- Optimize dependencies
- Use `--clear-cache` flag

#### 4. Submission Failed
**Problem**: App rejected during submission

**Solution**:
- Check submission logs: `eas submit:list`
- Review App Store Connect / Play Console feedback
- Fix issues and resubmit

### Debug Commands

```bash
# View build logs
eas build:view [BUILD_ID]

# Check project configuration
eas config

# Validate eas.json
eas build --platform [ios|android] --profile [PROFILE] --dry-run

# Check account status
eas whoami
```

---

## Best Practices

### 1. Version Control
- Always commit `eas.json` and `app.json`
- Tag releases in Git: `git tag v1.0.0`
- Keep `.env` files out of version control

### 2. Build Workflow
```
Development → Preview → Production
    ↓          ↓          ↓
  Local      Internal   Stores
```

### 3. Testing Strategy
- **Development**: Local testing, debugging
- **Preview**: Internal QA, stakeholder review
- **Production**: Public release after thorough testing

### 4. Credentials Management
- Use EAS credential management
- Don't commit certificates or keys
- Rotate credentials periodically

### 5. Release Checklist
```
□ Update version number
□ Test on development build
□ Create preview build for QA
□ Get stakeholder approval
□ Build production version
□ Test production build
□ Prepare store assets (screenshots, descriptions)
□ Submit to stores
□ Monitor for crashes/issues
□ Publish OTA update if needed
```

### 6. Update Strategy
- **Critical bugs**: Immediate OTA update
- **Minor changes**: Weekly/biweekly OTA
- **Major features**: Full app store release

---

## Continuous Integration (CI/CD)

### GitHub Actions Example

Create `.github/workflows/eas-build.yml`:

```yaml
name: EAS Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Install dependencies
        run: npm ci
        
      - name: EAS Build
        run: eas build --platform all --profile preview --non-interactive
```

### Required Secrets
Add to GitHub repository secrets:
- `EXPO_TOKEN`: Generate at expo.dev/settings/access-tokens

---

## Monitoring and Analytics

### EAS Build Dashboard
- View at: https://expo.dev/accounts/[USERNAME]/projects/stem-learning-app
- Monitor build status
- Download builds
- View submission history

### App Store Analytics
- **iOS**: App Store Connect Analytics
- **Android**: Google Play Console Statistics

### Crash Reporting
Integrate Sentry or similar:
```bash
npm install @sentry/react-native
```

Configure in `app.json`:
```json
{
  "plugins": [
    [
      "@sentry/react-native/expo",
      {
        "organization": "your-org",
        "project": "stem-learning-app"
      }
    ]
  ]
}
```

---

## Cost Considerations

### EAS Pricing
- **Free Tier**: Limited builds per month
- **Production Tier**: Unlimited builds, priority queue
- **Enterprise**: Custom pricing

Current costs (as of 2024):
- Free: 30 builds/month
- Production: $99/month unlimited builds

### App Store Costs
- **iOS**: $99/year Apple Developer Program
- **Android**: $25 one-time Google Play registration

---

## Quick Reference Commands

### Essential Commands
```bash
# Login
eas login

# Build for iOS (production)
eas build --platform ios --profile production

# Build for Android (production)
eas build --platform android --profile production

# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android

# Publish update (OTA)
eas update --branch production --message "Update message"

# Check build status
eas build:list

# View credentials
eas credentials
```

### Project Information
```
App Name: STEM Learning App
Slug: stem-learning-app
Bundle ID (iOS): com.stemlearning.app
Package (Android): com.stemlearning.app
Version: 1.0.0
Project ID: 9e177354-8042-4fcf-8d06-449684969dd3
```

---

## Resources

### Official Documentation
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Expo Configuration](https://docs.expo.dev/workflow/configuration/)

### Community
- [Expo Forums](https://forums.expo.dev/)
- [Expo Discord](https://chat.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

### Store Guidelines
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

---

## Support

### Getting Help
1. Check [EAS Documentation](https://docs.expo.dev/eas/)
2. Search [Expo Forums](https://forums.expo.dev/)
3. Contact Expo Support (for paid plans)

### Reporting Issues
- GitHub Issues: For app-specific problems
- Expo Forums: For EAS-related questions
- Support Email: For account/billing issues

---

## Changelog

### Version 1.0.0 (Initial Release)
- Complete authentication system
- Leaderboard feature
- Learning modules
- User profiles
- XP and leveling system
- Database integration
- Theme support (light/dark)

---

## Next Steps

1. **Set up credentials** for iOS and Android
2. **Create development build** for testing
3. **Build preview version** for internal QA
4. **Prepare store assets** (screenshots, descriptions)
5. **Build production version** when ready
6. **Submit to App Store** and Google Play
7. **Monitor performance** and user feedback
8. **Plan updates** based on feedback

---

## Conclusion

This documentation provides comprehensive guidance for building, deploying, and managing the STEM Learning App using EAS. Follow the workflows and best practices outlined here for a smooth deployment process.

For the latest updates and changes to EAS, always refer to the [official Expo documentation](https://docs.expo.dev/).
