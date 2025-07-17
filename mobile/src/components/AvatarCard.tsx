import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from '@synapse/shared';

interface AvatarCardProps {
  avatar: Avatar;
  onPress?: () => void;
  onDelete?: () => void;
}

export default function AvatarCard({ avatar, onPress, onDelete }: AvatarCardProps) {
  const handleDeletePress = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleLongPress = () => {
    Alert.alert(
      'Avatar Options',
      'What would you like to do with this avatar?',
      [
        {
          text: 'Download',
          onPress: () => {
            // TODO: Implement download functionality
            Alert.alert('Download', 'Download functionality coming soon!');
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDeletePress,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: avatar.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Quick action buttons - show on press/hover */}
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDeletePress}
          >
            <Icon name="delete" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.date}>
          {new Date(avatar.createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.styleInfo}>
          <View style={styles.styleItem}>
            <Text style={styles.styleLabel}>Hair:</Text>
            <Text style={styles.styleValue}>{avatar.style.hairStyle}</Text>
          </View>
          <View style={styles.styleItem}>
            <Text style={styles.styleLabel}>Eyes:</Text>
            <View style={[
              styles.colorDot,
              { backgroundColor: avatar.style.eyeColor }
            ]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  styleInfo: {
    gap: 4,
  },
  styleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  styleLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  styleValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});