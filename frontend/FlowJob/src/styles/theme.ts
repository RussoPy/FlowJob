// src/styles/theme.ts
import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';
import { useFonts, Fredoka_400Regular, Fredoka_500Medium, Fredoka_700Bold } from '@expo-google-fonts/fredoka';

// Define base font configuration for MD3
// We map your loaded fonts to Paper's variant keys
const fontConfig = {
  // Default for most text elements
  bodySmall: { fontFamily: 'Fredoka_400Regular', fontWeight: '400' as const },
  bodyMedium: { fontFamily: 'Fredoka_400Regular', fontWeight: '400' as const },
  bodyLarge: { fontFamily: 'Fredoka_400Regular', fontWeight: '400' as const },
  labelSmall: { fontFamily: 'Fredoka_500Medium', fontWeight: '500' as const },
  labelMedium: { fontFamily: 'Fredoka_500Medium', fontWeight: '500' as const },
  labelLarge: { fontFamily: 'Fredoka_500Medium', fontWeight: '500' as const },
  titleSmall: { fontFamily: 'Fredoka_500Medium', fontWeight: '500' as const },
  titleMedium: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const }, // Use Bold for medium titles
  titleLarge: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const }, // Use Bold for large titles
  headlineSmall: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const },
  headlineMedium: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const },
  headlineLarge: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const },
  displaySmall: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const },
  displayMedium: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const },
  displayLarge: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const },
};


// Unified app theme using the corrected fontConfig
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#E2B007',      // Mustard
    secondary: '#333333',    // Dark grey (Consider using Paper's roles like 'onSurfaceVariant' or defining custom ones)
    background: '#FFFFFF',
    surface: '#F6F6F6',      // Use for Card backgrounds, etc.
    text: '#222222',         // Primary text color (Paper might use onSurface, onBackground)
    onPrimary: '#000000',    // Text/icons on primary color
    onSurface: '#444444',    // Text/icons on surface color
    error: '#B00020',
    // You can add more custom colors if needed
    // customSuccess: '#4cd964',
  },
  roundness: 10,
  // Correctly pass the MD3 font configuration
  fonts: configureFonts({ config: fontConfig, isV3: true }),
};


// Font loader hook - This stays the same
export function useCustomFonts() {
  return useFonts({
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_700Bold,
  });
}

// Define a type for your theme (useful for useTheme hook)
export type AppTheme = typeof theme;