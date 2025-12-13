import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  User,
  X,
  Trophy,
  MessageCircle,
  ChartBar as BarChart3,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { DashboardSlider } from '../../../components/ui/DashboardSlider';
import { Header } from '../../../components/ui/Header';
import { NotificationBadge } from '../../../components/ui/NotificationBadge';
import { useNotifications } from '../../../hooks/useNotifications';
import { useAuth } from '../../../contexts/AuthContext';
import { Colors } from '../../../constants/Colors';
import { Typography } from '../../../constants/Typography';
import { Spacing } from '../../../constants/Spacing';

// Mock important dates data for managers
const mockImportantDates = [
  { id: '1', title: 'Submit jersey orders', daysLeft: 2, priority: 'high', teamName: 'Thunder Bolts', type: 'deadline' },
  { id: '2', title: 'Finalize Thunder Bolts Roster', daysLeft: 10, priority: 'medium', teamName: 'Thunder Bolts', type: 'roster' },
  { id: '3', title: 'Set lineups and positions for Home Runners', daysLeft: 3, priority: 'high', teamName: 'Home Runners', type: 'lineup' },
  { id: '4', title: 'Payment deadline for league fees', daysLeft: 7, priority: 'medium', teamName: 'Thunder Bolts', type: 'payment' },
  { id: '5', title: 'Schedule practice sessions', daysLeft: 5, priority: 'low', teamName: 'Home Runners', type: 'schedule' },
];

// Mock slider cards for managers
const mockManagerSliderCards = [
  {
    id: '1',
    type: 'recruitment' as const,
    title: 'Team Recruitment',
    subtitle: 'Find New Players',
    description: 'Your teams need players! Browse available free agents and send invitations.',
    imageUrl: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800',
    actionText: 'Browse Players',
    onPress: () => {},
    badge: { text: 'URGENT', variant: 'warning' as const },
  },
  {
    id: '2',
    type: 'tournament' as const,
    title: 'Manager Workshop',
    subtitle: 'Leadership Training',
    description: 'Join our monthly manager workshop to improve your team leadership skills.',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    actionText: 'Register Now',
    onPress: () => {},
    badge: { text: 'NEW', variant: 'success' as const },
  },
  {
    id: '3',
    type: 'announcement' as const,
    title: 'Season Updates',
    subtitle: 'Important Changes',
    description: 'Review the latest league rule changes and schedule updates for the upcoming season.',
    imageUrl: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800',
    actionText: 'View Updates',
    onPress: () => {},
    badge: { text: 'REQUIRED', variant: 'error' as const },
  },
];

export default function ManagerDashboard() {
  const { profile, signOut } = useAuth();
  const { notificationCounts } = useNotifications();
  const router = useRouter();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [dropdownAnimation] = useState(new Animated.Value(0));

  const getInitials = (name: string) => {
    const names = name.split(' ');
    const firstInitial = names[0]?.charAt(0) || '';
    const lastInitial = names[names.length - 1]?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  const toggleProfileDropdown = () => {
    const toValue = showProfileDropdown ? 0 : 1;
    setShowProfileDropdown(!showProfileDropdown);
    Animated.timing(dropdownAnimation, { toValue, duration: 200, useNativeDriver: true }).start();
  };

  const handleProfileMenuAction = (action: string) => {
    setShowProfileDropdown(false);
    switch (action) {
      case 'change-role':
        router.push('/(auth)/welcome'); break;
      case 'profile-settings':
        router.push('/(manager)/(tabs)/profile'); break;
      case 'sign-out':
        setShowSignOutModal(true); break;
    }
  };

  const handleConfirmSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      setShowSignOutModal(false);
      router.replace('/(auth)/welcome');
    } catch (error: any) {
      setShowSignOutModal(false);
      Alert.alert('Sign Out Error', error?.message || 'Failed to sign out. Please try again.', [{ text: 'OK' }]);
    } finally {
      setSigningOut(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) { case 'high': return Colors.error; case 'medium': return Colors.warning; case 'low': return Colors.success; default: return Colors.neutral[400]; }
  };

  const getTypeIcon = (type: string) => {
    switch (type) { case 'deadline': return '⏰'; case 'roster': return '👥'; case 'lineup': return '📋'; case 'payment': return '💳'; case 'schedule': return '📅'; default: return '📌'; }
  };

  const formatDaysLeft = (days: number) => (days === 0 ? 'Today' : days === 1 ? '1 day' : `${days} days`);

  // Quick Actions data (circular style)
  const managerQuickActions = [
    { id: 'rosters', title: 'Manage Rosters', icon: <Users color="#FFFFFF" size={18} strokeWidth={2} />, onPress: () => router.push('/(manager)/(tabs)/teams') },
    { 
      id: 'practice', 
      title: 'Schedule Practice', 
      icon: <Calendar color="#FFFFFF" size={18} strokeWidth={2} />, 
      onPress: () => Alert.alert('Coming Soon', 'Schedule practice feature coming soon!'),
      hasNotification: notificationCounts.calendar > 0,
      notificationCount: notificationCounts.calendar,
    },
    { id: 'message', title: 'Send Team Message', icon: <MessageCircle color="#FFFFFF" size={18} strokeWidth={2} />, onPress: () => Alert.alert('Coming Soon', 'Team messaging feature coming soon!') },
    { id: 'reports', title: 'View Reports', icon: <BarChart3 color="#FFFFFF" size={18} strokeWidth={2} />, onPress: () => Alert.alert('Coming Soon', 'Reports feature coming soon!') },
  ];

  // Inline Quick Actions Slider (circular buttons)
  const QuickActionsSliderInline = ({ actions }: { actions: { id: string; title: string; icon?: React.ReactNode; onPress?: () => void; hasNotification?: boolean; notificationCount?: number; }[] }) => (
    <FlatList
      horizontal
      data={actions}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.quickActionsContainer}
      renderItem={({ item }) => (
        <View style={styles.quickActionItem}>
          <TouchableOpacity onPress={item.onPress} activeOpacity={0.85} style={styles.quickActionCircle}>
            <View style={styles.quickActionIconWrap}>{item.icon}</View>
            {/* Notification Badge for Calendar and Payments */}
            {item.hasNotification && (
              <NotificationBadge
                count={item.notificationCount}
                show={true}
                size="sm"
              />
            )}
          </TouchableOpacity>
          <Text style={styles.quickActionText} numberOfLines={2}>{item.title}</Text>
        </View>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Manager Dashboard" subtitle={`Welcome back, ${profile?.full_name || 'Manager'}`} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <>
          <View style={styles.content}>
            {/* Dashboard Slider */}
            <DashboardSlider cards={mockManagerSliderCards} autoPlay={true} autoPlayInterval={5000} />

            {/* Quick Actions - circular slider */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.cardTitle}>Quick Actions</Text>
              <QuickActionsSliderInline actions={managerQuickActions} />
            </View>

            {/* Important Dates */}
            <View style={styles.importantDatesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.cardTitle}>Important Dates</Text>
                <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
              </View>
              <View style={styles.importantDatesContainer}>
                {mockImportantDates.slice(0, 4).map((item) => (
                  <View key={item.id} style={styles.importantDateItem}>
                    <View style={styles.dateItemLeft}>
                      <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
                      <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
                      <View style={styles.dateItemContent}>
                        <Text style={styles.dateItemTitle}>{item.title}</Text>
                        <Text style={styles.dateItemTeam}>{item.teamName}</Text>
                      </View>
                    </View>
                    <View style={styles.dateItemRight}>
                      <View
                        style={[
                          styles.daysLeftBadge,
                          { backgroundColor: item.daysLeft <= 3 ? Colors.error : item.daysLeft <= 7 ? Colors.warning : Colors.primary[800] },
                        ]}
                      >
                        <Text style={styles.daysLeftText}>{formatDaysLeft(item.daysLeft)}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Manager Stats Widgets */}
            <View style={styles.widgetsGrid}>
              <View style={styles.widgetRow}>
                <TouchableOpacity style={[styles.statWidget, { backgroundColor: Colors.widgets.blue }]}>
                  <View style={styles.statWidgetContent}>
                    <View style={styles.statWidgetHeader}>
                      <Text style={styles.statWidgetTitle}>Active Teams</Text>
                      <Users color="white" size={20} strokeWidth={2} />
                    </View>
                    <Text style={styles.statWidgetValue}>3</Text>
                    <Text style={styles.statWidgetSubtitle}>teams under management</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.statWidget, { backgroundColor: Colors.widgets.green }]}>
                  <View style={styles.statWidgetContent}>
                    <View style={styles.statWidgetHeader}>
                      <Text style={styles.statWidgetTitle}>Total Players</Text>
                      <User color="white" size={20} strokeWidth={2} />
                    </View>
                    <Text style={styles.statWidgetValue}>42</Text>
                    <Text style={styles.statWidgetSubtitle}>across all teams</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.widgetRow}>
                <TouchableOpacity style={[styles.statWidget, { backgroundColor: Colors.widgets.orange }]}>
                  <View style={styles.statWidgetContent}>
                    <View style={styles.statWidgetHeader}>
                      <Text style={styles.statWidgetTitle}>PineRiders Rankings</Text>
                      <Trophy color="white" size={20} strokeWidth={2} />
                    </View>
                    <Text style={styles.statWidgetValue}>45</Text>
                    <Text style={styles.statWidgetSubtitle}>Loyalty Rankings: 1274</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.statWidget, { backgroundColor: Colors.widgets.purple }]}>
                  <View style={styles.statWidgetContent}>
                    <View style={styles.statWidgetHeader}>
                      <Text style={styles.statWidgetTitle}>Win Rate</Text>
                      <Calendar color="white" size={20} strokeWidth={2} />
                    </View>
                    <Text style={styles.statWidgetValue}>73%</Text>
                    <Text style={styles.statWidgetSubtitle}>across all teams</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sign Out Confirmation Modal */}
          <Modal animationType="fade" transparent={true} visible={showSignOutModal} onRequestClose={() => setShowSignOutModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Confirm Sign Out</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setShowSignOutModal(false)} disabled={signingOut}>
                    <X color={Colors.text.secondary} size={20} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalMessage}>
                  Are you sure you want to sign out of your manager account? This will disconnect you from your team management features.
                </Text>

                <View style={styles.modalActions}>
                  <Button title="Cancel" onPress={() => setShowSignOutModal(false)} variant="outline" style={styles.modalCancelButton} disabled={signingOut} />
                  <Button title="Sign Out" onPress={handleConfirmSignOut} loading={signingOut} style={styles.modalSignOutButton} />
                </View>
              </View>
            </View>
          </Modal>

          {/* Backdrop for dropdown */}
          {showProfileDropdown && (
            <TouchableOpacity style={styles.dropdownBackdrop} onPress={() => setShowProfileDropdown(false)} activeOpacity={1} />
          )}
        </>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollView: { flex: 1, backgroundColor: '#000000' },
  content: { paddingHorizontal: Spacing.screen.horizontal, paddingVertical: Spacing.screen.vertical },

  // Quick Actions (circular)
  quickActionsSection: { marginBottom: Spacing.xl },
  quickActionsContainer: { paddingVertical: Spacing.md, paddingRight: Spacing.md },
  quickActionItem: { width: 88, alignItems: 'center', marginRight: Spacing.lg },
  quickActionCircle: {
    width: 64, height: 64, borderRadius: 999,
    backgroundColor: Colors.neutral[800], borderWidth: 1, borderColor: Colors.neutral[700],
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.neutral[900], shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  quickActionIconWrap: {},
  quickActionText: { marginTop: Spacing.xs, fontSize: Typography.fontSize.xs, fontFamily: Typography.fontFamily.medium, color: Colors.text.inverse, textAlign: 'center', maxWidth: 80 },

  // Important Dates
  importantDatesSection: { marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  cardTitle: { fontSize: Typography.fontSize.lg, fontFamily: Typography.fontFamily.semiBold, color: Colors.text.inverse },
  seeAllText: { fontSize: Typography.fontSize.sm, fontFamily: Typography.fontFamily.medium, color: Colors.primary[800] },
  importantDatesContainer: { backgroundColor: Colors.background.card, borderRadius: 16, padding: Spacing.md },
  importantDateItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border.light },
  dateItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.sm },
  typeIcon: { fontSize: Typography.fontSize.base, marginRight: Spacing.sm },
  dateItemContent: { flex: 1 },
  dateItemTitle: { fontSize: Typography.fontSize.sm, fontFamily: Typography.fontFamily.medium, color: Colors.text.primary, marginBottom: 2 },
  dateItemTeam: { fontSize: Typography.fontSize.xs, fontFamily: Typography.fontFamily.regular, color: Colors.text.secondary },
  dateItemRight: { alignItems: 'flex-end' },
  daysLeftBadge: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: 12 },
  daysLeftText: { fontSize: Typography.fontSize.xs, fontFamily: Typography.fontFamily.bold, color: Colors.text.inverse },

  // Widgets
  widgetsGrid: { marginBottom: Spacing.xl },
  widgetRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  statWidget: { flex: 1, borderRadius: 20, padding: Spacing.lg, height: 140, shadowColor: Colors.neutral[900], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  statWidgetContent: { flex: 1, justifyContent: 'flex-start' },
  statWidgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  statWidgetTitle: { fontSize: Typography.fontSize.xs, fontFamily: Typography.fontFamily.medium, color: '#FFFFFF' },
  statWidgetValue: { fontSize: Typography.fontSize['2xl'], fontFamily: Typography.fontFamily.bold, marginTop: Spacing.xs, marginBottom: Spacing.xs, lineHeight: Typography.fontSize['2xl'] * 1.1, color: '#FFFFFF' },
  statWidgetSubtitle: { fontSize: Typography.fontSize.xs, fontFamily: Typography.fontFamily.regular, marginTop: 'auto', color: '#FFFFFF' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.screen.horizontal },
  modalContent: { backgroundColor: Colors.background.primary, borderRadius: 20, padding: Spacing.lg, width: '100%', maxWidth: 400, shadowColor: Colors.neutral[900], shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { fontSize: Typography.fontSize.xl, fontFamily: Typography.fontFamily.bold, color: Colors.text.primary },
  closeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.neutral[100], justifyContent: 'center', alignItems: 'center' },
  modalMessage: { fontSize: Typography.fontSize.base, fontFamily: Typography.fontFamily.regular, color: Colors.text.secondary, marginBottom: Spacing.lg, lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base },
  modalActions: { flexDirection: 'row', gap: Spacing.md },
  modalCancelButton: { flex: 1 },
  modalSignOutButton: { flex: 1, backgroundColor: Colors.error, borderColor: Colors.error },
});
