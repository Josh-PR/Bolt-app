import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Bell, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  style?: any;
  showWelcome?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightComponent,
  style,
  showWelcome = false,
}) => {
  const { profile } = useAuth();
  const router = useRouter();

  const getInitials = (name: string) => {
    const names = name.split(' ');
    const firstInitial = names[0]?.charAt(0) || '';
    const lastInitial = names[names.length - 1]?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  const handleNotificationPress = () => {
    // In a real app, this would open notifications
    console.log('Notifications pressed');
  };

  const handleProfilePress = () => {
    // Navigate to profile based on user role
    if (profile?.role === 'manager') {
      router.push('/(tabs)/profile' as any);
    } else {
      router.push('/(tabs)/profile');
    }
  };

  // Mock notification count - in real app this would come from context/state
  const unreadCount = 3;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {/* Left side - Welcome message or Title */}
        <View style={styles.leftSection}>
          {showWelcome ? (
            <Text style={styles.welcomeText}>
              Welcome {profile?.full_name || 'User'}
            </Text>
          ) : title ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          ) : null}
        </View>

        {/* Right side - Notification and Profile */}
        <View style={styles.rightSection}>
          {rightComponent || (
            <>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={handleNotificationPress}
                accessibilityLabel="Notifications"
                accessibilityHint="View your notifications"
              >
                <Bell color={Colors.text.inverse} size={20} strokeWidth={2} />
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileButton}
                onPress={handleProfilePress}
                accessibilityLabel="Profile"
                accessibilityHint="View your profile"
              >
                {profile?.avatar_url ? (
                  <Image source={{ uri: profile.avatar_url }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileCircle}>
                    <Text style={styles.profileInitials}>
                      {getInitials(profile?.full_name || 'User Name')}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    paddingHorizontal: Spacing.screen.horizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  
  leftSection: {
    flex: 1,
    justifyContent: 'center',
  },
  
  titleContainer: {
    flex: 1,
  },
  
  title: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.inverse,
  },
  
  subtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.inverse,
    opacity: 0.8,
    marginTop: 2,
  },

  welcomeText: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.inverse,
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[800],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  notificationBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.inverse,
  },
  
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[800],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  profileInitials: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.inverse,
  },
});