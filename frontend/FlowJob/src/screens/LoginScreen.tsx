// src/screens/LoginScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Easing, ScrollView, StyleSheet, Pressable } from 'react-native';
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
  Text as PaperText,
  Switch as PaperSwitch,
  ActivityIndicator as PaperActivityIndicator,
  useTheme // Import useTheme hook
} from 'react-native-paper';
import { Feather } from '@expo/vector-icons'; // Keep Feather if needed specifically, or use Paper's TextInput.Icon
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack'; // For navigation prop types

// --- Firebase ---
// Ensure this path is correct and firebase.ts exports initialized auth
import { auth } from '../api/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// --- Navigation Types ---
// Assuming you have this defined in your navigation setup
import { AuthStackParamList } from '../navigation/AuthNavigator'; // Adjust path if needed
type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

// --- Placeholder Function ---
// Replace this with your actual logic if needed (e.g., checking Firestore)
const ensureUserProfileExists = async () => {
  console.log("Placeholder: Ensuring user profile exists...");
  // Example: const user = auth.currentUser; if (user) { /* check/create firestore doc */ }
  return Promise.resolve();
};


export default function LoginScreen({ navigation }: LoginScreenProps) {
  const theme = useTheme(); // Get the theme object
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // Add logic if needed
  const [loading, setLoading] = useState(false);

  // --- Animations (kept from original) ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // --- Handlers ---
  const handleLogin = async () => {
    if (!email || !password) {
        Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Please enter both email and password.' });
        return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await ensureUserProfileExists(); // Call placeholder/real function
      // Toast is shown implicitly by RootNavigator's auth state change handling
      // You might remove explicit success toast here if RootNavigator handles it
      // Toast.show({ type: 'success', text1: 'Welcome back 👋' });
      // Navigation to App stack happens automatically via RootNavigator's state change
    } catch (error: any) {
      console.error("Login Error:", error); // Log detailed error
      // Provide user-friendly messages
      let message = 'An unknown error occurred.';
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password': // Combine these for security
          case 'auth/invalid-credential':
            message = 'Invalid email or password.';
            break;
          case 'auth/too-many-requests':
             message = 'Too many attempts. Please try again later.';
             break;
          default:
            message = 'Login failed. Please try again.';
        }
      }
      Toast.show({ type: 'error', text1: 'Login failed', text2: message });
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  return (
    <Animated.ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background, // Use theme color
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap outside inputs
    >
      {/* Header */}
      <View style={styles.header}>
        <PaperText variant="headlineLarge" style={{ color: theme.colors.primary, textAlign: 'center' }}>
          Welcome Back
        </PaperText>
        <PaperText variant="bodyMedium" style={{ color: theme.colors.onSurface, textAlign: 'center', marginTop: 8 }}>
          Let's continue your journey 🚀
        </PaperText>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <PaperTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined" // Or "flat"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          theme={{ roundness: theme.roundness }} // Apply theme roundness
        />
        <PaperTextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry={!showPassword}
          right={
            <PaperTextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
              color={theme.colors.onSurface} // Use theme color for icon
            />
          }
          theme={{ roundness: theme.roundness }}
        />

        {/* Remember Me & Loading */}
        <View style={styles.optionsRow}>
          <View style={styles.switchContainer}>
            <PaperSwitch
              value={rememberMe}
              onValueChange={setRememberMe}
              color={theme.colors.primary} // Use theme color
              // trackColor doesn't work reliably across Paper versions/platforms, color prop is preferred
            />
            <PaperText variant='bodyMedium' style={{ marginLeft: 8, color: theme.colors.onSurface }}>Remember Me</PaperText>
          </View>
          {loading && <PaperActivityIndicator animating={true} color={theme.colors.primary} size='small' />}
        </View>

        {/* Login Button */}
        <PaperButton
          mode="contained" // Or "outlined", "text"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          labelStyle={styles.buttonLabel} // Style for text inside button
          // buttonColor={theme.colors.primary} // Explicitly set button color if needed
          // textColor={theme.colors.onPrimary} // Explicitly set text color if needed
        >
          Login
        </PaperButton>
      </View>

      {/* Register Link */}
      <View style={styles.footer}>
        <PaperText variant='bodyMedium' style={{ color: theme.colors.onSurface }}>
          New here?{' '}
          <PaperText
            onPress={() => !loading && navigation.navigate('Register')} // Prevent navigation while loading
            style={{ color: theme.colors.secondary, fontWeight: 'bold' }} // Use theme secondary
          >
            Register
          </PaperText>
        </PaperText>
      </View>

    </Animated.ScrollView>
  );
}

// --- Styles ---
// Using StyleSheet for structure and spacing, theme for colors/fonts
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Needed for ScrollView content to fill screen potentially
    padding: 24, // Example spacing
    justifyContent: 'center', // Center content vertically
  },
  header: {
    marginBottom: 32, // Example spacing
    alignItems: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16, // Example spacing
    backgroundColor: 'transparent', // Use outlined input's background
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16, // Example spacing
    minHeight: 40, // Ensure row has height for ActivityIndicator alignment
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 8, // Example spacing
    paddingVertical: 8, // Add padding inside button
  },
  buttonLabel: {
    fontSize: 16, // Example size
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24, // Example spacing
    alignItems: 'center',
  }
});