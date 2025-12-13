import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../../components/ui/Header';
import { ConversationCard } from '../../../components/ui/ConversationCard';
import { useChat } from '../../../contexts/ChatContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Colors } from '../../../constants/Colors';
import { Typography } from '../../../constants/Typography';
import { Spacing } from '../../../constants/Spacing';

export default function ManagerMessagesScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { conversations, loading, loadConversations, setActiveConversation } = useChat();
  const [refreshing, setRefreshing] = React.useState(false);

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
        Start chatting with your team members or reach out to players and other managers.
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[950],
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
