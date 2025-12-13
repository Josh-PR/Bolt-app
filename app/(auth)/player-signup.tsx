import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

const playerSignupSchema = z.object({
  // Step 1: Basic Info
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  
  // Step 2: Personal Info
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  
  // Step 3: Player Info
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  preferredPosition: z.string().optional(),
  bio: z.string().optional(),
  
  // Step 4: Emergency Contact
  emergencyContact: z.string().min(2, 'Emergency contact name is required'),
  emergencyPhone: z.string().min(10, 'Emergency contact phone is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PlayerSignupForm = z.infer<typeof playerSignupSchema>;

export default function PlayerSignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<PlayerSignupForm>({
    resolver: zodResolver(playerSignupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
      experienceLevel: 'beginner',
      preferredPosition: '',
      bio: '',
      emergencyContact: '',
      emergencyPhone: '',
    },
  });

  const steps = [
    { title: 'Account Setup', fields: ['email', 'password', 'confirmPassword'] },
    { title: 'Personal Info', fields: ['fullName', 'phone'] },
    { title: 'Player Details', fields: ['experienceLevel', 'preferredPosition', 'bio'] },
    { title: 'Emergency Contact', fields: ['emergencyContact', 'emergencyPhone'] },
  ];

  const nextStep = async () => {
    const fieldsToValidate = steps[currentStep - 1].fields;
    const isValid = await trigger(fieldsToValidate as any);
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: PlayerSignupForm) => {
    console.log('Form submission started with data:', data);
    setLoading(true);
    try {
      await signUp(data.email, data.password, {
        full_name: data.fullName,
        phone: data.phone,
        role: 'player',
      });

      // Navigate to verification screen
      router.push('/(auth)/verify-email');
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert('Sign Up Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitError = (errors: any) => {
    console.log('Form validation errors:', errors);

    // Find which step has errors
    let firstErrorStep = 1;
    for (let i = 0; i < steps.length; i++) {
      const stepFields = steps[i].fields;
      const hasError = stepFields.some((field) => errors[field]);
      if (hasError) {
        firstErrorStep = i + 1;
        break;
      }
    }

    // Build error message
    const errorMessages = Object.keys(errors).map((key) => {
      return `${key}: ${errors[key]?.message || 'Invalid'}`;
    }).join('\n');

    Alert.alert(
      'Please Complete All Fields',
      `There are errors in your form:\n\n${errorMessages}\n\nPlease review Step ${firstErrorStep}.`,
      [
        {
          text: 'Go to Step',
          onPress: () => setCurrentStep(firstErrorStep),
        },
        {
          text: 'OK',
          style: 'cancel',
        },
      ]
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View key="step-1" nativeID="step-1-container" style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Account Setup</Text>
            <Text style={styles.stepDescription}>
              Create your account with email and password
            </Text>

            <Controller
              control={control}
              name="email"
              key="email-step-1"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="username"
                  importantForAutofill="yes"
                  nativeID="email-step-1"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              key="password-step-1"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                  autoCorrect={false}
                  autoComplete="password-new"
                  textContentType="newPassword"
                  importantForAutofill="yes"
                  nativeID="password-step-1"
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              key="confirmPassword-step-1"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  secureTextEntry
                  autoCorrect={false}
                  autoComplete="password-new"
                  textContentType="newPassword"
                  importantForAutofill="yes"
                  nativeID="confirmPassword-step-1"
                />
              )}
            />
          </View>
        );

      case 2:
        return (
          <View key="step-2" nativeID="step-2-container" style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Personal Information</Text>
            <Text style={styles.stepDescription}>
              Tell us about yourself
            </Text>

            <Controller
              control={control}
              name="fullName"
              key="fullName-step-2"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fullName?.message}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  nativeID="fullName-step-2"
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              key="phone-step-2"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  nativeID="phone-step-2"
                />
              )}
            />
          </View>
        );

      case 3:
        return (
          <View key="step-3" nativeID="step-3-container" style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Player Details</Text>
            <Text style={styles.stepDescription}>
              Help us understand your playing experience
            </Text>

            <Controller
              control={control}
              name="experienceLevel"
              key="experienceLevel-step-3"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Experience Level</Text>
                  <View style={styles.radioGroup}>
                    {[
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        title={option.label}
                        onPress={() => onChange(option.value)}
                        variant={value === option.value ? 'primary' : 'outline'}
                        style={styles.radioButton}
                      />
                    ))}
                  </View>
                </View>
              )}
            />

            <Controller
              control={control}
              name="preferredPosition"
              key="preferredPosition-step-3"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Preferred Position (Optional)"
                  placeholder="e.g., Pitcher, Catcher, Shortstop"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.preferredPosition?.message}
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  nativeID="preferredPosition-step-3"
                />
              )}
            />

            <Controller
              control={control}
              name="bio"
              key="bio-step-3"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Bio (Optional)"
                  placeholder="Tell us about your softball experience"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.bio?.message}
                  multiline
                  numberOfLines={4}
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  nativeID="bio-step-3"
                />
              )}
            />
          </View>
        );

      case 4:
        return (
          <View key="step-4" nativeID="step-4-container" style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Emergency Contact</Text>
            <Text style={styles.stepDescription}>
              Required for league participation
            </Text>

            <Controller
              control={control}
              name="emergencyContact"
              key="emergencyContact-step-4"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Emergency Contact Name"
                  placeholder="Enter emergency contact name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.emergencyContact?.message}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  nativeID="emergencyContact-step-4"
                />
              )}
            />

            <Controller
              control={control}
              name="emergencyPhone"
              key="emergencyPhone-step-4"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Emergency Contact Phone"
                  placeholder="Enter emergency contact phone"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.emergencyPhone?.message}
                  keyboardType="phone-pad"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  nativeID="emergencyPhone-step-4"
                />
              )}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Player Registration</Text>
            <Text style={styles.subtitle}>
              Step {currentStep} of {steps.length}
            </Text>
            <ProgressBar
              progress={(currentStep / steps.length) * 100}
              style={styles.progressBar}
            />
          </View>

          {renderStep()}

          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <Button
                title="Previous"
                onPress={prevStep}
                variant="outline"
                style={styles.secondaryButton}
              />
            )}
            
            {currentStep < steps.length ? (
              <Button
                title="Next"
                onPress={nextStep}
                style={styles.primaryButton}
              />
            ) : (
              <Button
                title="Create Account"
                onPress={handleSubmit(onSubmit, onSubmitError)}
                loading={loading}
                style={styles.primaryButton}
              />
            )}
          </View>

          <View style={styles.footer}>
            <Button
              title="Already have an account? Sign In"
              onPress={() => router.push('/(auth)/login')}
              variant="ghost"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  
  scrollView: {
    flex: 1,
  },
  
  content: {
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
    marginBottom: Spacing.md,
  },
  
  subtitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  
  progressBar: {
    width: '100%',
    height: 6,
  },
  
  stepContainer: {
    marginBottom: Spacing['4xl'],
  },
  
  stepTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  
  stepDescription: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  
  inputContainer: {
    marginBottom: Spacing.md,
  },
  
  label: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  
  radioGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  
  radioButton: {
    flex: 1,
    minWidth: 100,
  },
  
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing['4xl'],
  },
  
  primaryButton: {
    flex: 1,
  },
  
  secondaryButton: {
    flex: 1,
  },
  
  footer: {
    alignItems: 'center',
  },
});