import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NotificationCounts {
  calendar: number;
  payments: number;
  total: number;
}

interface PendingAction {
  id: string;
  type: 'calendar' | 'payment';
  title: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
}

// Mock pending actions - in a real app, this would come from your backend
const getMockPendingActions = (userRole: string): PendingAction[] => {
  const baseActions: PendingAction[] = [
    {
      id: '1',
      type: 'calendar',
      title: 'RSVP to game vs Lightning Strikes',
      dueDate: '2024-01-13',
      priority: 'high',
    },
    {
      id: '2',
      type: 'payment',
      title: 'Pay Player Fee for Thunder Bolts',
      dueDate: '2024-01-15',
      priority: 'high',
    },
    {
      id: '3',
      type: 'calendar',
      title: 'Confirm practice attendance',
      dueDate: '2024-01-16',
      priority: 'medium',
    },
  ];

  // Add role-specific actions
  if (userRole === 'manager') {
    baseActions.push(
      {
        id: '4',
        type: 'calendar',
        title: 'Submit jersey orders',
        dueDate: '2024-01-14',
        priority: 'high',
      },
      {
        id: '5',
        type: 'payment',
        title: 'Collect outstanding team fees',
        dueDate: '2024-01-18',
        priority: 'medium',
      }
    );
  }

  return baseActions;
};

export const useNotifications = () => {
  const { profile } = useAuth();
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [notificationCounts, setNotificationCounts] = useState<NotificationCounts>({
    calendar: 0,
    payments: 0,
    total: 0,
  });

  useEffect(() => {
    // Simulate fetching pending actions from backend
    const actions = getMockPendingActions(profile?.role || 'player');
    setPendingActions(actions);

    // Calculate notification counts
    const calendarCount = actions.filter(action => action.type === 'calendar').length;
    const paymentsCount = actions.filter(action => action.type === 'payment').length;
    
    setNotificationCounts({
      calendar: calendarCount,
      payments: paymentsCount,
      total: calendarCount + paymentsCount,
    });
  }, [profile?.role]);

  const markActionAsCompleted = (actionId: string) => {
    setPendingActions(prev => prev.filter(action => action.id !== actionId));
    
    // Recalculate counts
    const updatedActions = pendingActions.filter(action => action.id !== actionId);
    const calendarCount = updatedActions.filter(action => action.type === 'calendar').length;
    const paymentsCount = updatedActions.filter(action => action.type === 'payment').length;
    
    setNotificationCounts({
      calendar: calendarCount,
      payments: paymentsCount,
      total: calendarCount + paymentsCount,
    });
  };

  const getPendingActionsByType = (type: 'calendar' | 'payment') => {
    return pendingActions.filter(action => action.type === type);
  };

  const hasNotifications = (type?: 'calendar' | 'payment') => {
    if (!type) return notificationCounts.total > 0;
    return notificationCounts[type] > 0;
  };

  return {
    pendingActions,
    notificationCounts,
    markActionAsCompleted,
    getPendingActionsByType,
    hasNotifications,
  };
};