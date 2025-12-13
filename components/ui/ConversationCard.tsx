import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Users } from 'lucide-react-native';
import { Badge } from './Badge';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface ConversationCardProps {
  title: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  avatarUrl?: string | null;
  isTeamChat?: boolean;
  onPress: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  title,
  lastMessage,
  lastMessageTime,
  unreadCount = 0,
  avatarUrl,
  isTeamChat = false,
  onPress,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}/${day}`;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : isTeamChat ? (
          <View style={[styles.avatar, styles.teamAvatarPlaceholder]}>
            <Users size={24} color={Colors.neutral[100]} />
          </View>
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderText}>{title.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[styles.title, unreadCount > 0 && styles.titleUnread]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {lastMessageTime && (
            <Text style={[styles.time, unreadCount > 0 && styles.timeUnread]}>
              {formatTime(lastMessageTime)}
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text
            style={[styles.lastMessage, unreadCount > 0 && styles.lastMessageUnread]}
            numberOfLines={2}
          >
            {lastMessage || 'No messages yet'}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Badge text={unreadCount.toString()} variant="error" size="small" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.neutral[900],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamAvatarPlaceholder: {
    backgroundColor: Colors.secondary[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: Colors.neutral[50],
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxs,
  },
  title: {
    ...Typography.h4,
    color: Colors.neutral[100],
    flex: 1,
    marginRight: Spacing.sm,
  },
  titleUnread: {
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[50],
  },
  time: {
    ...Typography.caption,
    color: Colors.neutral[400],
  },
  timeUnread: {
    color: Colors.primary[400],
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    ...Typography.body,
    color: Colors.neutral[400],
    flex: 1,
    marginRight: Spacing.sm,
  },
  lastMessageUnread: {
    color: Colors.neutral[200],
    fontFamily: 'Inter-Medium',
  },
  badgeContainer: {
    marginLeft: Spacing.xs,
  },
});
