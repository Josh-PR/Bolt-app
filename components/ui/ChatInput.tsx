import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Send, Image as ImageIcon } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface ChatInputProps {
  onSend: (message: string) => void;
  onImagePress?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onImagePress,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {onImagePress && (
            <TouchableOpacity
              onPress={onImagePress}
              style={styles.iconButton}
              disabled={disabled}
            >
              <ImageIcon size={24} color={disabled ? Colors.neutral[600] : Colors.neutral[400]} />
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder}
            placeholderTextColor={Colors.neutral[500]}
            multiline
            maxLength={1000}
            editable={!disabled}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />

          <TouchableOpacity
            onPress={handleSend}
            style={[
              styles.sendButton,
              (!message.trim() || disabled) && styles.sendButtonDisabled,
            ]}
            disabled={!message.trim() || disabled}
          >
            <Send
              size={20}
              color={message.trim() && !disabled ? Colors.primary[500] : Colors.neutral[600]}
              fill={message.trim() && !disabled ? Colors.primary[500] : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral[900],
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[800],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.neutral[800],
    borderRadius: 24,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minHeight: 44,
  },
  iconButton: {
    padding: Spacing.xs,
    marginRight: Spacing.xxs,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.neutral[100],
    maxHeight: 100,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  sendButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xxs,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
