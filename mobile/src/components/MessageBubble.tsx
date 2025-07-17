import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage, MessageStatus, getRelativeTime } from '@synapse/shared';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isOwnMessage = message.senderId === 'user_123'; // TODO: Get from auth context

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case MessageStatus.SENDING:
        return '⏳';
      case MessageStatus.SENT:
        return '✓';
      case MessageStatus.DELIVERED:
        return '✓✓';
      case MessageStatus.READ:
        return '✓✓';
      case MessageStatus.FAILED:
        return '❌';
      default:
        return '';
    }
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <Text style={[
          styles.messageText,
          isOwnMessage ? styles.ownText : styles.otherText
        ]}>
          {message.content}
        </Text>
      </View>
      
      <View style={[
        styles.metadata,
        isOwnMessage ? styles.ownMetadata : styles.otherMetadata
      ]}>
        <Text style={styles.timestamp}>
          {getRelativeTime(message.timestamp)}
        </Text>
        {isOwnMessage && (
          <Text style={[
            styles.status,
            message.status === MessageStatus.READ && styles.readStatus
          ]}>
            {getStatusIcon(message.status)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 4,
  },
  ownBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: '#fff',
  },
  otherText: {
    color: '#333',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  ownMetadata: {
    justifyContent: 'flex-end',
  },
  otherMetadata: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  status: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  readStatus: {
    color: '#007AFF',
  },
});