import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}) => {
  const getBadgeStyle = () => {
    const baseStyle = [styles.badge, styles[`${variant}Badge`], styles[`${size}Badge`]];
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.badgeText, styles[`${variant}Text`], styles[`${size}Text`]];
    
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };

  return (
    <View style={getBadgeStyle()}>
      <Text style={getTextStyle()}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  
  // Variants
  primaryBadge: {
    backgroundColor: Colors.primary[100],
  },
  
  secondaryBadge: {
    backgroundColor: Colors.secondary[100],
  },
  
  successBadge: {
    backgroundColor: Colors.primary[100],
  },
  
  warningBadge: {
    backgroundColor: Colors.secondary[100],
  },
  
  errorBadge: {
    backgroundColor: '#FFEBEE',
  },
  
  infoBadge: {
    backgroundColor: Colors.accent[100],
  },
  
  neutralBadge: {
    backgroundColor: Colors.neutral[100],
  },
  
  // Sizes
  smBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  
  mdBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  
  lgBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  
  // Text styles
  badgeText: {
    fontFamily: Typography.fontFamily.medium,
    textAlign: 'center',
  },
  
  primaryText: {
    color: Colors.primary[800],
  },
  
  secondaryText: {
    color: Colors.secondary[800],
  },
  
  successText: {
    color: Colors.success,
  },
  
  warningText: {
    color: Colors.warning,
  },
  
  errorText: {
    color: Colors.error,
  },
  
  infoText: {
    color: Colors.info,
  },
  
  neutralText: {
    color: Colors.text.secondary,
  },
  
  // Text sizes
  smText: {
    fontSize: Typography.fontSize.xs,
  },
  
  mdText: {
    fontSize: Typography.fontSize.sm,
  },
  
  lgText: {
    fontSize: Typography.fontSize.base,
  },
});