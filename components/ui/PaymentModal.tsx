import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { X, CreditCard, Calendar, Clock, Users, DollarSign } from 'lucide-react-native';
import { Button } from './Button';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface PaymentDetails {
  id: string;
  amount: number;
  description: string;
  dueDate: string;
  teamName: string;
  leagueName: string;
  paymentType: 'registration' | 'equipment' | 'late_fee';
}

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  payment: PaymentDetails | null;
  onPayment: (paymentId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  payment,
  onPayment,
}) => {
  const [submitting, setSubmitting] = useState(false);

  if (!payment) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return '🏟️';
      case 'equipment':
        return '⚾';
      case 'late_fee':
        return '⏰';
      default:
        return '💳';
    }
  };

  const handlePayment = async () => {
    setSubmitting(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onPayment(payment.id);
      
      Alert.alert(
        'Payment Successful',
        `Your payment of $${payment.amount} has been processed successfully. Thank you!`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Payment Required</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={submitting}
            >
              <X color={Colors.text.secondary} size={10} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Payment Amount */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount Due</Text>
            <View style={styles.amountContainer}>
              <DollarSign color={Colors.primary[800]} size={12} strokeWidth={2} />
              <Text style={styles.amountValue}>{payment.amount}</Text>
            </View>
          </View>

          {/* Payment Details */}
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentDescription}>{payment.description}</Text>
            
            <View style={styles.detailRow}>
              <Calendar color={Colors.primary[800]} size={9} strokeWidth={2} />
              <Text style={styles.detailText}>Due: {formatDate(payment.dueDate)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Users color={Colors.primary[800]} size={9} strokeWidth={2} />
              <Text style={styles.detailText}>{payment.teamName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.paymentTypeIcon}>{getPaymentTypeIcon(payment.paymentType)}</Text>
              <Text style={styles.detailText}>{payment.leagueName}</Text>
            </View>
          </View>

          {/* Payment Information */}
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentInfoTitle}>Payment Information</Text>
            <Text style={styles.paymentInfoText}>
              Your payment will be processed securely. You will receive a confirmation email once the payment is complete.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Pay Now"
              onPress={handlePayment}
              loading={submitting}
              style={styles.payButton}
              textStyle={styles.payButtonText}
            />
            <Button
              title="Cancel"
              onPress={onClose}
              loading={submitting}
              variant="outline"
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
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
    borderRadius: 20,
    padding: Spacing.md,
    width: '100%',
    maxWidth: 200,
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  
  modalTitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.primary,
  },
  
  closeButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  amountSection: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary[50],
    borderRadius: 8,
  },
  
  amountLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  amountValue: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary[800],
    marginLeft: Spacing.xs,
  },
  
  paymentDetails: {
    marginBottom: Spacing.md,
  },
  
  paymentDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  
  detailText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  
  paymentTypeIcon: {
    fontSize: Typography.fontSize.xs,
    marginRight: Spacing.xs,
  },
  
  paymentInfo: {
    backgroundColor: Colors.neutral[50],
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  
  paymentInfoTitle: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  
  paymentInfoText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  
  payButton: {
    flex: 2,
    backgroundColor: Colors.primary[800],
    borderColor: Colors.primary[800],
  },
  
  payButtonText: {
    color: Colors.text.inverse,
    fontFamily: Typography.fontFamily.semiBold,
  },
  
  cancelButton: {
    flex: 1,
    borderColor: Colors.neutral[400],
    borderWidth: 2,
  },
  
  cancelButtonText: {
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily.semiBold,
  },
});