import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useAuth } from './AuthContext';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type ConversationParticipant = Database['public']['Tables']['conversation_participants']['Row'];

export interface ConversationWithDetails extends Conversation {
  unread_count?: number;
  last_message?: Message;
  participants?: Array<{
    user_id: string;
    full_name: string;
    avatar_url: string | null;
  }>;
  team_name?: string;
}

export interface MessageWithSender extends Message {
  sender?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface ChatContextType {
  conversations: ConversationWithDetails[];
  activeConversation: ConversationWithDetails | null;
  messages: MessageWithSender[];
  loading: boolean;
  totalUnreadCount: number;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, messageType?: 'text' | 'image' | 'system', imageUrl?: string) => Promise<void>;
  createDirectConversation: (otherUserId: string) => Promise<string>;
  createTeamConversation: (teamId: string, teamName: string) => Promise<string>;
  joinLeagueConversation: (conversationId: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  setActiveConversation: (conversation: ConversationWithDetails | null) => void;
  subscribeToConversation: (conversationId: string) => void;
  unsubscribeFromConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationWithDetails | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [conversationChannel, setConversationChannel] = useState<RealtimeChannel | null>(null);

  const loadConversations = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participantError) throw participantError;

      const conversationIds = participantData.map(p => p.conversation_id);

      if (conversationIds.length === 0) {
        setConversations([]);
        setTotalUnreadCount(0);
        return;
      }

      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          *,
          teams (
            name
          )
        `)
        .in('id', conversationIds)
        .order('last_message_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      const conversationsWithDetails = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const { data: participantsData } = await supabase
            .from('conversation_participants')
            .select(`
              user_id,
              users (
                id,
                full_name,
                avatar_url
              )
            `)
            .eq('conversation_id', conv.id);

          const { data: unreadData } = await supabase
            .rpc('get_unread_count', {
              p_conversation_id: conv.id,
              p_user_id: user.id
            });

          const participants = participantsData?.map(p => ({
            user_id: (p.users as any)?.id || '',
            full_name: (p.users as any)?.full_name || 'Unknown',
            avatar_url: (p.users as any)?.avatar_url || null,
          })) || [];

          return {
            ...conv,
            last_message: lastMessageData || undefined,
            participants,
            unread_count: unreadData || 0,
            team_name: (conv.teams as any)?.name || undefined,
          };
        })
      );

      setConversations(conversationsWithDetails);

      const totalUnread = conversationsWithDetails.reduce(
        (sum, conv) => sum + (conv.unread_count || 0),
        0
      );
      setTotalUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          users (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      const messagesWithSender = messagesData.map(msg => ({
        ...msg,
        sender: {
          id: (msg.users as any)?.id || '',
          full_name: (msg.users as any)?.full_name || 'Unknown',
          avatar_url: (msg.users as any)?.avatar_url || null,
        },
      }));

      setMessages(messagesWithSender);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    messageType: 'text' | 'image' | 'system' = 'text',
    imageUrl?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        message_type: messageType,
        image_url: imageUrl,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [user]);

  const createDirectConversation = useCallback(async (otherUserId: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.rpc('get_or_create_direct_conversation', {
        p_user1_id: user.id,
        p_user2_id: otherUserId,
      });

      if (error) throw error;

      await loadConversations();
      return data;
    } catch (error) {
      console.error('Error creating direct conversation:', error);
      throw error;
    }
  }, [user, loadConversations]);

  const createTeamConversation = useCallback(async (teamId: string, teamName: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data: existingConv, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('team_id', teamId)
        .eq('type', 'team')
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingConv) {
        return existingConv.id;
      }

      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          type: 'team',
          title: `${teamName} Team Chat`,
          team_id: teamId,
        })
        .select()
        .single();

      if (createError) throw createError;

      const { data: teamMembers, error: membersError } = await supabase
        .from('players')
        .select('user_id')
        .eq('team_id', teamId);

      if (membersError) throw membersError;

      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('manager_id')
        .eq('id', teamId)
        .single();

      if (teamError) throw teamError;

      const participantIds = [...new Set([
        ...teamMembers.map(m => m.user_id),
        team.manager_id
      ])];

      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(
          participantIds.map(userId => ({
            conversation_id: newConv.id,
            user_id: userId,
          }))
        );

      if (participantsError) throw participantsError;

      await loadConversations();
      return newConv.id;
    } catch (error) {
      console.error('Error creating team conversation:', error);
      throw error;
    }
  }, [user, loadConversations]);

  const joinLeagueConversation = useCallback(async (conversationId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
        });

      if (error) throw error;

      await loadConversations();
    } catch (error) {
      console.error('Error joining league conversation:', error);
      throw error;
    }
  }, [user, loadConversations]);

  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase.rpc('mark_messages_read', {
        p_conversation_id: conversationId,
        p_user_id: user.id,
      });

      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );

      setTotalUnreadCount(prev => {
        const conv = conversations.find(c => c.id === conversationId);
        return Math.max(0, prev - (conv?.unread_count || 0));
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, [user, conversations]);

  const subscribeToConversation = useCallback((conversationId: string) => {
    if (conversationChannel) {
      conversationChannel.unsubscribe();
    }

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const { data: senderData } = await supabase
            .from('users')
            .select('id, full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          const newMessage: MessageWithSender = {
            ...(payload.new as Message),
            sender: senderData || {
              id: payload.new.sender_id,
              full_name: 'Unknown',
              avatar_url: null,
            },
          };

          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    setConversationChannel(channel);
  }, [conversationChannel]);

  const unsubscribeFromConversation = useCallback(() => {
    if (conversationChannel) {
      conversationChannel.unsubscribe();
      setConversationChannel(null);
    }
  }, [conversationChannel]);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  useEffect(() => {
    return () => {
      if (conversationChannel) {
        conversationChannel.unsubscribe();
      }
    };
  }, [conversationChannel]);

  const value: ChatContextType = {
    conversations,
    activeConversation,
    messages,
    loading,
    totalUnreadCount,
    loadConversations,
    loadMessages,
    sendMessage,
    createDirectConversation,
    createTeamConversation,
    joinLeagueConversation,
    markAsRead,
    setActiveConversation,
    subscribeToConversation,
    unsubscribeFromConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
