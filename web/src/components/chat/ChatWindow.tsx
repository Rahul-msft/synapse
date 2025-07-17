import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Paper,
  List,
  ListItem,
  TextField,
  Button,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Mic as MicIcon
} from '@mui/icons-material';
import { Chat, ChatMessage, SmartReply } from '@synapse/shared';
import { Socket } from 'socket.io-client';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchChatMessages, sendMessage, getSmartReplies } from '../../utils/api';
import MessageBubble from './MessageBubble';
import SmartReplySuggestions from './SmartReplySuggestions';

interface ChatWindowProps {
  chat: Chat | null;
  onBack?: () => void;
  socket: Socket | null;
  isConnected: boolean;
}

function ChatWindow({ chat, onBack, socket, isConnected }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [smartReplies, setSmartReplies] = useState<SmartReply[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const queryClient = useQueryClient();

  // Fetch messages for the current chat
  const { data: messages, isLoading } = useQuery(
    ['messages', chat?.id],
    () => fetchChatMessages(chat!.id),
    {
      enabled: !!chat?.id,
      refetchInterval: 5000, // Poll for new messages
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    ({ chatId, content }: { chatId: string; content: string }) =>
      sendMessage(chatId, content),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', chat?.id]);
        setMessage('');
        setSmartReplies([]);
      },
    }
  );

  // Get smart replies mutation
  const getSmartRepliesMutation = useMutation(getSmartReplies, {
    onSuccess: (replies) => {
      setSmartReplies(replies);
    },
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !chat) return;

    const handleMessageReceived = (data: { message: ChatMessage }) => {
      queryClient.setQueryData(['messages', chat.id], (oldMessages: ChatMessage[] | undefined) => {
        return oldMessages ? [...oldMessages, data.message] : [data.message];
      });
    };

    const handleTypingStart = (data: { userId: string }) => {
      setTypingUsers(prev => 
        prev.includes(data.userId) ? prev : [...prev, data.userId]
      );
    };

    const handleTypingStop = (data: { userId: string }) => {
      setTypingUsers(prev => prev.filter(id => id !== data.userId));
    };

    socket.on('message_received', handleMessageReceived);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);

    return () => {
      socket.off('message_received', handleMessageReceived);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
    };
  }, [socket, chat, queryClient]);

  // Generate smart replies when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      getSmartRepliesMutation.mutate({
        messageHistory: messages.slice(-5), // Last 5 messages
        maxSuggestions: 3
      });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!chat || !message.trim()) return;

    sendMessageMutation.mutate({
      chatId: chat.id,
      content: message.trim()
    });

    // Emit message via socket
    if (socket) {
      socket.emit('message_sent', {
        chatId: chat.id,
        message: {
          content: message.trim(),
          senderId: 'user_123', // TODO: Get from auth
          timestamp: new Date()
        }
      });
    }

    // Stop typing
    handleStopTyping();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);

    if (!isTyping && value.trim()) {
      setIsTyping(true);
      if (socket && chat) {
        socket.emit('typing_start', { chatId: chat.id, userId: 'user_123' });
      }
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 3000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      if (socket && chat) {
        socket.emit('typing_stop', { chatId: chat.id, userId: 'user_123' });
      }
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSmartReplySelect = (reply: SmartReply) => {
    setMessage(reply.text);
  };

  if (!chat) {
    return (
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography variant="h6" color="text.secondary">
          Select a chat to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {onBack && (
            <IconButton edge="start" onClick={onBack} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Avatar sx={{ mr: 2 }}>
            {chat.isGroup ? '👥' : chat.name?.charAt(0) || '?'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">
              {chat.name || 'Unknown Chat'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isConnected ? 'Connected' : 'Connecting...'}
              {typingUsers.length > 0 && (
                <span> • {typingUsers.length === 1 ? 'Someone is' : 'People are'} typing...</span>
              )}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Messages List */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {messages?.map((msg) => (
              <ListItem key={msg.id} sx={{ px: 0 }}>
                <MessageBubble message={msg} />
              </ListItem>
            ))}
          </List>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Smart Reply Suggestions */}
      {smartReplies.length > 0 && (
        <SmartReplySuggestions
          suggestions={smartReplies}
          onSelect={handleSmartReplySelect}
        />
      )}

      {/* Message Input */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sendMessageMutation.isLoading}
          />
          <IconButton color="primary" size="large">
            <MicIcon />
          </IconButton>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isLoading}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ChatWindow;