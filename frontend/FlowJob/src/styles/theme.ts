// src/styles/theme.ts
import { MD3LightTheme as DefaultTheme, configureFonts, useTheme as usePaperTheme } from 'react-native-paper';
import { useFonts, Fredoka_400Regular, Fredoka_500Medium, Fredoka_700Bold } from '@expo-google-fonts/fredoka';

// Define base font configuration for MD3
// We want button labels to be fontSize: 16 and fontWeight: 'bold'
// Let's adjust 'labelLarge' to fit this, as 'label' variants are often used for buttons.
const fontConfig = {
  // Existing variants...
  bodySmall: { fontFamily: 'Fredoka_400Regular', fontWeight: '400' as const, fontSize: 12 },
  bodyMedium: { fontFamily: 'Fredoka_400Regular', fontWeight: '400' as const, fontSize: 14 },
  bodyLarge: { fontFamily: 'Fredoka_400Regular', fontWeight: '400' as const, fontSize: 16 }, // Adjusted for general large body text

  labelSmall: { fontFamily: 'Fredoka_500Medium', fontWeight: '500' as const, fontSize: 11 },
  labelMedium: { fontFamily: 'Fredoka_500Medium', fontWeight: '500' as const, fontSize: 12 },
  // Target this for Buttons: fontSize 16, Fredoka_700Bold
  labelLarge: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const, fontSize: 16 },

  titleSmall: { fontFamily: 'Fredoka_500Medium', fontWeight: '500' as const, fontSize: 14 },
  titleMedium: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const, fontSize: 16 },
  titleLarge: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const, fontSize: 22 }, // Example size

  headlineSmall: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const, fontSize: 24 },
  headlineMedium: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const, fontSize: 28 },
  headlineLarge: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const, fontSize: 32 },

  displaySmall: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const, fontSize: 36 },
  displayMedium: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const, fontSize: 45 },
  displayLarge: { fontFamily: 'Fredoka_700Bold', fontWeight: '700' as const, fontSize: 57 },
};

// Unified app theme
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#E2B007',      // Mustard
    secondary: '#333333',    // Dark grey
    background: '#FFFFFF',
    surface: '#F6F6F6',      // Use for Card backgrounds, TextInput "flat" mode background etc.
    text: '#222222',
    onPrimary: '#000000',    // Text/icons on primary background (e.g., contained button text)
    onSurface: '#444444',    // Text/icons on surface background
    onSurfaceVariant: '#555555', // For less prominent elements on surface, like icons or placeholders
    error: '#B00020',
    // customSuccess: '#4cd964', // Example if you need a specific success color
  },
  roundness: 10, // Defines border radius for many components like TextInput, Button, Card
  fonts: configureFonts({ config: fontConfig, isV3: true }),
  // Define a spacing scale based on your StyleSheet values
  spacing: {
    xs: 4,  // Extra small
    s: 8,   // Small (marginTop: 8, paddingVertical: 8 for button)
    m: 16,  // Medium (marginBottom: 16 for input, marginTop: 16 for button)
    l: 24,  // Large (padding: 24, marginBottom: 24, marginTop: 24)
    xl: 32, // Extra Large (marginBottom: 32, paddingVertical: 32)
  },
  // --- Default Component Props Overrides (Conceptual for React Native Paper) ---
  // While MD3 theme doesn't have a generic `components` key for deep style overrides like some libraries,
  // the configured `fonts`, `colors`, and `roundness` above will be picked up by Paper components.
  // For instance, a Paper.Button's label will use one of the font variants.
  // If you consistently use `<PaperButton labelStyle={theme.fonts.labelLarge}>` this achieves the goal.
  // To make `labelLarge` the *absolute default* for all buttons without any props,
  // React Native Paper expects Button labels to use `labelLarge` variant by default if MD3 is enabled.
  // The padding (`paddingVertical: 8` for button content) isn't directly settable as a global theme default
  // style in the same way. You'll apply this using `contentStyle={{ paddingVertical: theme.spacing.s }}`
  // on your Button components or create a custom wrapper button.
};

// Define a type for your theme (useful for useTheme hook)
export type AppTheme = typeof theme;

// Custom hook to use AppTheme type with useTheme, ensuring you get your custom theme properties
export const useAppTheme = () => usePaperTheme<AppTheme>();

// Font loader hook - This stays the same
export function useCustomFonts() {
  return useFonts({
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_700Bold,
  });
}