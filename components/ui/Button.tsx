import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
    opacity.value = withTiming(0.8, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1, { duration: 150 });
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`${variant}Button`], styles[`${size}Button`]];
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`${variant}Text`], styles[`${size}Text`]];
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    }
    
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };

  return (
    <AnimatedTouchableOpacity
      style={[getButtonStyle(), animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.text.inverse : Colors.primary[800]}
          style={styles.loader}
        />
      )}
      {icon && !loading && <Animated.View style={styles.iconContainer}>{icon}</Animated.View>}
      <Text style={getTextStyle()}>{title}</Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  
  // Variants
  primaryButton: {
    backgroundColor: Colors.primary[800],
    borderColor: Colors.primary[800],
  },
  
  secondaryButton: {
    backgroundColor: Colors.secondary[800],
    borderColor: Colors.secondary[800],
  },
  
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.primary[800],
    borderWidth: 2,
  },
  
  ghostButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  
  // Sizes
  smButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minHeight: 32,
  },
  
  mdButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },
  
  lgButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  
  // Text styles
  buttonText: {
    fontFamily: Typography.fontFamily.medium,
    textAlign: 'center',
  },
  
  primaryText: {
    color: Colors.text.inverse,
  },
  
  secondaryText: {
    color: Colors.text.inverse,
  },
  
  outlineText: {
    color: Colors.primary[800],
  },
  
  ghostText: {
    color: Colors.primary[800],
  },
  
  // Text sizes
  smText: {
    fontSize: Typography.fontSize.sm,
  },
  
  mdText: {
    fontSize: Typography.fontSize.base,
  },
  
  lgText: {
    fontSize: Typography.fontSize.lg,
  },
  
  // Disabled states
  disabledButton: {
    backgroundColor: Colors.neutral[300],
    borderColor: Colors.neutral[300],
  },
  
  disabledText: {
    color: Colors.text.disabled,
  },
  
  loader: {
    marginRight: Spacing.xs,
  },

  iconContainer: {
    marginRight: Spacing.xs,
  },
});