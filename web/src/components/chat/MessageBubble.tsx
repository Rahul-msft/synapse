import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Chip
} from '@mui/material';
import { ChatMessage } from '@synapse/shared';
import { MessageStatus } from '../../utils/messageTypes';
import { getRelativeTime } from '../../utils/dateUtils';

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isOwnMessage = message.senderId === 'user_123'; // TODO: Get from auth context

  const getStatusColor = (status: MessageStatus) => {
    switch (status) {
      case MessageStatus.SENDING:
        return 'warning';
      case MessageStatus.SENT:
        return 'info';
      case MessageStatus.DELIVERED:
        return 'primary';
      case MessageStatus.READ:
        return 'success';
      case MessageStatus.FAILED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: MessageStatus) => {
    switch (status) {
      case MessageStatus.SENDING:
        return 'Sending...';
      case MessageStatus.SENT:
        return 'Sent';
      case MessageStatus.DELIVERED:
        return 'Delivered';
      case MessageStatus.READ:
        return 'Read';
      case MessageStatus.FAILED:
        return 'Failed';
      default:
        return '';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        mb: 1,
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isOwnMessage ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          maxWidth: '70%',
          gap: 1
        }}
      >
        {!isOwnMessage && (
          <Avatar sx={{ width: 32, height: 32 }}>
            {message.senderId.charAt(0).toUpperCase()}
          </Avatar>
        )}
        
        <Box>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              backgroundColor: isOwnMessage ? 'primary.main' : 'grey.100',
              color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
              borderTopRightRadius: isOwnMessage ? 0.5 : 2,
              borderTopLeftRadius: isOwnMessage ? 2 : 0.5,
            }}
          >
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
              {message.content}
            </Typography>
          </Paper>
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
              alignItems: 'center',
              mt: 0.5,
              gap: 1
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {getRelativeTime(message.timestamp)}
            </Typography>
            
            {isOwnMessage && (
              <Chip
                label={getStatusText(message.status)}
                size="small"
                color={getStatusColor(message.status)}
                variant="outlined"
                sx={{ height: 20, fontSize: '0.6rem' }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MessageBubble;