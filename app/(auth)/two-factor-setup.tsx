import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export default function TwoFactorSetup() {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnableTotp = async () => {
    setLoading(true);
    // Simulate TOTP setup
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    // Simulate code verification
    setTimeout(() => {
      setLoading(false);
      if (code === '123456') {
        Alert.alert('Success', 'Two-factor authentication has been enabled!', [
          { text: 'OK', onPress: () => router.push('/(auth)/verify-email') },
        ]);
      } else {
        Alert.alert('Error', 'Invalid code. Please try again.');
      }
    }, 1000);
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Two-Factor Authentication?',
      'As a League Director, we highly recommend enabling two-factor authentication for enhanced security. Are you sure you want to skip this step?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => router.push('/(auth)/verify-email') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Two-Factor Authentication</Text>
          <Text style={styles.subtitle}>
            {step === 1 
              ? 'Enhance your account security with two-factor authentication'
              : 'Enter the verification code from your authenticator app'
            }
          </Text>
        </View>

        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.instructions}>
              <Text style={styles.instructionTitle}>Setup Instructions:</Text>
              <Text style={styles.instructionText}>
                1. Download an authenticator app (Google Authenticator, Authy, etc.)
              </Text>
              <Text style={styles.instructionText}>
                2. Click "Enable 2FA" to generate a QR code
              </Text>
              <Text style={styles.instructionText}>
                3. Scan the QR code with your authenticator app
              </Text>
              <Text style={styles.instructionText}>
                4. Enter the 6-digit code to verify
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Enable 2FA"
                onPress={handleEnableTotp}
                loading={loading}
                style={styles.primaryButton}
              />
              
              <Button
                title="Skip for Now"
                onPress={handleSkip}
                variant="ghost"
                style={styles.skipButton}
              />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodeText}>
                QR Code would be displayed here
              </Text>
              <Text style={styles.qrCodeNote}>
                Scan this QR code with your authenticator app
              </Text>
            </View>

            <TextInput
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
              maxLength={6}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Verify & Complete"
                onPress={handleVerifyCode}
                loading={loading}
                disabled={code.length !== 6}
                style={styles.primaryButton}
              />
              
              <Button
                title="Back"
                onPress={() => setStep(1)}
                variant="outline"
                style={styles.secondaryButton}
              />
            </View>
          </View>
        )}
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
  },
  
  header: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
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
  
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  instructions: {
    marginBottom: Spacing['4xl'],
  },
  
  instructionTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  
  instructionText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
    padding: Spacing.xl,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  
  qrCodeText: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  
  qrCodeNote: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
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
  
  skipButton: {
    marginTop: Spacing.md,
  },
});