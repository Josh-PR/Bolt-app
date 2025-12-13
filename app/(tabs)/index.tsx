import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Modal, Alert, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Trophy, Users, Calendar, DollarSign, Target, Award, TrendingUp, Clock, CreditCard, Gem, ShoppingBasket, Bell, Check, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DashboardSlider } from '../../components/ui/DashboardSlider';
import { PinnedItems, PinnedItem, AVAILABLE_ITEMS } from '../../components/ui/PinnedItems';
import { PinnedItemsModal } from '../../components/ui/PinnedItemsModal';
import { RSVPModal } from '../../components/ui/RSVPModal';
import { PaymentModal } from '../../components/ui/PaymentModal';
import { Header } from '../../components/ui/Header';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

// Mock data for demonstration
const mockStats = {
  daysUntilNextEvent: 8,
  nextEventType: 'tournament',
  paymentsOverdue: 2,
  daysUntilNextPayment: 12,
  gamesWon: 15,
  totalGames: 24,
};

// Mock calendar events for the next 5 days
const getNext5Days = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  
  return days;
};

const mockCalendarEvents = {
  '2024-01-15': [
    {
      id: '1',
      type: 'game',
      title: 'Thunder Bolts vs Lightning Strikes',
      time: '7:00 PM',
      location: 'Central Park Field A',
      teamName: 'Thunder Bolts',
    },
  ],
  '2024-01-16': [
    {
      id: '2',
      type: 'practice',
      title: 'Thunder Bolts Practice',
      time: '6:00 PM',
      location: 'Central Park Field B',
      teamName: 'Thunder Bolts',
    },
  ],
  '2024-01-18': [
    {
      id: '3',
      type: 'game',
      title: 'Home Runners vs Base Crushers',
      time: '6:30 PM',
      location: 'Riverside Complex Field 2',
      teamName: 'Home Runners',
    },
  ],
  '2024-01-19': [
    {
      id: '4',
      type: 'tournament',
      title: 'Spring Championship',
      time: '9:00 AM',
      location: 'Downtown Sports Complex',
      teamName: 'Thunder Bolts',
    },
  ],
};

const mockRecentActivity = [
  {
    id: '1',
    type: 'rsvp',
    message: 'RSVP to game vs Lightning Strikes',
    date: 'Due Jan 13',
    priority: 'high',
    action: 'RSVP',
    gameEvent: {
      id: 'game-1',
      title: 'Thunder Bolts vs Lightning Strikes',
      date: '2024-01-15',
      time: '19:00',
      timezone: 'EST',
      venue: 'Central Park Baseball Complex',
      address: '1234 Central Park West, New York, NY 10025',
      opponent: 'Lightning Strikes',
      teamName: 'Thunder Bolts',
    },
  },
  {
    id: '2',
    type: 'payment',
    message: 'Pay Player Fee for Thunder Bolts',
    date: 'Due Jan 15',
    priority: 'high',
    action: 'Pay $75',
  },
  {
    id: '3',
    type: 'purchase',
    message: 'Purchase Jersey for Home Runners',
    date: 'Due Jan 20',
    priority: 'medium',
    action: 'Order',
  },
  {
    id: '4',
    type: 'vote',
    message: 'Vote on new league schedule proposal',
    date: 'Due Jan 18',
    priority: 'low',
    action: 'Vote',
  },
];

// Mock slider cards data
const mockSliderCards = [
  {
    id: '1',
    type: 'tournament' as const,
    title: 'Swing for Holiday Smiles',
    subtitle: 'Registration Open',
    description: 'Help spread holiday cheer for kids and raise funds for toys.',
    imageUrl: 'https://static.wixstatic.com/media/ffbc07_60bb83c039b54cda93c7cba80331670b~mv2.jpg/v1/fill/w_1146,h_982,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_auto/ffbc07_60bb83c039b54cda93c7cba80331670b~mv2.jpg',
    actionText: 'Sign Up Now',
    onPress: () => {},
    badge: {
      text: 'NEW',
      variant: 'success' as const,
    },
  },
  {
    id: '2',
    type: 'recruitment' as const,
    title: 'Thunder Bolts',
    subtitle: 'Looking for Players',
    description: 'Competitive team seeking skilled outfielders and pitchers.',
    imageUrl: 'https://sm.ign.com/t/ign_nordic/review/t/thunderbol/thunderbolts-review_gyse.1280.jpg',
    actionText: 'Join Team',
    onPress: () => {},
    badge: {
      text: 'URGENT',
      variant: 'warning' as const,
    },
  },
  {
    id: '3',
    type: 'championship' as const,
    title: 'Base Crushers Win!',
    subtitle: 'League Champions',
    description: 'Congratulations to Base Crushers for winning the Summer League!',
    imageUrl: 'https://ungathletics.com/images/2023/6/1/DSC07484.jpg',
    actionText: 'View Stats',
    onPress: () => {},
    badge: {
      text: '1ST PLACE',
      variant: 'success' as const,
    },
  },
  {
    id: '4',
    type: 'promotion' as const,
    title: 'Free Agent Special',
    subtitle: 'Limited Time Offer',
    description: 'Join any team this month and get 20% off registration fees!',
    imageUrl: 'https://i.pinimg.com/736x/0d/c2/f4/0dc2f4e863132c2c23c16a51187f68b4--team-names-free-agent.jpg',
    actionText: 'Learn More',
    onPress: () => {},
    badge: {
      text: '20% OFF',
      variant: 'secondary' as const,
    },
  },
];

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    title: 'Game Reminder',
    message: 'Thunder Bolts vs Lightning Strikes tomorrow at 7:00 PM',
    timestamp: '2024-01-14T10:30:00Z',
    read: false,
    type: 'game',
  },
  {
    id: '2',
    title: 'Payment Due',
    message: 'Your payment of $75 for Thunder Bolts is due in 3 days',
    timestamp: '2024-01-13T14:15:00Z',
    read: false,
    type: 'payment',
  },
  {
    id: '3',
    title: 'RSVP Required',
    message: 'Please RSVP for the game vs Lightning Strikes',
    timestamp: '2024-01-12T16:45:00Z',
    read: true,
    type: 'rsvp',
  },
  {
    id: '4',
    title: 'Team Message',
    message: 'Sarah Davis: Great practice today everyone! 💪',
    timestamp: '2024-01-12T18:20:00Z',
    read: true,
    type: 'message',
  },
  {
    id: '5',
    title: 'League Update',
    message: 'Spring Recreation League schedule has been updated',
    timestamp: '2024-01-11T09:00:00Z',
    read: true,
    type: 'league',
  },
];

function PlayerHome() {
  const { profile } = useAuth();
  const { notificationCounts, markActionAsCompleted } = useNotifications();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([
    AVAILABLE_ITEMS[0], // Calendar
    AVAILABLE_ITEMS[1], // Payments
    AVAILABLE_ITEMS[2], // My Teams
  ]);
  const [showPinnedModal, setShowPinnedModal] = useState(false);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [selectedGameEvent, setSelectedGameEvent] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [notifications, setNotifications] = useState(mockNotifications);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    const firstInitial = names[0]?.charAt(0) || '';
    const lastInitial = names[names.length - 1]?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationPress = () => {
    setShowNotificationsModal(true);
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAsUnread = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: false }
          : notification
      )
    );
  };

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'game':
        return '⚾';
      case 'payment':
        return '💳';
      case 'rsvp':
        return '📅';
      case 'message':
        return '💬';
      case 'league':
        return '🏆';
      default:
        return '📢';
    }
  };

  const StatWidget = ({ 
    title, 
    value, 
    subtitle, 
    color, 
    icon: Icon, 
    onPress 
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    icon: any;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={[styles.statWidget, { backgroundColor: color }]} onPress={onPress}>
      <View style={styles.statWidgetContent}>
        <View style={styles.statWidgetHeader}>
          <Text style={styles.statWidgetTitle}>{title}</Text>
          <Icon color="white" size={20} strokeWidth={2} />
        </View>
        <Text style={styles.statWidgetValue}>{value}</Text>
        <Text style={styles.statWidgetSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDayName = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (formatDate(date) === formatDate(today)) {
      return 'Today';
    } else if (formatDate(date) === formatDate(tomorrow)) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  const handleDayPress = (date: Date) => {
    const dateStr = formatDate(date);
    const events = mockCalendarEvents[dateStr] || [];
    
    if (events.length > 0) {
      setSelectedDate(dateStr);
      setSelectedEvents(events);
      setModalVisible(true);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'game':
        return Colors.primary[800];
      case 'practice':
        return Colors.secondary[800];
      case 'tournament':
        return Colors.accent[800];
      default:
        return Colors.neutral[600];
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'game':
        return '⚾';
      case 'practice':
        return '🏃';
      case 'tournament':
        return '🏆';
      default:
        return '📅';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return Colors.error;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.primary[800];
      default:
        return Colors.neutral[600];
    }
  };

  const handleAddPinnedItem = () => {
    setShowPinnedModal(true);
  };

  const handleAddItemToPinned = (item: PinnedItem) => {
    if (pinnedItems.length < 6) {
      setPinnedItems(prev => [...prev, item]);
    }
  };

  const handleRemovePinnedItem = (itemId: string) => {
    setPinnedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleTodoAction = (todo: any) => {
    if (todo.type === 'rsvp' && todo.gameEvent) {
      setSelectedGameEvent(todo.gameEvent);
      setShowRSVPModal(true);
    } else if (todo.type === 'payment') {
      const paymentDetails = {
        id: todo.id,
        amount: 75,
        description: 'Player Fee for Thunder Bolts',
        dueDate: '2024-01-15',
        teamName: 'Thunder Bolts',
        leagueName: 'Spring Recreation League',
        paymentType: 'registration' as const,
      };
      setSelectedPayment(paymentDetails);
      setShowPaymentModal(true);
    } else {
      // Handle other todo types
      Alert.alert('Action', `${todo.action} - Feature coming soon!`);
    }
  };

  const handleRSVP = (eventId: string, response: 'going' | 'not-going') => {
    // In a real app, this would save to the database
    console.log(`RSVP for event ${eventId}: ${response}`);
    
    // Mark the calendar action as completed
    markActionAsCompleted('1'); // RSVP action ID
    
    // Update the todo item to reflect the RSVP response
    // This would typically involve updating the backend and refreshing the data
  };

  const handlePayment = (paymentId: string) => {
    // In a real app, this would process the payment through a payment gateway
    console.log(`Processing payment for ${paymentId}`);
    
    // Mark the payment action as completed
    markActionAsCompleted('2'); // Payment action ID
    
    // Update the todo item to reflect the payment completion
    // This would typically involve updating the backend and refreshing the data
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header showWelcome={true} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <DashboardSlider 
            cards={mockSliderCards}
            autoPlay={true}
            autoPlayInterval={4000}
          />

          {/* Pinned Items Section */}
          <PinnedItems
            pinnedItems={pinnedItems}
            onAddItem={handleAddPinnedItem}
            onRemoveItem={handleRemovePinnedItem}
            maxItems={6}
          />

          {/* To Dos */}
          <View style={styles.todosSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>To Dos</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.todosContainer}>
              {mockRecentActivity.slice(0, 3).map((todo, index) => (
                <View
                  key={todo.id}
                  style={[
                    styles.todoItem,
                    index < mockRecentActivity.slice(0, 3).length - 1 && styles.todoItemBorder
                  ]}
                >
                  <View style={[styles.todoDot, { backgroundColor: getPriorityColor(todo.priority) }]} />
                  <View style={styles.todoContent}>
                    <Text style={styles.todoMessage}>{todo.message}</Text>
                    <Text style={styles.todoDate}>{todo.date}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.todoActionButton}
                    onPress={() => handleTodoAction(todo)}
                  >
                    <Text style={styles.todoActionText}>{todo.action}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Stats Widgets Grid */}
          <View style={styles.widgetsGrid}>
            <View style={styles.widgetRow}>
              <StatWidget
                title="Calendar"
                value={mockStats.daysUntilNextEvent}
                subtitle={`days until ${mockStats.nextEventType}`}
                color={Colors.widgets.orange}
                icon={Clock}
              />
              <StatWidget
                title="Upcoming Payments"
                value={mockStats.paymentsOverdue}
                subtitle={`next in ${mockStats.daysUntilNextPayment} days`}
                color={Colors.widgets.red}
                icon={CreditCard}
              />
            </View>
            <View style={styles.widgetRow}>
              <StatWidget
                title="Games Won"
                value={mockStats.gamesWon}
                subtitle={`out of ${mockStats.totalGames} games`}
                color={Colors.widgets.purple}
                icon={Trophy}
              />
              <StatWidget
                title="Diamond Points"
                value={mockStats.diamondPoints}
                subtitle="points to spend"
                color={Colors.widgets.blue}
                icon={Gem}
              />
            </View>
          </View>

          {/* Shop Promotion */}
          <View style={styles.shopSection}>
            <View style={styles.shopContainer}>
              <View style={styles.shopHeader}>
                <View style={styles.shopTitleContainer}>
                  <ShoppingBasket color="#FFFFFF" size={20} strokeWidth={2} />
                  <Text style={styles.shopTitle}>Shop</Text>
                </View>
                <Text style={styles.shopSubtitle}>Browse Categories</Text>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {[
                  { name: 'Bats', icon: '🏏' },
                  { name: 'Fielding Gloves', icon: '🥎' },
                  { name: 'Batting Gloves', icon: '🧤' },
                  { name: 'Cleats', icon: '👟' },
                  { name: 'Softballs', icon: '⚾' },
                  { name: 'Apparel', icon: '👕' },
                  { name: 'Jerseys', icon: '🏃' },
                ].map((category, index) => (
                  <TouchableOpacity
                    key={category.name}
                    style={[
                      styles.categoryButton,
                      index === 0 && styles.selectedCategoryButton
                    ]}
                    onPress={() => Alert.alert('Shop Category', `Browse ${category.name} - Coming Soon!`)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryText,
                      index === 0 && styles.selectedCategoryText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

        </View>

        {/* Pinned Items Modal */}
        <PinnedItemsModal
          visible={showPinnedModal}
          onClose={() => setShowPinnedModal(false)}
          pinnedItems={pinnedItems}
          onAddItem={handleAddItemToPinned}
          maxItems={6}
        />

        {/* RSVP Modal */}
        <RSVPModal
          visible={showRSVPModal}
          onClose={() => setShowRSVPModal(false)}
          event={selectedGameEvent}
          onRSVP={handleRSVP}
        />

        {/* Payment Modal */}
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          payment={selectedPayment}
          onPayment={handlePayment}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function Home() {
  const { profile } = useAuth();
  const isManager = profile?.role === 'manager';
  const isDirector = profile?.role === 'director';

  if (isManager) {
    const ManagerDashboard = require('./dashboard').default;
    return <ManagerDashboard />;
  }

  if (isDirector) {
    return <PlayerHome />;
  }

  return <PlayerHome />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  
  scrollView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  
  content: {
    paddingHorizontal: Spacing.screen.horizontal,
    paddingVertical: Spacing.screen.vertical,
  },

  notificationsModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.screen.horizontal,
    paddingBottom: Spacing.screen.vertical,
    maxHeight: '80%',
  },
  
  notificationItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: 'transparent',
  },
  
  unreadNotification: {
    backgroundColor: Colors.primary[50],
  },
  
  notificationContent: {
    flex: 1,
  },
  
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  
  notificationIcon: {
    fontSize: Typography.fontSize.sm,
    marginRight: Spacing.sm,
  },
  
  notificationInfo: {
    flex: 1,
  },
  
  notificationTitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  
  notificationTime: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  
  notificationAction: {
    padding: Spacing.xs,
    borderRadius: 4,
    backgroundColor: Colors.background.secondary,
  },
  
  notificationMessage: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginLeft: 24, // Align with title
  },
  
  notificationsActions: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  
  seeAllButton: {
    width: '100%',
  },
  
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.md,
    borderWidth: 3,
    borderColor: Colors.primary[800],
  },
  
  profileInfo: {
    flex: 1,
  },
  
  playerName: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.xs,
    color: Colors.text.inverse,
  },
  
  skillLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  skillLevel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginRight: Spacing.sm,
    color: Colors.text.inverse,
  },
  
  starRating: {
    flexDirection: 'row',
  },
  
  star: {
    fontSize: Typography.fontSize.sm,
    marginRight: 2,
  },
  
  pointsBadge: {
    backgroundColor: Colors.primary[800],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  pointsText: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    marginRight: Spacing.xs,
    color: Colors.text.inverse,
  },
  
  pointsLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.md,
  },
  
  widgetsGrid: {
    marginBottom: Spacing.xl,
  },
  
  widgetRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  
  statWidget: {
    flex: 1,
    borderRadius: 20,
    padding: Spacing.lg,
    height: 140,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  
  statWidgetContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  
  statWidgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  
  statWidgetTitle: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: '#FFFFFF',
  },
  
  statWidgetValue: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
    lineHeight: Typography.fontSize['2xl'] * 1.1,
    color: '#FFFFFF',
  },
  
  statWidgetSubtitle: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    marginTop: 'auto',
    color: '#FFFFFF',
  },
  
  section: {
    marginBottom: Spacing.xl,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    backgroundColor: Colors.background.card,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    color: '#FFFFFF',
  },
  
  seeAllText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary[800],
  },
  
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  
  gameIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  
  gameInfo: {
    flex: 1,
  },
  
  teamName: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: 2,
  },
  
  gameDetails: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    marginBottom: 2,
  },
  
  gameTime: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
  },
  
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },

  todoItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[800],
    marginRight: Spacing.sm,
    marginTop: 6,
  },
  
  todoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  
  activityContent: {
    flex: 1,
  },
  
  todoContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  
  activityMessage: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.primary,
  },
  
  todoMessage: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: 2,
    color: '#000000',
  },
  
  activityDate: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  
  todoDate: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: '#666666',
  },
  
  todoActionButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary[800],
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  todoActionText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    color: '#FFFFFF',
  },

  gameLocation: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semiBold,
  },
  
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  
  actionButton: {
    flex: 1,
    minWidth: '45%',
  },
  
  shopContainer: {
    paddingVertical: Spacing.md,
  },
  
  shopHeader: {
    marginBottom: Spacing.md,
  },
  
  shopSection: {
    marginBottom: Spacing.xl,
  },
  
  todosSection: {
    marginBottom: Spacing.xl,
  },
  
  todosContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.md,
  },
  
  shopTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  
  shopTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    marginLeft: Spacing.xs,
    color: '#FFFFFF',
  },
  
  shopSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: '#FFFFFF',
  },
  
  categoriesContainer: {
    paddingRight: Spacing.md,
  },
  
  categoryButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginRight: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
  },
  
  selectedCategoryButton: {
    backgroundColor: Colors.primary[800],
  },
  
  categoryIcon: {
    fontSize: Typography.fontSize.base,
    marginRight: Spacing.xs,
  },
  
  categoryText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: '#666666',
  },
  
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.screen.horizontal,
    paddingBottom: Spacing.screen.vertical,
    maxHeight: '70%',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeButtonText: {
    fontSize: Typography.fontSize.base,
  },
  
  modalEventsList: {
    flex: 1,
  },
  
  modalEventItem: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
  },
  
  modalEventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  modalEventIcon: {
    fontSize: Typography.fontSize.xl,
    marginRight: Spacing.md,
  },
  
  modalEventInfo: {
    flex: 1,
  },
  
  modalEventTitle: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: 2,
  },
  
  modalEventTime: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: 2,
  },
  
  modalEventLocation: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
  },
  
  modalActions: {
    marginTop: Spacing.lg,
  },
  
  modalCloseButton: {
    marginTop: Spacing.md,
  },
});