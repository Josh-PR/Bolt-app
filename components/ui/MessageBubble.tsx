import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface MessageBubbleProps {
  content: string | null;
  senderName: string;
  senderAvatar: string | null;
  timestamp: string;
  isOwn: boolean;
  messageType: 'text' | 'image' | 'system';
  imageUrl?: string | null;
  onImagePress?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  senderName,
  senderAvatar,
  timestamp,
  isOwn,
  messageType,
  imageUrl,
  onImagePress,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  if (messageType === 'system') {
    return (
      <View style={styles.systemMessageContainer}>
        <Text style={styles.systemMessageText}>{content}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      {!isOwn && (
        <View style={styles.avatarContainer}>
          {senderAvatar ? (
            <Image source={{ uri: senderAvatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarPlaceholderText}>
                {senderName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        {!isOwn && <Text style={styles.senderName}>{senderName}</Text>}

        {messageType === 'image' && imageUrl ? (
          <TouchableOpacity onPress={onImagePress} activeOpacity={0.8}>
            <Image source={{ uri: imageUrl }} style={styles.messageImage} />
          </TouchableOpacity>
        ) : null}

        {content ? (
          <Text style={[styles.messageText, isOwn ? styles.ownMessageText : styles.otherMessageText]}>
            {content}
          </Text>
        ) : null}

        <Text style={[styles.timestamp, isOwn ? styles.ownTimestamp : styles.otherTimestamp]}>
          {formatTime(timestamp)}
        </Text>
      </View>

      {isOwn && <View style={styles.avatarSpacer} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  ownContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: Spacing.xs,
    marginTop: Spacing.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: Colors.neutral[50],
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  avatarSpacer: {
    width: 40,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: Colors.primary[700],
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: Colors.neutral[800],
    borderBottomLeftRadius: 4,
  },
  senderName: {
    ...Typography.caption,
    color: Colors.primary[400],
    marginBottom: Spacing.xxs,
    fontFamily: 'Inter-SemiBold',
  },
  messageText: {
    ...Typography.body,
    lineHeight: 20,
  },
  ownMessageText: {
    color: Colors.neutral[50],
  },
  otherMessageText: {
    color: Colors.neutral[100],
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: Spacing.xs,
  },
  timestamp: {
    ...Typography.caption,
    fontSize: 11,
    marginTop: Spacing.xxs,
  },
  ownTimestamp: {
    color: Colors.neutral[300],
    textAlign: 'right',
  },
  otherTimestamp: {
    color: Colors.neutral[400],
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  systemMessageText: {
    ...Typography.caption,
    color: Colors.neutral[400],
    fontStyle: 'italic',
  },
});
