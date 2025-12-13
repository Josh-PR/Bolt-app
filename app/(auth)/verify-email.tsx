import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export default function VerifyEmail() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Continue to Sign In"
            onPress={() => router.push('/(auth)/login')}
            style={styles.primaryButton}
          />
          
          <Button
            title="Back to Welcome"
            onPress={() => router.push('/(auth)/welcome')}
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screen.horizontal,
    paddingVertical: Spacing.screen.vertical,
    justifyContent: 'center',
  },
  
  header: {
    alignItems: 'center',
    marginBottom: Spacing['5xl'],
  },
  
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  
  subtitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.lg,
  },
  
  buttonContainer: {
    gap: Spacing.md,
  },
  
  primaryButton: {
    marginBottom: Spacing.md,
  },
  
  secondaryButton: {
    marginBottom: Spacing.md,
  },
});