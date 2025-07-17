import React from 'react';
import {
  Box,
  Chip,
  Typography,
  Slide
} from '@mui/material';
import { SmartReply, ReplyCategory } from '@synapse/shared';

interface SmartReplySuggestionsProps {
  suggestions: SmartReply[];
  onSelect: (reply: SmartReply) => void;
}

function SmartReplySuggestions({ suggestions, onSelect }: SmartReplySuggestionsProps) {
  const getCategoryColor = (category: ReplyCategory) => {
    switch (category) {
      case ReplyCategory.AGREEMENT:
        return 'success';
      case ReplyCategory.QUESTION:
        return 'info';
      case ReplyCategory.RESPONSE:
        return 'primary';
      case ReplyCategory.GREETING:
        return 'secondary';
      case ReplyCategory.FAREWELL:
        return 'warning';
      case ReplyCategory.EMOJI:
        return 'default';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category: ReplyCategory) => {
    switch (category) {
      case ReplyCategory.AGREEMENT:
        return '✅';
      case ReplyCategory.QUESTION:
        return '❓';
      case ReplyCategory.RESPONSE:
        return '💬';
      case ReplyCategory.GREETING:
        return '👋';
      case ReplyCategory.FAREWELL:
        return '👋';
      case ReplyCategory.EMOJI:
        return '😊';
      default:
        return '💭';
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          🤖 Smart Reply Suggestions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {suggestions.map((suggestion) => (
            <Chip
              key={suggestion.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>{getCategoryIcon(suggestion.category)}</span>
                  <span>{suggestion.text}</span>
                </Box>
              }
              onClick={() => onSelect(suggestion)}
              color={getCategoryColor(suggestion.category)}
              variant="outlined"
              clickable
              sx={{
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Slide>
  );
}

export default SmartReplySuggestions;