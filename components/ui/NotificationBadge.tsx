import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

interface NotificationBadgeProps {
  count?: number;
  show?: boolean;
  size?: 'sm' | 'md';
  style?: any;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  show = false,
  size = 'sm',
  style,
}) => {
  if (!show) return null;

  const displayCount = count && count > 99 ? '99+' : count?.toString() || '';
  const showCount = count && count > 0;

  return (
    <View style={[
      styles.badge,
      styles[`${size}Badge`],
      style
    ]}>
      {showCount && (
        <Text style={[styles.badgeText, styles[`${size}Text`]]}>
          {displayCount}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    backgroundColor: Colors.error,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    height: 20,
  },
  
  smBadge: {
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
  },
  
  mdBadge: {
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
  },
  
  badgeText: {
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.inverse,
    textAlign: 'center',
  },
  
  smText: {
    fontSize: 10,
    lineHeight: 12,
  },
  
  mdText: {
    fontSize: Typography.fontSize.xs,
    lineHeight: 14,
  },
});