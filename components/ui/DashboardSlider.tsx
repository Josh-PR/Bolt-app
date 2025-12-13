import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Button } from './Button';
import { Badge } from './Badge';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - (Spacing.screen.horizontal * 2);
const CARD_SPACING = Spacing.md;

interface SliderCard {
  id: string;
  type: 'tournament' | 'recruitment' | 'championship' | 'announcement' | 'promotion';
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  actionText: string;
  onPress: () => void;
  badge?: {
    text: string;
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  gradient?: {
    colors: string[];
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
}

interface DashboardSliderProps {
  cards: SliderCard[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const DashboardSlider: React.FC<DashboardSliderProps> = ({
  cards,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

  useEffect(() => {
    if (autoPlay && cards.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % cards.length;
        setCurrentIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * (CARD_WIDTH + CARD_SPACING),
          animated: true,
        });
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [currentIndex, autoPlay, autoPlayInterval, cards.length]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));
    setCurrentIndex(index);
  };

  const getCardStyle = (cardType: SliderCard['type']) => {
    switch (cardType) {
      case 'tournament':
        return {
          backgroundColor: Colors.primary[800],
          textColor: Colors.text.inverse,
        };
      case 'recruitment':
        return {
          backgroundColor: Colors.secondary[800],
          textColor: Colors.text.inverse,
        };
      case 'championship':
        return {
          backgroundColor: Colors.accent[800],
          textColor: Colors.text.inverse,
        };
      case 'announcement':
        return {
          backgroundColor: Colors.neutral[800],
          textColor: Colors.text.inverse,
        };
      case 'promotion':
        return {
          backgroundColor: Colors.success,
          textColor: Colors.text.inverse,
        };
      default:
        return {
          backgroundColor: Colors.primary[800],
          textColor: Colors.text.inverse,
        };
    }
  };

  if (cards.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
      >
        {cards.map((card, index) => {
          const cardStyle = getCardStyle(card.type);
          
          return (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                { backgroundColor: cardStyle.backgroundColor },
              ]}
              onPress={card.onPress}
              activeOpacity={0.9}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: card.imageUrl }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              </View>
              
              <View style={styles.cardContent}>
                <View style={styles.textContent}>
                  {card.badge && (
                    <Badge
                      label={card.badge.text}
                      variant={card.badge.variant}
                      size="sm"
                      style={styles.badge}
                    />
                  )}
                  
                  <Text style={styles.title}>
                    {card.title}
                  </Text>
                  
                  {card.subtitle && (
                    <Text style={styles.subtitle}>
                      {card.subtitle}
                    </Text>
                  )}
                  
                  <Text style={styles.description}>
                    {card.description}
                  </Text>
                  
                  <Button
                    title={card.actionText}
                    onPress={card.onPress}
                    variant="primary"
                    size="sm"
                    style={styles.actionButton}
                    textStyle={styles.actionButtonText}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Pagination Dots */}
      {cards.length > 1 && (
        <View style={styles.pagination}>
          {cards.map((_, index) => {
            const dotStyle = useAnimatedStyle(() => {
              const opacity = interpolate(
                scrollX.value,
                [
                  (index - 1) * (CARD_WIDTH + CARD_SPACING),
                  index * (CARD_WIDTH + CARD_SPACING),
                  (index + 1) * (CARD_WIDTH + CARD_SPACING),
                ],
                [0.3, 1, 0.3],
                Extrapolate.CLAMP
              );

              const scale = interpolate(
                scrollX.value,
                [
                  (index - 1) * (CARD_WIDTH + CARD_SPACING),
                  index * (CARD_WIDTH + CARD_SPACING),
                  (index + 1) * (CARD_WIDTH + CARD_SPACING),
                ],
                [0.8, 1.2, 0.8],
                Extrapolate.CLAMP
              );

              return {
                opacity: withTiming(opacity, { duration: 200 }),
                transform: [{ scale: withTiming(scale, { duration: 200 }) }],
              };
            });

            return (
              <Animated.View
                key={index}
                style={[styles.dot, dotStyle]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  
  scrollContainer: {
    paddingHorizontal: Spacing.screen.horizontal,
  },
  
  card: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 16,
    marginRight: CARD_SPACING,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  
  cardContent: {
    flex: 1,
    flexDirection: 'column',
    padding: Spacing.md,
  },
  
  textContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  
  badge: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  
  title: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    lineHeight: Typography.lineHeight.tight * Typography.fontSize.xl,
    marginBottom: 2,
    color: '#FFFFFF',
  },
  
  subtitle: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 2,
  },
  
  description: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    lineHeight: Typography.lineHeight.tight * Typography.fontSize.xs,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 4,
  },
  
  actionButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  
  actionButtonText: {
    color: '#000000',
  },
  
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[800],
  },
});