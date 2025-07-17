import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Chat } from '@synapse/shared';
import { getRelativeTime } from '../../utils/dateUtils';
import { useQuery } from 'react-query';
import { fetchChats } from '../../utils/api';

interface ChatListProps {
  onChatSelect: (chat: Chat) => void;
  selectedChatId?: string;
}

function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: chats, isLoading, error } = useQuery(
    'chats',
    fetchChats,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const filteredChats = chats?.filter(chat =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">
          Failed to load chats. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', py: 0 }}>
        {filteredChats.map((chat, index) => (
          <React.Fragment key={chat.id}>
            <ListItem
              button
              selected={chat.id === selectedChatId}
              onClick={() => onChatSelect(chat)}
              sx={{
                py: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemText-secondary': {
                    color: 'primary.contrastText',
                    opacity: 0.8
                  }
                }
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  {chat.isGroup ? '👥' : chat.name?.charAt(0) || '?'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" noWrap>
                    {chat.name || 'Unknown Chat'}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" noWrap sx={{ mb: 0.5 }}>
                      {chat.lastMessage?.content || 'No messages yet'}
                    </Typography>
                    <Typography variant="caption">
                      {chat.lastMessage ? 
                        getRelativeTime(chat.lastMessage.timestamp) : 
                        getRelativeTime(chat.createdAt)
                      }
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < filteredChats.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        {filteredChats.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {searchQuery ? 'No chats found matching your search.' : 'No chats yet. Start a new conversation!'}
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
}

export default ChatList;