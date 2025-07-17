import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from '@synapse/shared';
import { fetchUserAvatars, deleteAvatar } from '../utils/api';
import AvatarCard from '../components/AvatarCard';

export default function AvatarScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data: avatars, isLoading, error, refetch } = useQuery(
    'userAvatars',
    () => fetchUserAvatars('user_123'),
    {
      refetchInterval: 30000,
    }
  );

  const deleteAvatarMutation = useMutation(deleteAvatar, {
    onSuccess: () => {
      queryClient.invalidateQueries('userAvatars');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to delete avatar. Please try again.');
    },
  });

  const handleCreateAvatar = () => {
    navigation.navigate('AvatarCreator');
  };

  const handleDeleteAvatar = (avatarId: string) => {
    Alert.alert(
      'Delete Avatar',
      'Are you sure you want to delete this avatar? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAvatarMutation.mutate(avatarId),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading avatars...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Icon name="error" size={48} color="#ff4444" />
        <Text style={styles.errorText}>Failed to load avatars</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!avatars || avatars.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="account-circle" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>No avatars yet</Text>
        <Text style={styles.emptySubtitle}>
          Create your first AI-powered avatar to get started!
        </Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateAvatar}>
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Create Your First Avatar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Avatars</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleCreateAvatar}>
            <Icon name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarGrid}>
          {avatars.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              avatar={avatar}
              onDelete={() => handleDeleteAvatar(avatar.id)}
              onPress={() => {
                // TODO: Navigate to avatar detail view
                Alert.alert('Avatar Selected', `Selected avatar: ${avatar.id}`);
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreateAvatar}>
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});