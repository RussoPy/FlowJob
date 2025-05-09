// src/screens/workerProfileSetup/FinishSetupScreen.tsx

import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text as PaperText, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'; // Import doc, updateDoc, and serverTimestamp
import { auth, db } from '../../api/firebase'; // Import auth and db

import { useAppTheme, AppTheme } from '../../styles/theme';
import { WorkerProfileStackParamList } from '../../navigation/WorkerProfileNavigator';

type FinishSetupScreenProps = NativeStackScreenProps<WorkerProfileStackParamList, 'FinishSetup'>;

export default function FinishSetupScreen({ navigation }: FinishSetupScreenProps) {
  const theme = useAppTheme();
  const [loading, setLoading] = React.useState(false);

  const handleFinishSetup = async () => {
    setLoading(true);
    try {
       // Simulate a small delay for effect
       await new Promise(resolve => setTimeout(resolve, 500));

       // Update the profileComplete flag in Firestore
       const user = auth.currentUser;
       if (user) {
         const userDocRef = doc(db, 'users', user.uid);
         await updateDoc(userDocRef, {
           profileComplete: true,
           last_updated_at: serverTimestamp(), // Update timestamp as well
         });
       }

       Toast.show({ type: 'success', text1: 'ההגדרה הושלמה! 🎉', text2: 'ברוך הבא ל-FlowJob 👋' });

       // **Remove the explicit navigation.replace('Login'); line.**
       // The AppNavigator (modified in Step 2) will automatically detect the Firestore update
       // (profileComplete: true) via its onSnapshot listener and re-render to the HomeScreen.

    } catch (error: any) {
      console.error("Error finishing setup:", error);
      Toast.show({ type: 'error', text1: 'שגיאה', text2: 'אירעה שגיאה בסיום ההגדרה.' });
    } finally {
      setLoading(false);
    }
  };

  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PaperText variant="headlineLarge" style={styles.headerText}>
          הגדרה הושלמה!
        </PaperText>
        <PaperText variant="bodyLarge" style={styles.subHeaderText}>
          אתה מוכן/ה להתחיל.
        </PaperText>
        <PaperButton
          mode="contained"
          onPress={handleFinishSetup}
          disabled={loading}
          loading={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {loading ? <ActivityIndicator animating={true} color={theme.colors.onPrimary} size="small" /> : 'סיים הגדרה'}
        </PaperButton>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  headerText: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  subHeaderText: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing.m,
    width: '80%',
    maxWidth: 300,
  },
  buttonContent: {
    paddingVertical: theme.spacing.s,
  },
});