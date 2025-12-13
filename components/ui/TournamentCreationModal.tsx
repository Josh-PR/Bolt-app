import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { X } from 'lucide-react-native';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { supabase } from '../../lib/supabase';
import { useColors } from '../../hooks/useColors';
import { useAuth } from '../../contexts/AuthContext';

interface TournamentCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TournamentCreationModal({
  visible,
  onClose,
  onSuccess,
}: TournamentCreationModalProps) {
  const colors = useColors();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    skillLevel: 'intermediate',
    location: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    entryFee: '',
    maxTeams: '8',
    format: 'single_elimination',
    prizePool: '',
  });

  const skillLevels = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Competitive', value: 'competitive' },
  ];

  const formats = [
    { label: 'Single Elimination', value: 'single_elimination' },
    { label: 'Double Elimination', value: 'double_elimination' },
    { label: 'Round Robin', value: 'round_robin' },
    { label: 'Pool Play', value: 'pool_play' },
  ];

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.location ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.registrationDeadline
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.from('tournaments').insert({
        name: formData.name,
        description: formData.description || null,
        skill_level: formData.skillLevel,
        location: formData.location,
        start_date: formData.startDate,
        end_date: formData.endDate,
        registration_deadline: formData.registrationDeadline,
        entry_fee: parseFloat(formData.entryFee) || 0,
        max_teams: parseInt(formData.maxTeams) || 8,
        format: formData.format,
        prize_pool: formData.prizePool ? parseFloat(formData.prizePool) : null,
        director_id: user?.id,
      });

      if (error) throw error;

      Alert.alert('Success', 'Tournament created successfully!');
      setFormData({
        name: '',
        description: '',
        skillLevel: 'intermediate',
        location: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        entryFee: '',
        maxTeams: '8',
        format: 'single_elimination',
        prizePool: '',
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create tournament');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Create New Tournament
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="#ffffff" size={24} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <TextInput
              label="Tournament Name *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="e.g., Summer Championship 2024"
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Brief description of the tournament"
              multiline
              numberOfLines={3}
            />

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Skill Level *</Text>
              <View style={styles.optionContainer}>
                {skillLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          formData.skillLevel === level.value
                            ? colors.primary
                            : colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setFormData({ ...formData, skillLevel: level.value })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            formData.skillLevel === level.value
                              ? '#FFFFFF'
                              : colors.text,
                        },
                      ]}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Tournament Format *</Text>
              <View style={styles.optionContainer}>
                {formats.map((formatOption) => (
                  <TouchableOpacity
                    key={formatOption.value}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          formData.format === formatOption.value
                            ? colors.primary
                            : colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, format: formatOption.value })
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            formData.format === formatOption.value
                              ? '#FFFFFF'
                              : colors.text,
                        },
                      ]}
                    >
                      {formatOption.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              label="Location *"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder="e.g., City Sports Complex"
            />

            <TextInput
              label="Start Date * (YYYY-MM-DD)"
              value={formData.startDate}
              onChangeText={(text) => setFormData({ ...formData, startDate: text })}
              placeholder="2024-06-01"
            />

            <TextInput
              label="End Date * (YYYY-MM-DD)"
              value={formData.endDate}
              onChangeText={(text) => setFormData({ ...formData, endDate: text })}
              placeholder="2024-06-03"
            />

            <TextInput
              label="Registration Deadline * (YYYY-MM-DD)"
              value={formData.registrationDeadline}
              onChangeText={(text) =>
                setFormData({ ...formData, registrationDeadline: text })
              }
              placeholder="2024-05-25"
            />

            <TextInput
              label="Entry Fee per Team ($)"
              value={formData.entryFee}
              onChangeText={(text) => setFormData({ ...formData, entryFee: text })}
              placeholder="0"
              keyboardType="numeric"
            />

            <TextInput
              label="Prize Pool ($)"
              value={formData.prizePool}
              onChangeText={(text) => setFormData({ ...formData, prizePool: text })}
              placeholder="Optional"
              keyboardType="numeric"
            />

            <TextInput
              label="Maximum Teams"
              value={formData.maxTeams}
              onChangeText={(text) => setFormData({ ...formData, maxTeams: text })}
              placeholder="8"
              keyboardType="numeric"
            />

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Button
                  title={loading ? 'Creating...' : 'Create Tournament'}
                  onPress={handleSubmit}
                  disabled={loading}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 12,
    backgroundColor: '#334155',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
