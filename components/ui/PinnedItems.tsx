import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { 
  Star, 
  Calendar, 
  CreditCard, 
  Users, 
  Trophy, 
  UserPlus, 
  Settings, 
  MessageCircle,
  MapPin,
  Bell,
  Plus,
  X
} from 'lucide-react-native';
import { NotificationBadge } from './NotificationBadge';
import { useNotifications } from '../../hooks/useNotifications';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export interface PinnedItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  action: () => void;
  color?: string;
}

interface PinnedItemsProps {
  pinnedItems: PinnedItem[];
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
  maxItems?: number;
}

const AVAILABLE_ITEMS: PinnedItem[] = [
  {
    id: 'calendar',
    title: 'Calendar',
    icon: Calendar,
    action: () => Alert.alert('Calendar', 'Opening calendar...'),
    color: Colors.widgets.blue,
  },
  {
    id: 'payments',
    title: 'Payments',
    icon: CreditCard,
    action: () => Alert.alert('Payments', 'Opening payments...'),
    color: Colors.widgets.red,
  },
  {
    id: 'teams',
    title: 'My Teams',
    icon: Users,
    action: () => Alert.alert('Teams', 'Opening teams...'),
    color: Colors.widgets.purple,
  },
  {
    id: 'leagues',
    title: 'Leagues',
    icon: Trophy,
    action: () => Alert.alert('Leagues', 'Opening leagues...'),
    color: Colors.widgets.orange,
  },
  {
    id: 'join',
    title: 'Join Team',
    icon: UserPlus,
    action: () => Alert.alert('Join Team', 'Opening team search...'),
    color: Colors.widgets.green,
  },
  {
    id: 'messages',
    title: 'Messages',
    icon: MessageCircle,
    action: () => Alert.alert('Messages', 'Opening messages...'),
    color: Colors.widgets.teal,
  },
  {
    id: 'locations',
    title: 'Locations',
    icon: MapPin,
    action: () => Alert.alert('Locations', 'Opening locations...'),
    color: Colors.widgets.pink,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    action: () => Alert.alert('Notifications', 'Opening notifications...'),
    color: Colors.widgets.indigo,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    action: () => Alert.alert('Settings', 'Opening settings...'),
    color: Colors.neutral[600],
  },
];

export const PinnedItems: React.FC<PinnedItemsProps> = ({
  pinnedItems,
  onAddItem,
  onRemoveItem,
  maxItems = 6,
}) => {
  const [showRemoveMode, setShowRemoveMode] = useState(false);
  const { notificationCounts, hasNotifications } = useNotifications();

  const handleLongPress = () => {
    if (pinnedItems.length > 0) {
      setShowRemoveMode(!showRemoveMode);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    onRemoveItem(itemId);
    if (pinnedItems.length <= 1) {
      setShowRemoveMode(false);
    }
  };

  const getNotificationCount = (itemId: string) => {
    switch (itemId) {
      case 'calendar':
        return notificationCounts.calendar;
      case 'payments':
        return notificationCounts.payments;
      default:
        return 0;
    }
  };

  const shouldShowNotification = (itemId: string) => {
    return ['calendar', 'payments'].includes(itemId) && getNotificationCount(itemId) > 0;
  };
  const canAddMore = pinnedItems.length < maxItems;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quick Access</Text>
        {pinnedItems.length > 0 && (
          <TouchableOpacity
            onPress={handleLongPress}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {showRemoveMode ? 'Done' : 'Edit'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {pinnedItems.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <TouchableOpacity
              style={[styles.pinnedItem, { backgroundColor: item.color || Colors.primary[800] }]}
              onPress={showRemoveMode ? undefined : item.action}
              onLongPress={handleLongPress}
              activeOpacity={0.8}
            >
              <item.icon color="white" size={24} strokeWidth={2} />
              
              {/* Notification Badge */}
              {shouldShowNotification(item.id) && (
                <NotificationBadge
                  count={getNotificationCount(item.id)}
                  show={true}
                  size="sm"
                />
              )}
              
              {showRemoveMode && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <X color="white" size={16} strokeWidth={3} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
        ))}

        {canAddMore && (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddItem}
              activeOpacity={0.8}
            >
              <Plus color={Colors.text.inverse} size={24} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.itemTitle}>Add</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export { AVAILABLE_ITEMS };

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  
  title: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.inverse,
  },
  
  editButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  
  editButtonText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary[800],
  },
  
  scrollContainer: {
    paddingRight: Spacing.md,
  },
  
  itemContainer: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 70,
  },
  
  pinnedItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    backgroundColor: Colors.neutral[700],
    borderWidth: 2,
    borderColor: Colors.neutral[500],
    borderStyle: 'dashed',
  },
  
  removeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  
  itemTitle: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.inverse,
    textAlign: 'center',
    maxWidth: 70,
  },
});