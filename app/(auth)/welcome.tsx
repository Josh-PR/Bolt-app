import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export default function Welcome() {
  const router = useRouter();
  const { bypassAuth, bypassRole, setBypassRole } = useAuth();

  const handleBypassLogin = (role: 'player' | 'manager' | 'director') => {
    setBypassRole(role);
    // Force a re-render by navigating to index which will redirect based on role
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/163452/baseball-player-pitcher-ball-163452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>TeamSync</Text>
              <Text style={styles.subtitle}>
                Join leagues, manage teams, and track everything all in one place
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Sign Up"
                onPress={() => router.push('/(auth)/role-selection')}
                size="lg"
                style={styles.primaryButton}
              />
              
              <Button
                title="Sign In"
                onPress={() => router.push('/(auth)/login')}
                variant="outline"
                size="lg"
                style={styles.secondaryButton}
              />
            </View>

            {/* Development Bypass Options */}
            {bypassAuth && (
              <View style={styles.bypassSection}>
                <Text style={styles.bypassTitle}>Quick Access (Development)</Text>
                <View style={styles.bypassButtons}>
                  <Button
                    title="Demo Player"
                    onPress={() => handleBypassLogin('player')}
                    variant="ghost"
                    size="sm"
                    style={styles.bypassButton}
                  />
                  <Button
                    title="Demo Manager"
                    onPress={() => handleBypassLogin('manager')}
                    variant="ghost"
                    size="sm"
                    style={styles.bypassButton}
                  />
                  <Button
                    title="Demo Director"
                    onPress={() => handleBypassLogin('director')}
                    variant="ghost"
                    size="sm"
                    style={styles.bypassButton}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    fontSize: Typography.fontSize['4xl'],
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  subtitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.regular,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xl,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  
  buttonContainer: {
    marginBottom: Spacing['4xl'],
  },
  
  primaryButton: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.primary[800],
    borderColor: Colors.primary[800],
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  secondaryButton: {
    marginBottom: Spacing.md,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  bypassSection: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },
  
  bypassTitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: '#FFFFFF',
    marginBottom: Spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  bypassButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  
  bypassButton: {
    minWidth: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
