import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Typography } from '../../constants/Typography';

export default function Questionnaire1() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setError('');

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        full_name: fullName,
        phone,
      });
      router.push('/(auth)/questionnaire-2');
    } catch (err) {
      setError('Failed to save information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tell Us About Yourself</Text>
        <Text style={styles.subtitle}>Step 1 of 3</Text>

        {error && <Text style={styles.errorMessage}>{error}</Text>}

        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
          editable={!loading}
        />

        <TextInput
          label="Phone Number"
          placeholder="(555) 000-0000"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <TextInput
          label="Bio (Optional)"
          placeholder="Tell us about yourself"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleNext}
            disabled={loading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },

  title: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.inverse,
    marginBottom: Spacing.xs,
  },

  subtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },

  errorMessage: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.error,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.error + '20',
    borderRadius: 8,
  },

  buttonContainer: {
    marginTop: Spacing.lg,
  },
});
