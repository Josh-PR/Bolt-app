import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { Header } from '../../components/ui/Header';
import { ConversationCard } from '../../components/ui/ConversationCard';
import { Button } from '../../components/ui/Button';
import { LeagueConversationsModal } from '../../components/ui/LeagueConversationsModal';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export default function MessagesScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { conversations, loading, loadConversations, setActiveConversation, joinLeagueConversation } = useChat();
  const [refreshing, setRefreshing] = React.useState(false);
  const [showLeagueModal, setShowLeagueModal] = React.useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const handleConversationPress = (conversation: any) => {
    setActiveConversation(conversation);
    router.push(`/chat/${conversation.id}`);
  };

  const handleJoinLeagueConversation = async (conversationId: string, leagueName: string) => {
    try {
      await joinLeagueConversation(conversationId);
    } catch (error) {
      console.error('Failed to join league conversation:', error);
    }
  };

  const handleNavigateToConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setActiveConversation(conversation);
      router.push(`/chat/${conversationId}`);
    }
  };

  const handleLocationUpdate = async (latitude: number, longitude: number, searchRadius: number) => {
    try {
      const { supabase } = await import('../../lib/supabase');
      const { error } = await supabase
        .from('users')
        .update({
          location_latitude: latitude,
          location_longitude: longitude,
          search_radius_miles: searchRadius,
        })
        .eq('id', profile?.id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update location:', error);
      throw error;
    }
  };

  const userLocation = profile?.location_latitude && profile?.location_longitude
    ? { latitude: profile.location_latitude, longitude: profile.location_longitude }
    : null;

  const getConversationTitle = (conversation: any) => {
    if (conversation.type === 'team') {
      return conversation.title || conversation.team_name || 'Team Chat';
    }

    const otherParticipant = conversation.participants?.find(
      (p: any) => p.user_id !== profile?.id
    );
    return otherParticipant?.full_name || 'Direct Message';
  };

  const getConversationAvatar = (conversation: any) => {
    if (conversation.type === 'team') {
      return null;
    }

    const otherParticipant = conversation.participants?.find(
      (p: any) => p.user_id !== profile?.id
    );
    return otherParticipant?.avatar_url || null;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No conversations yet</Text>
      <Text style={styles.emptyStateText}>
        Start chatting with your teammates or send a direct message to connect with other players.
      </Text>
    </View>
  );

  const renderConversation = ({ item }: { item: any }) => {
    const title = getConversationTitle(item);
    const avatarUrl = getConversationAvatar(item);
    const lastMessage = item.last_message?.content || '';
    const lastMessageTime = item.last_message_at;

    return (
      <ConversationCard
        title={title}
        lastMessage={lastMessage}
        lastMessageTime={lastMessageTime}
        unreadCount={item.unread_count}
        avatarUrl={avatarUrl}
        isTeamChat={item.type === 'team'}
        onPress={() => handleConversationPress(item)}
      />
    );
  };

  if (loading && conversations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Messages" showBackButton={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Messages" showBackButton={false} />

      <View style={styles.actionsBar}>
        <Button
          title="Find League Chats"
          onPress={() => setShowLeagueModal(true)}
          variant="outline"
          size="sm"
          icon={<MapPin size={18} color={Colors.primary[500]} />}
          style={styles.leagueButton}
        />
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={conversations.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary[500]}
            colors={[Colors.primary[500]]}
          />
        }
      />

      <LeagueConversationsModal
        visible={showLeagueModal}
        onClose={() => setShowLeagueModal(false)}
        onJoinConversation={handleJoinLeagueConversation}
        onNavigateToConversation={handleNavigateToConversation}
        onLocationUpdate={handleLocationUpdate}
        userLocation={userLocation}
        searchRadius={profile?.search_radius_miles || 25}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[950],
  },
  actionsBar: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  leagueButton: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyStateTitle: {
    ...Typography.h2,
    color: Colors.neutral[100],
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyStateText: {
    ...Typography.body,
    color: Colors.neutral[400],
    textAlign: 'center',
    lineHeight: 24,
  },
});
