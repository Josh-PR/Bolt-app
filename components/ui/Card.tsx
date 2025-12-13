import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';

const AnimatedView = Animated.createAnimatedComponent(View);

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  pressable?: boolean;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  pressable = false,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      shadowOpacity: shadowOpacity.value,
    };
  });

  const handlePressIn = () => {
    if (pressable) {
      scale.value = withSpring(0.98);
      shadowOpacity.value = withTiming(0.2, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (pressable) {
      scale.value = withSpring(1);
      shadowOpacity.value = withTiming(0.1, { duration: 150 });
    }
  };

  const getCardStyle = () => {
    const baseStyle = [styles.card, styles[`${variant}Card`]];
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const CardComponent = pressable ? AnimatedView : View;

  return (
    <CardComponent
      style={[getCardStyle(), pressable && animatedStyle]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  
  defaultCard: {
    backgroundColor: Colors.background.primary,
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  elevatedCard: {
    backgroundColor: Colors.background.primary,
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  outlinedCard: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
});