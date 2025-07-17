import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ChatMessage, SmartReply, getRelativeTime } from '@synapse/shared';
import { fetchChatMessages, sendMessage, getSmartReplies } from '../utils/api';
import { useWebSocket } from '../hooks/useWebSocket';
import MessageBubble from '../components/MessageBubble';
import SmartReplySuggestions from '../components/SmartReplySuggestions';

type ChatScreenRouteProp = RouteProp<{
  Chat: { chatId: string; chatName: string };
}, 'Chat'>;

export default function ChatScreen() {
  const route = useRoute<ChatScreenRouteProp>();
  const { chatId } = route.params;
  const [message, setMessage] = useState('');
  const [smartReplies, setSmartReplies] = useState<SmartReply[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const queryClient = useQueryClient();

  // WebSocket connection
  const { socket, isConnected } = useWebSocket('http://localhost:8000');

  // Fetch messages
  const { data: messages, isLoading } = useQuery(
    ['messages', chatId],
    () => fetchChatMessages(chatId),
    {
      refetchInterval: 5000,
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    ({ chatId, content }: { chatId: string; content: string }) =>
      sendMessage(chatId, content),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', chatId]);
        setMessage('');
        setSmartReplies([]);
        scrollToBottom();
      },
    }
  );

  // Get smart replies mutation
  const getSmartRepliesMutation = useMutation(getSmartReplies, {
    onSuccess: (replies) => {
      setSmartReplies(replies);
    },
  });

  // Effects
  useEffect(() => {
    if (socket && chatId) {
      socket.emit('join_chat', chatId);
      return () => {
        socket.emit('leave_chat', chatId);
      };
    }
  }, [socket, chatId]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      getSmartRepliesMutation.mutate({
        messageHistory: messages.slice(-5),
        maxSuggestions: 3
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (data: { message: ChatMessage }) => {
      queryClient.setQueryData(['messages', chatId], (oldMessages: ChatMessage[] | undefined) => {
        return oldMessages ? [...oldMessages, data.message] : [data.message];
      });
      scrollToBottom();
    };

    socket.on('message_received', handleMessageReceived);

    return () => {
      socket.off('message_received', handleMessageReceived);
    };
  }, [socket, chatId, queryClient]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessageMutation.mutate({
      chatId,
      content: message.trim()
    });

    // Emit via socket
    if (socket) {
      socket.emit('message_sent', {
        chatId,
        message: {
          content: message.trim(),
          senderId: 'user_123',
          timestamp: new Date()
        }
      });
    }
  };

  const handleSmartReplySelect = (reply: SmartReply) => {
    setMessage(reply.text);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} />
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Connection Status */}
      {!isConnected && (
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionText}>Connecting...</Text>
        </View>
      )}

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages || []}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
      />

      {/* Smart Reply Suggestions */}
      {smartReplies.length > 0 && (
        <SmartReplySuggestions
          suggestions={smartReplies}
          onSelect={handleSmartReplySelect}
        />
      )}

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: message.trim() ? 1 : 0.5 }
            ]}
            onPress={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isLoading}
          >
            {sendMessageMutation.isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  connectionStatus: {
    backgroundColor: '#ff9500',
    paddingVertical: 4,
    alignItems: 'center',
  },
  connectionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});