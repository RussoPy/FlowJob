// src/screens/workerProfile/WorkerStep1.tsx

import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text as PaperText, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { useAppTheme, AppTheme } from '../../styles/theme'; // [cite: uploaded:src/styles/theme.ts]
import { WorkerProfileStackParamList } from '../../navigation/WorkerProfileNavigator'; // Import the param list for type safety [cite: src/navigation/WorkerProfileNavigator.tsx]
// No need to import auth/db here if only navigating

type WorkerProfileStep1ScreenProps = NativeStackScreenProps<WorkerProfileStackParamList, 'WorkerProfileStep1'>;

export default function WorkerProfileStep1Screen({ navigation }: WorkerProfileStep1ScreenProps) {
  const theme = useAppTheme(); // [cite: uploaded:src/styles/theme.ts]
  const [loading, setLoading] = React.useState(false); // Keep loading state if step involves async work

  const handleCompleteStep = async () => {
    // In a real scenario, you would save data for Step 1 here
    // and then navigate to the next step or the final FinishSetup screen.
    setLoading(true);
    try {
        // Simulate saving data
        await new Promise(resolve => setTimeout(resolve, 500));
        // Navigate to the next step in the WorkerProfileNavigator
        // If Step1 is the only step for now, navigate to FinishSetup
        navigation.navigate('FinishSetup'); // Navigate to the FinishSetup screen
    } catch (error) {
        console.error("Error completing worker profile step 1:", error);
        Toast.show({ type: 'error', text1: 'שגיאה', text2: 'אירעה שגיאה בשמירת נתוני הפרופיל.' });
    } finally {
        setLoading(false);
    }
  };

  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PaperText variant="headlineLarge" style={styles.headerText}>
          Worker Profile Setup
        </PaperText>
        <PaperText variant="bodyLarge" style={styles.subHeaderText}>
          Step 1: Basic Information
        </PaperText>
        <PaperText variant="bodySmall" style={{color: theme.colors.onSurfaceVariant, textAlign: 'center', marginBottom: theme.spacing.m}}>
          (This is a placeholder screen. In a real app, you'd have actual form fields here.)
        </PaperText>
        <PaperButton
          mode="contained"
          onPress={handleCompleteStep}
          disabled={loading}
          loading={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {loading ? <ActivityIndicator animating={true} color={theme.colors.onPrimary} size="small" /> : 'השלם שלב 1 (עובד)'}
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