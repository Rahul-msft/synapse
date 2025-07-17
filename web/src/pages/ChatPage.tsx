import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import { useWebSocket } from '../hooks/useWebSocket';
import { Chat } from '@synapse/shared';

function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showChatList, setShowChatList] = useState(!chatId);

  // Initialize WebSocket connection
  const { socket, isConnected } = useWebSocket('http://localhost:8000');

  useEffect(() => {
    if (chatId && socket) {
      // Join the chat room
      socket.emit('join_chat', chatId);
      
      // TODO: Fetch chat details and set selectedChat
      // For now, create a mock chat
      setSelectedChat({
        id: chatId,
        participants: ['user_123', 'user_456'],
        name: 'Chat Room',
        isGroup: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      if (isMobile) {
        setShowChatList(false);
      }
    }
  }, [chatId, socket, isMobile]);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  if (isMobile) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {showChatList ? (
          <ChatList onChatSelect={handleChatSelect} />
        ) : (
          <ChatWindow
            chat={selectedChat}
            onBack={handleBackToList}
            socket={socket}
            isConnected={isConnected}
          />
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={4} sx={{ borderRight: 1, borderColor: 'divider' }}>
          <ChatList onChatSelect={handleChatSelect} selectedChatId={selectedChat?.id} />
        </Grid>
        <Grid item xs={8}>
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              socket={socket}
              isConnected={isConnected}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary'
              }}
            >
              Select a chat to start messaging
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChatPage;