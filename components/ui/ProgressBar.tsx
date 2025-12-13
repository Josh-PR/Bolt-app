import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Colors.primary[800],
  backgroundColor = Colors.neutral[200],
  height = 8,
  style,
  animated = true,
}) => {
  const progressWidth = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  useEffect(() => {
    if (animated) {
      progressWidth.value = withTiming(progress, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progressWidth.value = progress;
    }
  }, [progress, animated]);

  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      <Animated.View
        style={[
          styles.progress,
          {
            backgroundColor: color,
            height,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progress: {
    borderRadius: 4,
  },
});