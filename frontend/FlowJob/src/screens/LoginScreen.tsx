// src/screens/LoginScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Easing, ScrollView, StyleSheet, I18nManager } from 'react-native';
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
import { AuthStackParamList } from '../navigation/AuthNavigator';
// Remove this import: import { Home } from '../navigation/AppNavigator';
import { AppTheme, useAppTheme } from '../styles/theme';

// Placeholder Function
const ensureUserProfileExists = async () => {
  console.log("Placeholder: Ensuring user profile exists...");
  return Promise.resolve();
};

export default function LoginScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) {
  const theme = useAppTheme();
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
      Toast.show({ type: 'error', text1: 'שדות חסרים', text2: 'אנא הזן אימייל וסיסמה.' });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await ensureUserProfileExists();
      Toast.show({ type: 'success', text1: 'התחברת בהצלחה!', text2: 'ברוך שובך 👋' });
      // Remove this line: navigation.replace('Home');
      // The RootNavigator will automatically handle the transition based on auth state.
    } catch (error: any) {
      console.error("Login Error:", error.code, error.message);
      let message = 'אירעה שגיאה לא ידועה.';
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
          label="אימייל"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          theme={{ roundness: theme.roundness }}
        />
        <PaperTextInput
          label="סיסמה"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
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
        <PaperText variant='bodyMedium' style={[styles.footerTextBase, { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}>
          חדש פה?{' '}
          <PaperText
            onPress={() => !loading && navigation.navigate('RoleScreen')}
            style={styles.registerLink}
          >
            הרשמה
          </PaperText>
        </PaperText>
      </View>
    </Animated.ScrollView>
  );
}

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
    textAlign: 'center',
  },
  subHeaderText: {
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginTop: theme.spacing.s,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: theme.spacing.m,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
    minHeight: 40,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginRight: I18nManager.isRTL ? theme.spacing.s : 0,
    marginLeft: !I18nManager.isRTL ? theme.spacing.s : 0,
    color: theme.colors.onSurface,
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
  footerTextBase: {
    color: theme.colors.onSurface,
  },
  registerLink: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
  }
});