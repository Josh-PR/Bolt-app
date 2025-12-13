import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { X, Calendar, Clock, MapPin, Users } from 'lucide-react-native';
import { Button } from './Button';
import { useColors } from '../../hooks/useColors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface GameEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  time: string; // Time in HH:MM format
  timezone: string;
  venue: string;
  address: string;
  opponent: string;
  teamName: string;
}

interface RSVPModalProps {
  visible: boolean;
  onClose: () => void;
  event: GameEvent | null;
  onRSVP: (eventId: string, response: 'going' | 'not-going') => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({
  visible,
  onClose,
  event,
  onRSVP,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const colors = useColors();

  if (!event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string, timezone: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) + ` ${timezone}`;
  };

  const handleRSVP = async (response: 'going' | 'not-going') => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onRSVP(event.id, response);
      
      const message = response === 'going' 
        ? 'Great! You\'re confirmed for the game. See you there!' 
        : 'Thanks for letting us know. Your response has been recorded.';
      
      Alert.alert(
        'RSVP Confirmed',
        message,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropPress = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <TouchableOpacity 
          style={styles.modalContent} 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border.light }]}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>RSVP for Game</Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.neutral[100] }]}
              onPress={onClose}
              disabled={submitting}
            >
              <X color={colors.text.secondary} size={18} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Event Details */}
          <View style={[styles.eventDetails, { backgroundColor: colors.neutral[100] }]}>
            <Text style={[styles.eventTitle, { color: colors.text.primary }]}>{event.title}</Text>

            <View style={styles.detailRow}>
              <Calendar color={colors.primary[800]} size={16} strokeWidth={2} />
              <Text style={[styles.detailText, { color: colors.text.primary }]}>{formatDate(event.date)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Clock color={colors.primary[800]} size={16} strokeWidth={2} />
              <Text style={[styles.detailText, { color: colors.text.primary }]}>{formatTime(event.time, event.timezone)}</Text>
            </View>

            <View style={styles.detailRow}>
              <MapPin color={colors.primary[800]} size={16} strokeWidth={2} />
              <View style={styles.locationInfo}>
                <Text style={[styles.detailText, { color: colors.text.primary }]}>{event.venue}</Text>
                <Text style={[styles.addressText, { color: colors.text.secondary }]}>{event.address}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Users color={colors.primary[800]} size={16} strokeWidth={2} />
              <Text style={[styles.detailText, { color: colors.text.primary }]}>
                {event.teamName} vs {event.opponent}
              </Text>
            </View>
          </View>

          {/* RSVP Question */}
          <View style={[styles.rsvpSection, { borderTopColor: colors.border.light, borderBottomColor: colors.border.light }]}>
            <Text style={[styles.rsvpQuestion, { color: colors.text.primary }]}>Will you be attending this game?</Text>
            <Text style={[styles.rsvpSubtext, { color: colors.text.secondary }]}>
              Your response helps the team plan for the game
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Going"
              onPress={() => handleRSVP('going')}
              loading={submitting}
              style={[styles.goingButton, { backgroundColor: colors.success, borderColor: colors.success, shadowColor: colors.success }]}
              textStyle={[styles.goingButtonText, { color: colors.text.inverse }]}
            />
            <Button
              title="I'm out"
              onPress={() => handleRSVP('not-going')}
              loading={submitting}
              variant="outline"
              style={[styles.notGoingButton, { borderColor: colors.neutral[300], backgroundColor: colors.background.card }]}
              textStyle={[styles.notGoingButtonText, { color: colors.text.primary }]}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen.horizontal,
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },

  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
  },

  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  eventDetails: {
    padding: Spacing.md,
    borderRadius: 10,
    marginBottom: Spacing.md,
  },

  eventTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.tight * Typography.fontSize.lg,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },

  detailText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginLeft: Spacing.xs,
    flex: 1,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },

  locationInfo: {
    marginLeft: Spacing.xs,
    flex: 1,
  },

  addressText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    marginTop: 2,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.xs,
  },

  rsvpSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },

  rsvpQuestion: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    lineHeight: Typography.lineHeight.tight * Typography.fontSize.lg,
  },

  rsvpSubtext: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  goingButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  goingButtonText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
  },

  notGoingButton: {
    flex: 1,
    borderWidth: 2,
    paddingVertical: Spacing.md,
    borderRadius: 10,
  },

  notGoingButtonText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.base,
  },
});