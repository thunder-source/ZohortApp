import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import type { RootStackParamList } from '../types/navigation.types';
import { ErrorBoundary } from '../components';
import { colors, typography } from '../theme/colors';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <ErrorBoundary>
      <Stack.Navigator
        initialRouteName="ProductList"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.buttonPrimary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: typography.bold,
          },
          headerBackTitle: '',
          // Smooth screen transitions
          ...Platform.select({
            ios: {
              ...TransitionPresets.SlideFromRightIOS,
            },
            android: {
              ...TransitionPresets.FadeFromBottomAndroid,
            },
            default: {
              ...TransitionPresets.DefaultTransition,
            },
          }),
          cardStyleInterpolator: ({ current }) => {
            return {
              cardStyle: {
                opacity: current.progress,
              },
            };
          },
        }}>
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{
            headerShown: false, // Custom header in ProductListScreen
          }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{
            title: 'Product Details',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </ErrorBoundary>
  );
};

export default AppNavigator;

