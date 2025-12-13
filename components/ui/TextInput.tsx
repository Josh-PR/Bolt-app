import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  hint,
  containerStyle,
  inputStyle,
  icon,
  rightIcon,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(Colors.border.light);
  const labelColor = useSharedValue(Colors.text.secondary);

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderColor.value,
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      color: labelColor.value,
    };
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderColor.value = withTiming(Colors.primary[800], { duration: 200 });
    labelColor.value = withTiming(Colors.primary[800], { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderColor.value = withTiming(
      error ? Colors.error : Colors.border.light,
      { duration: 200 }
    );
    labelColor.value = withTiming(
      error ? Colors.error : Colors.text.secondary,
      { duration: 200 }
    );
    onBlur?.(e);
  };

  const getInputContainerStyle = () => {
    const baseStyle = [styles.inputContainer, animatedBorderStyle];
    
    if (error) {
      baseStyle.push(styles.errorContainer);
    }
    
    if (props.editable === false) {
      baseStyle.push(styles.disabledContainer);
    }
    
    return baseStyle;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Animated.Text style={[styles.label, animatedLabelStyle]}>
          {label}
        </Animated.Text>
      )}
      
      <Animated.View style={getInputContainerStyle()}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <RNTextInput
          style={[styles.input, inputStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={Colors.text.disabled}
          selectionColor={Colors.primary[800]}
          {...props}
        />
        
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </Animated.View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  
  label: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.xs,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 8,
    backgroundColor: Colors.background.primary,
    minHeight: 48,
  },
  
  input: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.inverse,
  },
  
  iconContainer: {
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
  },
  
  rightIconContainer: {
    paddingRight: Spacing.md,
    paddingLeft: Spacing.xs,
  },
  
  errorContainer: {
    borderColor: Colors.error,
  },
  
  disabledContainer: {
    backgroundColor: Colors.neutral[100],
    borderColor: Colors.border.light,
  },
  
  errorText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  
  hintText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
});