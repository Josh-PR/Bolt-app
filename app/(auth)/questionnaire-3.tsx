import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Typography } from '../../constants/Typography';

export default function Questionnaire3() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setError('');
    setLoading(true);

    try {
      await updateProfile({
        questionnaire_completed: true,
        questionnaire_started_at: profile?.questionnaire_started_at || new Date().toISOString(),
      });

      if (profile?.role === 'player') {
        router.replace('/(tabs)/');
      } else if (profile?.role === 'manager') {
        router.replace('/(manager)/');
      } else if (profile?.role === 'director') {
        router.replace('/(tabs)/');
      }
    } catch (err) {
      setError('Failed to complete questionnaire. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>You're All Set!</Text>
        <Text style={styles.subtitle}>Step 3 of 3</Text>

        {error && <Text style={styles.errorMessage}>{error}</Text>}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile Summary</Text>

          <View style={styles.summaryItem}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{profile?.full_name || 'Not provided'}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{profile?.phone || 'Not provided'}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>{profile?.role || 'Not provided'}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile?.email || 'Not provided'}</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Your profile is ready! You can now start using the app and connect with other players and teams.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={handleComplete}
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

  card: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },

  summaryItem: {
    marginBottom: Spacing.md,
  },

  label: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },

  value: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.primary,
  },

  description: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },

  buttonContainer: {
    marginTop: Spacing.lg,
  },
});
