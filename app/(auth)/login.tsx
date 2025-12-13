import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, Modal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { User, Users, Crown, X } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loginCredentials, setLoginCredentials] = useState<{ email: string; password: string } | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      // Simulate checking user roles from database
      // In a real app, this would query the database for user's roles
      const mockUserRoles = getMockUserRoles(data.email);
      
      if (mockUserRoles.length === 1) {
        // User has only one role, sign them in directly
        await signIn(data.email, data.password);
        // Navigation will be handled by the auth state change
      } else if (mockUserRoles.length > 1) {
        // User has multiple roles, show role selection
        setUserRoles(mockUserRoles);
        setLoginCredentials(data);
        setShowRoleSelection(true);
      } else {
        // No roles found - invalid credentials
        Alert.alert('Sign In Failed', 'Invalid email or password');
      }
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Mock function to simulate checking user roles
  // In a real app, this would query your database
  const getMockUserRoles = (email: string): string[] => {
    const roleMap: { [key: string]: string[] } = {
      'player@demo.com': ['player'],
      'manager@demo.com': ['manager'],
      'director@demo.com': ['director'],
      'multi@demo.com': ['player', 'manager'], // User with multiple roles
      'admin@demo.com': ['player', 'manager', 'director'], // User with all roles
    };
    
    return roleMap[email.toLowerCase()] || [];
  };

  const handleRoleSelection = async (selectedRole: string) => {
    if (!loginCredentials) return;
    
    setLoading(true);
    try {
      // Sign in with the selected role
      await signIn(loginCredentials.email, loginCredentials.password, selectedRole);
      setShowRoleSelection(false);
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'An error occurred');
      setShowRoleSelection(false);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'player':
        return <User color={Colors.primary[800]} size={20} />;
      case 'manager':
        return <Users color={Colors.secondary[800]} size={20} />;
      case 'director':
        return <Crown color={Colors.accent[800]} size={20} />;
      default:
        return <User color={Colors.primary[800]} size={20} />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'player':
        return 'Access your teams, games, and player features';
      case 'manager':
        return 'Manage your teams, rosters, and communications';
      case 'director':
        return 'Oversee leagues, teams, and organizational features';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
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
                autoComplete="email"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                autoComplete="password"
              />
            )}
          />

          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitButton}
          />

          <Button
            title="ByPass Login"
            onPress={() => setShowRoleSelection(true)}
            variant="outline"
            style={styles.bypassLoginButton}
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Forgot Password?"
            onPress={() => router.push('/(auth)/forgot-password')}
            variant="ghost"
          />
          
          <Button
            title="Don't have an account? Sign Up"
            onPress={() => router.push('/(auth)/role-selection')}
            variant="ghost"
          />

          <Button
            title="Bypass"
            onPress={() => setShowRoleSelection(true)}
            variant="ghost"
            style={styles.bypassButton}
          />

        </View>

        {/* Role Selection Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showRoleSelection}
          onRequestClose={() => setShowRoleSelection(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choose Your Role</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowRoleSelection(false)}
                >
                  <X color={Colors.text.secondary} size={20} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.modalSubtitle}>
                You have access to multiple roles. Choose how you'd like to sign in:
              </Text>

              <View style={styles.rolesList}>
                {['player', 'manager', 'director'].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={styles.roleOption}
                    onPress={() => handleRoleSelection(role)}
                    disabled={loading}
                  >
                    <View style={styles.roleHeader}>
                      {getRoleIcon(role)}
                      <View style={styles.roleInfo}>
                        <Text style={styles.roleTitle}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Text>
                        <Text style={styles.roleDescription}>
                          {getRoleDescription(role)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                title="Bypass"
                onPress={() => {
                  setShowRoleSelection(false);
                  router.replace('/(tabs)');
                }}
                variant="ghost"
                style={styles.bypassModalButton}
              />

              {loading && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Signing in...</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
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
    color: '#FFFFFF',
    marginBottom: Spacing.md,
  },
  
  subtitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.regular,
    color: '#FFFFFF',
  },
  
  form: {
    marginBottom: Spacing['4xl'],
  },
  
  submitButton: {
    marginTop: Spacing.lg,
  },
  
  bypassLoginButton: {
    marginTop: Spacing.md, // 16px spacing from Sign In button
    borderColor: Colors.primary[800],
    borderWidth: 2,
  },
  
  footer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen.horizontal,
  },
  
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: 20,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 400,
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalSubtitle: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: '#FFFFFF',
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  
  rolesList: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  
  roleOption: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.secondary,
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  roleInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  
  roleTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  
  roleDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: '#FFFFFF',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  
  loadingText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: '#FFFFFF',
  },

  bypassModalButton: {
    marginTop: Spacing.md,
  },

  bypassButton: {
    marginTop: Spacing.lg,
  },
});