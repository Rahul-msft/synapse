import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SmartReply, ReplyCategory } from '@synapse/shared';

interface SmartReplySuggestionsProps {
  suggestions: SmartReply[];
  onSelect: (reply: SmartReply) => void;
}

export default function SmartReplySuggestions({ suggestions, onSelect }: SmartReplySuggestionsProps) {
  const getCategoryEmoji = (category: ReplyCategory) => {
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
    <Animated.View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🤖 Smart Replies</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={styles.suggestionChip}
            onPress={() => onSelect(suggestion)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>
              {getCategoryEmoji(suggestion.category)}
            </Text>
            <Text style={styles.suggestionText}>
              {suggestion.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emoji: {
    fontSize: 14,
    marginRight: 6,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});