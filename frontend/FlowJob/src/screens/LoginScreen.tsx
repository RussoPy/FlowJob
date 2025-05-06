// src/screens/LoginScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Easing, ScrollView, StyleSheet, I18nManager } from 'react-native'; // Added I18nManager
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
// type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>; // Already provided by user

export default function LoginScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) {
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
      // Assuming Toast messages are already translated or will be handled by an i18n library
      Toast.show({ type: 'error', text1: 'שדות חסרים', text2: 'אנא הזן אימייל וסיסמה.' });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await ensureUserProfileExists();
      Toast.show({ type: 'success', text1: 'התחברת בהצלחה!', text2: 'ברוך שובך 👋' });
      navigation.replace('Home'); // Adjust 'Home' as needed
    } catch (error: any) {
      console.error("Login Error:", error.code, error.message);
      let message = 'אירעה שגיאה לא ידועה.'; // Default Hebrew error
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email': message = 'אנא הזן כתובת אימייל חוקית.'; break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential': message = 'אימייל או סיסמה שגויים.'; break;
          case 'auth/too-many-requests': message = 'ניסיונות רבים מדי. אנא נסה שוב מאוחר יותר או אפס סיסמה.'; break;
          case 'auth/user-disabled': message = 'חשבון זה נחסם.'; break;
          default: message = `ההתחברות נכשלה: ${error.message || 'אנא נסה שוב.'}`;
        }
      }
      Toast.show({ type: 'error', text1: 'ההתחברות נכשלה', text2: message });
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
          FlowJob
        </PaperText>
        <PaperText variant="bodyMedium" style={styles.subHeaderText}>
         ברוך הבא
        </PaperText>
      </View>

      <View style={styles.form}>
        <PaperTextInput
          label="אימייל" // Translated
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input} // Contains textAlign: 'right' for explicit RTL input
          keyboardType="email-address"
          autoCapitalize="none"
          theme={{ roundness: theme.roundness }}
        />
        <PaperTextInput
          label="סיסמה" // Translated
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input} // Contains textAlign: 'right'
          secureTextEntry={!showPassword}
          right={
            <PaperTextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
              color={theme.colors.onSurfaceVariant}
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
            <PaperText variant='bodyMedium' style={styles.rememberMeText}>
              זכור אותי
            </PaperText>
          </View>
          {loading && <PaperActivityIndicator animating={true} color={theme.colors.primary} size='small' />}
        </View>

        <PaperButton
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          כניסה
        </PaperButton>
      </View>

      <View style={styles.footer}>
        {/* Added writingDirection: 'rtl' for robust mixed content rendering */}
        <PaperText variant='bodyMedium' style={[styles.footerTextBase, { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}>
          חדש פה?{' '}
          <PaperText
            onPress={() => !loading && navigation.navigate('Register')}
            style={styles.registerLink}
          >
            הרשמה
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
    padding: theme.spacing.l,
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  headerText: {
    color: theme.colors.primary,
    textAlign: 'center', // Center alignment is fine for headers
    // Font variant handles font family, size, weight from theme.fonts
  },
  subHeaderText: {
    color: theme.colors.onSurface,
    textAlign: 'center', // Center alignment is fine
    marginTop: theme.spacing.s,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: theme.spacing.m,
    // Explicitly set textAlign for TextInput if global RTL doesn't suffice
    // or if PaperTextInput doesn't automatically align placeholder/text to right in RTL.
    // For Hebrew, text should naturally flow RTL.
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  optionsRow: {
    flexDirection: 'row', // Will be reversed in RTL
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
    minHeight: 40,
  },
  switchContainer: {
    flexDirection: 'row', // Switch appears first (right in RTL), then text
    alignItems: 'center',
  },
  rememberMeText: {
    // If visual order in RTL is [Text] [Switch], marginRight creates space.
    // If LTR was [Switch] [Text], and RTL reverses to [Text] [Switch],
    // then the text needs margin on its right to space it from the switch.
    marginRight: I18nManager.isRTL ? theme.spacing.s : 0,
    marginLeft: !I18nManager.isRTL ? theme.spacing.s : 0,
    color: theme.colors.onSurface,
    // writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', // Usually not needed if parent is already RTL
  },
  button: {
    marginTop: theme.spacing.s,
  },
  buttonContent: {
    paddingVertical: theme.spacing.s,
  },
  footer: {
    marginTop: theme.spacing.l,
    alignItems: 'center',
  },
  footerTextBase: { // Base style for footer text
    color: theme.colors.onSurface,
    // textAlign will be handled by writingDirection or system default for RTL
  },
  registerLink: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
  }
});
