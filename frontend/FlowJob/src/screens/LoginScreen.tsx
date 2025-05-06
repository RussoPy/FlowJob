// src/screens/LoginScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Easing, ScrollView, StyleSheet } from 'react-native';
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
  Text as PaperText,
  Switch as PaperSwitch,
  ActivityIndicator as PaperActivityIndicator,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { auth } from '../api/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthStackParamList } from '../navigation/AuthNavigator'; // Adjust path if needed
import { AppTheme, useAppTheme } from '../styles/theme'; // Import useAppTheme

// Placeholder Function
const ensureUserProfileExists = async () => {
  console.log("Placeholder: Ensuring user profile exists...");
  return Promise.resolve();
};

// Define LoginScreenProps using NativeStackScreenProps if not already defined
type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const theme = useAppTheme(); // Use your custom typed theme hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.exp), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Please enter both email and password.' });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await ensureUserProfileExists();
      Toast.show({ type: 'success', text1: 'Login Successful!', text2: 'Welcome back 👋' });
      navigation.replace('Home'); // Adjust 'Home' as needed
    } catch (error: any) {
      console.error("Login Error:", error.code, error.message);
      let message = 'An unknown error occurred.';
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email': message = 'Please enter a valid email address.'; break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential': message = 'Invalid email or password.'; break;
          case 'auth/too-many-requests': message = 'Too many attempts. Please try again later or reset your password.'; break;
          case 'auth/user-disabled': message = 'This account has been disabled.'; break;
          default: message = `Login failed: ${error.message || 'Please try again.'}`;
        }
      }
      Toast.show({ type: 'error', text1: 'Login Failed', text2: message });
    } finally {
      setLoading(false);
    }
  };

  // Generate styles using the theme
  const styles = makeStyles(theme);

  return (
    <Animated.ScrollView
      style={[styles.animatedScroll, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <PaperText variant="headlineLarge" style={styles.headerText}>
          Welcome Back
        </PaperText>
        <PaperText variant="bodyMedium" style={styles.subHeaderText}>
          Let's continue your journey 🚀
        </PaperText>
      </View>

      <View style={styles.form}>
        <PaperTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          theme={{ roundness: theme.roundness }} // Paper components pick up roundness from theme
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
              color={theme.colors.onSurfaceVariant} // Using a more specific theme color
            />
          }
          theme={{ roundness: theme.roundness }}
        />

        <View style={styles.optionsRow}>
          <View style={styles.switchContainer}>
            <PaperSwitch
              value={rememberMe}
              onValueChange={setRememberMe}
              color={theme.colors.primary}
            />
            <PaperText variant='bodyMedium' style={styles.rememberMeText}>Remember Me</PaperText>
          </View>
          {loading && <PaperActivityIndicator animating={true} color={theme.colors.primary} size='small' />}
        </View>

        <PaperButton
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent} // For inner padding
          // labelStyle={styles.buttonLabel} // Should be handled by theme.fonts.labelLarge
        >
          Login
        </PaperButton>
      </View>

      <View style={styles.footer}>
        <PaperText variant='bodyMedium' style={{ color: theme.colors.onSurface }}>
          New here?{' '}
          <PaperText
            onPress={() => !loading && navigation.navigate('Register')}
            style={styles.registerLink}
          >
            Register
          </PaperText>
        </PaperText>
      </View>
    </Animated.ScrollView>
  );
}

// Function to generate styles based on the theme
const makeStyles = (theme: AppTheme) => StyleSheet.create({
  animatedScroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    padding: theme.spacing.l, // Use theme spacing
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing.xl, // Use theme spacing
    alignItems: 'center',
  },
  headerText: {
    color: theme.colors.primary, // Directly use theme color
    textAlign: 'center',
    // Font variant handles font family, size, weight from theme.fonts
  },
  subHeaderText: {
    color: theme.colors.onSurface, // Directly use theme color
    textAlign: 'center',
    marginTop: theme.spacing.s, // Use theme spacing
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: theme.spacing.m, // Use theme spacing
    // backgroundColor: 'transparent', // Default for outlined PaperTextInput
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m, // Use theme spacing
    minHeight: 40,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: theme.spacing.s, // Use theme spacing
    color: theme.colors.onSurface,
  },
  button: {
    marginTop: theme.spacing.s, // Use theme spacing
    // `backgroundColor` is handled by PaperButton mode="contained" using theme.colors.primary
    // `borderRadius` is handled by theme.roundness via PaperButton
  },
  buttonContent: {
    paddingVertical: theme.spacing.s, // Use theme spacing for inner padding
  },
  // buttonLabel: { // This should now be handled globally by theme.fonts.labelLarge for PaperButton
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
  footer: {
    marginTop: theme.spacing.l, // Use theme spacing
    alignItems: 'center',
  },
  registerLink: {
    color: theme.colors.secondary,
    fontWeight: 'bold', // Keep bold for emphasis if not covered by a specific theme font variant
    // If you want a specific font from your theme for this link, apply it here:
    // fontFamily: theme.fonts.labelMedium.fontFamily,
    // fontWeight: theme.fonts.labelMedium.fontWeight,
  }
});
