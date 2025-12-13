import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../components/ui/Header';
import { MessageBubble } from '../../components/ui/MessageBubble';
import { ChatInput } from '../../components/ui/ChatInput';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const {
    messages,
    activeConversation,
    loading,
    loadMessages,
    sendMessage,
    markAsRead,
    subscribeToConversation,
    unsubscribeFromConversation,
  } = useChat();

  const flatListRef = useRef<FlatList>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadMessages(id);
      subscribeToConversation(id);
      markAsRead(id);

      return () => {
        unsubscribeFromConversation();
      };
    }
  }, [id]);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!id || typeof id !== 'string' || sending) return;

    try {
      setSending(true);
      await sendMessage(id, content);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      console.error('Send message error:', error);
    } finally {
      setSending(false);
    }
  };

  const getConversationTitle = () => {
    if (!activeConversation) return 'Chat';

    if (activeConversation.type === 'team') {
      return activeConversation.title || activeConversation.team_name || 'Team Chat';
    }

    const otherParticipant = activeConversation.participants?.find(
      (p: any) => p.user_id !== profile?.id
    );
    return otherParticipant?.full_name || 'Direct Message';
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isOwn = item.sender_id === user?.id;

    return (
      <MessageBubble
        content={item.content}
        senderName={item.sender?.full_name || 'Unknown'}
        senderAvatar={item.sender?.avatar_url}
        timestamp={item.created_at}
        isOwn={isOwn}
        messageType={item.message_type}
        imageUrl={item.image_url}
      />
    );
  };

  const renderDateSeparator = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateText = '';
    if (messageDate.toDateString() === today.toDateString()) {
      dateText = 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      dateText = 'Yesterday';
    } else {
      dateText = messageDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }

    return (
      <View style={styles.dateSeparator}>
        <View style={styles.dateLine} />
        <View style={styles.dateTextContainer}>
          <Text style={styles.dateText}>{dateText}</Text>
        </View>
        <View style={styles.dateLine} />
      </View>
    );
  };

  const groupedMessages = messages.reduce((groups: any[], message: any, index: number) => {
    const messageDate = new Date(message.created_at).toDateString();
    const prevMessageDate =
      index > 0 ? new Date(messages[index - 1].created_at).toDateString() : null;

    if (messageDate !== prevMessageDate) {
      groups.push({ type: 'date', date: message.created_at });
    }

    groups.push({ type: 'message', data: message });
    return groups;
  }, []);

  if (loading && messages.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={getConversationTitle()} onBackPress={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Header title={getConversationTitle()} onBackPress={() => router.back()} />

        <FlatList
          ref={flatListRef}
          data={groupedMessages}
          renderItem={({ item }) => {
            if (item.type === 'date') {
              return renderDateSeparator(item.date);
            }
            return renderMessage({ item: item.data });
          }}
          keyExtractor={(item, index) =>
            item.type === 'date' ? `date-${index}` : item.data.id
          }
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <ChatInput onSend={handleSend} disabled={sending} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[950],
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    paddingVertical: Spacing.md,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral[800],
  },
  dateTextContainer: {
    paddingHorizontal: Spacing.md,
  },
  dateText: {
    fontSize: 12,
    color: Colors.neutral[400],
    fontFamily: 'Inter-Medium',
  },
});
