import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from './Button';
import { PinnedItem, AVAILABLE_ITEMS } from './PinnedItems';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface PinnedItemsModalProps {
  visible: boolean;
  onClose: () => void;
  pinnedItems: PinnedItem[];
  onAddItem: (item: PinnedItem) => void;
  maxItems: number;
}

export const PinnedItemsModal: React.FC<PinnedItemsModalProps> = ({
  visible,
  onClose,
  pinnedItems,
  onAddItem,
  maxItems,
}) => {
  const availableItems = AVAILABLE_ITEMS.filter(
    item => !pinnedItems.some(pinned => pinned.id === item.id)
  );

  const handleAddItem = (item: PinnedItem) => {
    if (pinnedItems.length >= maxItems) {
      return;
    }
    onAddItem(item);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add to Quick Access</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            Choose items to add to your quick access section ({pinnedItems.length}/{maxItems})
          </Text>

          <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
            <View style={styles.itemsGrid}>
              {availableItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.availableItem}
                  onPress={() => handleAddItem(item)}
                  disabled={pinnedItems.length >= maxItems}
                >
                  <View style={[styles.itemIcon, { backgroundColor: item.color || Colors.primary[800] }]}>
                    <item.icon color="white" size={20} strokeWidth={2} />
                  </View>
                  <Text style={styles.itemName}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <Button
              title="Done"
              onPress={onClose}
              style={styles.doneButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.screen.horizontal,
    paddingBottom: Spacing.screen.vertical,
    maxHeight: '70%',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: '#000000',
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeButtonText: {
    fontSize: Typography.fontSize.base,
    color: '#000000',
  },
  
  modalSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: '#666666',
    marginBottom: Spacing.lg,
  },
  
  itemsList: {
    flex: 1,
    marginBottom: Spacing.lg,
  },
  
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  
  availableItem: {
    alignItems: 'center',
    width: 80,
    marginBottom: Spacing.md,
  },
  
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  
  itemName: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: '#000000',
    textAlign: 'center',
  },
  
  modalActions: {
    marginTop: Spacing.lg,
  },
  
  doneButton: {
    width: '100%',
  },
});