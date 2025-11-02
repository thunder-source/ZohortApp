# Quick Start Guide

## 🚀 Running the App

### Prerequisites Check
- ✅ Node.js installed (v16+)
- ✅ Android Studio installed
- ✅ Android SDK configured
- ✅ Java JDK 17 installed

### Step 1: Install Dependencies (if not already done)
```bash
npm install
```

### Step 2: Start Metro Bundler
Open a terminal and run:
```bash
npm start
```

### Step 3: Run on Android
Open a **new terminal** (keep Metro running) and run:
```bash
npm run android
```

**OR** use the React Native CLI:
```bash
npx react-native run-android
```

## 📱 Using the App

1. **Product List Screen**: Browse all products
   - Scroll through the list
   - Tap any product to view details

2. **Product Detail Screen**: View detailed information
   - See high-quality product image
   - Read full description
   - View ratings and reviews
   - Tap back button to return to list

## 🔧 Common Commands

### Clear Cache (if you encounter issues)
```bash
npm start -- --reset-cache
```

### Clean Android Build
```bash
cd android
gradlew clean
cd ..
npm run android
```

### Check for Issues
```bash
npm run lint
```

## 📁 Project Structure Overview

```
ZohortApp/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components (List & Detail)
│   ├── services/        # API services (axios)
│   ├── types/           # TypeScript types
│   ├── navigation/      # Navigation setup
│   └── utils/           # Utility functions
├── android/             # Android native code
├── App.tsx              # Main app entry point
└── package.json         # Dependencies
```

## 🌐 API Information

**Base URL**: https://fakestoreapi.com/products

The app automatically fetches and displays products from this free API.

## 💡 Tips

- Make sure an Android emulator is running before executing `npm run android`
- If the emulator is slow, try using a physical device with USB debugging
- Press `R` twice in the app to reload if you make code changes
- Press `Ctrl+M` (Windows) to open the developer menu

## ❓ Troubleshooting

### App not loading?
1. Ensure Metro bundler is running (`npm start`)
2. Check Android emulator is running
3. Try `npm start -- --reset-cache`

### Build errors?
1. Run `cd android && ./gradlew clean`
2. Delete `node_modules` and run `npm install`
3. Restart Metro bundler

### Network errors?
- Check your internet connection
- The app requires internet to fetch products from the API

## 🎯 Ready to Go!

Your React Native app is fully configured and ready to run. Enjoy exploring the product catalog!

