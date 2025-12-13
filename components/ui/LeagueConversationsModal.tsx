import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput as RNTextInput,
} from 'react-native';
import { X, MapPin, Users, MessageCircle } from 'lucide-react-native';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { LocationSetupForm } from './LocationSetupForm';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface LeagueConversation {
  conversation_id: string;
  league_id: string;
  league_name: string;
  league_location: string;
  distance_miles: number;
  participant_count: number;
  is_member: boolean;
}

interface LeagueConversationsModalProps {
  visible: boolean;
  onClose: () => void;
  onJoinConversation: (conversationId: string, leagueName: string) => Promise<void>;
  onNavigateToConversation: (conversationId: string) => void;
  onLocationUpdate: (latitude: number, longitude: number, searchRadius: number) => Promise<void>;
  userLocation?: { latitude: number; longitude: number } | null;
  searchRadius?: number;
}

export function LeagueConversationsModal({
  visible,
  onClose,
  onJoinConversation,
  onNavigateToConversation,
  onLocationUpdate,
  userLocation,
  searchRadius = 25,
}: LeagueConversationsModalProps) {
  const [conversations, setConversations] = useState<LeagueConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [customRadius, setCustomRadius] = useState(searchRadius.toString());
  const [activeRadius, setActiveRadius] = useState(searchRadius);
  const [showLocationSetup, setShowLocationSetup] = useState(false);

  useEffect(() => {
    if (visible) {
      if (!userLocation) {
        setShowLocationSetup(true);
      } else {
        setShowLocationSetup(false);
        loadConversations();
      }
    }
  }, [visible, userLocation, activeRadius]);

  const loadConversations = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      const { supabase } = await import('../../lib/supabase');
      const { data, error } = await supabase.rpc('get_nearby_league_conversations', {
        p_user_latitude: userLocation.latitude,
        p_user_longitude: userLocation.longitude,
        p_radius_miles: activeRadius,
      });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading league conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (conversationId: string, leagueName: string) => {
    setJoiningId(conversationId);
    try {
      await onJoinConversation(conversationId, leagueName);
      await loadConversations();
    } catch (error) {
      console.error('Error joining conversation:', error);
    } finally {
      setJoiningId(null);
    }
  };

  const handleUpdateRadius = () => {
    const radius = parseInt(customRadius, 10);
    if (!isNaN(radius) && radius > 0 && radius <= 500) {
      setActiveRadius(radius);
    }
  };

  const handleLocationSet = async (latitude: number, longitude: number, radius: number) => {
    await onLocationUpdate(latitude, longitude, radius);
    setActiveRadius(radius);
    setCustomRadius(radius.toString());
    setShowLocationSetup(false);
  };

  const renderConversation = (conv: LeagueConversation) => (
    <Card key={conv.conversation_id} style={styles.conversationCard}>
      <View style={styles.conversationHeader}>
        <Text style={styles.leagueName}>{conv.league_name}</Text>
        {conv.is_member && (
          <Badge label="Joined" variant="success" size="sm" />
        )}
      </View>

      <View style={styles.conversationDetails}>
        <View style={styles.detailRow}>
          <MapPin size={16} color={Colors.neutral[400]} />
          <Text style={styles.detailText}>
            {conv.league_location} • {conv.distance_miles.toFixed(1)} mi away
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Users size={16} color={Colors.neutral[400]} />
          <Text style={styles.detailText}>
            {conv.participant_count} {conv.participant_count === 1 ? 'member' : 'members'}
          </Text>
        </View>
      </View>

      <View style={styles.conversationActions}>
        {conv.is_member ? (
          <Button
            title="View Chat"
            onPress={() => {
              onNavigateToConversation(conv.conversation_id);
              onClose();
            }}
            variant="primary"
            size="sm"
          />
        ) : (
          <Button
            title="Join Conversation"
            onPress={() => handleJoin(conv.conversation_id, conv.league_name)}
            variant="outline"
            size="sm"
            loading={joiningId === conv.conversation_id}
            disabled={joiningId !== null}
          />
        )}
      </View>
    </Card>
  );

  const renderContent = () => {
    if (showLocationSetup) {
      return <LocationSetupForm onLocationSet={handleLocationSet} />;
    }

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Finding league conversations...</Text>
        </View>
      );
    }

    if (conversations.length === 0) {
      return (
        <View style={styles.messageContainer}>
          <MessageCircle size={48} color={Colors.neutral[600]} />
          <Text style={styles.messageTitle}>No League Chats Found</Text>
          <Text style={styles.messageText}>
            There are no league conversations within {activeRadius} miles of your location.
            Try increasing your search radius.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {conversations.map(renderConversation)}
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>League Conversations</Text>
              <Text style={styles.subtitle}>
                Join chats for leagues in your area
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.neutral[100]} />
            </TouchableOpacity>
          </View>

          {userLocation && !showLocationSetup && (
            <View style={styles.radiusControl}>
              <View style={styles.radiusHeader}>
                <Text style={styles.radiusLabel}>Search Radius (miles):</Text>
                <TouchableOpacity onPress={() => setShowLocationSetup(true)}>
                  <Text style={styles.changeLocationLink}>Change Location</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.radiusInput}>
                <RNTextInput
                  style={styles.radiusTextInput}
                  value={customRadius}
                  onChangeText={setCustomRadius}
                  keyboardType="number-pad"
                  placeholder="25"
                  placeholderTextColor={Colors.neutral[500]}
                />
                <Button
                  title="Update"
                  onPress={handleUpdateRadius}
                  variant="primary"
                  size="sm"
                  disabled={loading}
                />
              </View>
            </View>
          )}

          <View style={styles.content}>
            {renderContent()}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.neutral[900],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.neutral[50],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.neutral[400],
  },
  closeButton: {
    padding: Spacing.xs,
  },
  radiusControl: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  radiusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  radiusLabel: {
    ...Typography.body,
    color: Colors.neutral[300],
    fontFamily: 'Inter-Medium',
  },
  changeLocationLink: {
    ...Typography.body,
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[500],
    fontFamily: 'Inter-Medium',
  },
  radiusInput: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  radiusTextInput: {
    flex: 1,
    backgroundColor: Colors.neutral[800],
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.neutral[50],
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  content: {
    flex: 1,
  },
  conversationsList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  conversationCard: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.neutral[800],
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  leagueName: {
    ...Typography.h4,
    color: Colors.neutral[50],
    flex: 1,
    marginRight: Spacing.sm,
  },
  conversationDetails: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    ...Typography.body,
    color: Colors.neutral[400],
    fontSize: Typography.fontSize.sm,
  },
  conversationActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.neutral[400],
    marginTop: Spacing.md,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl * 2,
  },
  messageTitle: {
    ...Typography.h3,
    color: Colors.neutral[100],
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  messageText: {
    ...Typography.body,
    color: Colors.neutral[400],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
});
