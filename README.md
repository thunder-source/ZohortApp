# Zohort React Native Product App

A modern React Native application built with TypeScript that displays products from the FakeStore API with navigation between a product list and detail screens.

## Features

- ✅ React Native 0.82.1 (latest)
- ✅ TypeScript support
- ✅ React Navigation v6 with Stack Navigator
- ✅ Axios for API calls
- ✅ FakeStore API integration
- ✅ Modern, responsive UI design
- ✅ Proper folder structure
- ✅ Type-safe navigation
- ✅ Android support

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/          # Screen components
│   ├── ProductListScreen.tsx    # Home screen with product list
│   └── ProductDetailScreen.tsx  # Product detail view
├── services/         # API services
│   └── api.ts        # Axios API client and product service
├── types/            # TypeScript type definitions
│   ├── product.types.ts       # Product & Rating types
│   └── navigation.types.ts    # Navigation types
├── navigation/       # Navigation configuration
│   └── AppNavigator.tsx       # Stack navigator setup
└── utils/            # Utility functions
```

## API Integration

The app uses the FakeStore API: https://fakestoreapi.com/products

Product object structure:
```typescript
{
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  }
}
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Android Studio (for Android development)
- Android SDK
- Java Development Kit (JDK 17)

## Installation

1. Navigate to the project directory:
```bash
cd ZohortApp
```

2. Install dependencies:
```bash
npm install
```

3. For Android, ensure you have Android SDK installed and configured.

## Running the App

### Android

1. Start Metro Bundler:
```bash
npm start
```

2. In a new terminal, run the Android app:
```bash
npm run android
```

Or use React Native CLI:
```bash
npx react-native run-android
```

Make sure you have:
- An Android emulator running, OR
- An Android device connected via USB with USB debugging enabled

## Screens

### Product List Screen
- Displays all products in a scrollable list
- Shows product image, title, category, price, and rating
- Tap any product to view details
- Loading indicator while fetching data
- Error handling with retry option

### Product Detail Screen
- Shows full product image
- Displays complete product information
- Category badge
- Rating with review count
- Full description
- Add to Cart button (placeholder)
- Back navigation to product list

## Dependencies

### Core
- `react-native`: ^0.82.1
- `react`: 18.3.1

### Navigation
- `@react-navigation/native`: Latest
- `@react-navigation/stack`: Latest
- `react-native-gesture-handler`: Latest
- `react-native-screens`: Latest
- `react-native-safe-area-context`: Latest

### API & Utilities
- `axios`: Latest

### Development
- `typescript`: Latest
- `@types/react`: Latest
- `@types/react-native`: Latest
- `@types/react-navigation`: Latest

## TypeScript Configuration

The project uses strict TypeScript configuration with proper typing for:
- Component props
- Navigation parameters
- API responses
- State management

## Troubleshooting

### Metro Bundler Issues
If you encounter bundler issues:
```bash
npm start -- --reset-cache
```

### Android Build Issues
Clean the build:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Clear Cache
```bash
npm start -- --reset-cache
```

## Future Enhancements

- Add cart functionality
- Implement product search
- Add product filtering by category
- Add pull-to-refresh
- Implement offline support
- Add product favorites
- Implement user authentication
- Add unit and integration tests

## License

This project is created for the Zohort technical assessment.

## Author

Developed for Zohort - React Native Technical Task
