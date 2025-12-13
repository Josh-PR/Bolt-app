import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export default function RoleSelection() {
  const router = useRouter();

  const roles = [
    {
      id: 'player',
      title: 'Player',
      description: 'Join leagues, find teams, and manage your softball journey',
      features: [
        'Easily find leagues and teams',
        'Register as a free agent',
        'Team dashboards with:', 
        '- Game schedules',
        '- Track payments & jersey orders',
        
      ],
      route: '/(auth)/player-signup',
    },
    {
      id: 'manager',
      title: 'Team Manager',
      description: 'Create and manage teams, handle registrations and payments',
      features: [
        'Register teams in leagues',
        'Manage player rosters',
        'Track team payments',
        'Send communications to players',
      ],
      route: '/(auth)/manager-signup',
    },
    {
      id: 'director',
      title: 'Director',
      description: 'Oversee leagues, manage teams, and handle league operations',
      features: [
        'Create and manage leagues',
        'Oversee team registrations',
        'Handle league-wide communications',
        'Manage league finances',
      ],
      route: '/(auth)/director-signup',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Your Role</Text>
            <Text style={styles.subtitle}>
              Select how you'd like to use Softball League Manager
            </Text>
          </View>

          <View style={styles.rolesList}>
            {roles.map((role) => (
              <Card key={role.id} style={styles.roleCard}>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
                
                <View style={styles.featuresList}>
                  {role.features.map((feature, index) => (
                    <Text key={index} style={styles.feature}>
                      • {feature}
                    </Text>
                  ))}
                </View>
                
                <Button
                  title={role.id === 'director' ? 'Coming Soon' : `Sign Up as ${role.title}`}
                  onPress={() => router.push(role.route)}
                  style={styles.roleButton}
                  disabled={role.id === 'director'}
                  textStyle={role.id === 'director' ? styles.comingSoonText : undefined}
                />
              </Card>
            ))}
          </View>

          <View style={styles.footer}>
            <Button
              title="Already have an account?{'\n'}Sign In"
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
    color: '#FFFFFF',
    marginBottom: Spacing.md,
  },
  
  subtitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.regular,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.lg,
  },
  
  rolesList: {
    gap: Spacing.lg,
    marginBottom: Spacing['4xl'],
  },
  
  roleCard: {
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  
  roleTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  
  roleDescription: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: '#FFFFFF',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.md,
  },
  
  featuresList: {
    marginBottom: Spacing.lg,
  },
  
  feature: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  
  roleButton: {
    marginTop: Spacing.md,
  },
  
  footer: {
    alignItems: 'center',
  },
  
  comingSoonText: {
    color: '#000000',
  },
});