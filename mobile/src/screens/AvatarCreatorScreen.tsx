import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from 'react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AVATAR_CONFIG, AvatarStyle } from '@synapse/shared';
import { generateAvatar, uploadAvatarPhoto } from '../utils/api';
import AvatarStyleSelector from '../components/AvatarStyleSelector';
import PhotoUploader from '../components/PhotoUploader';

export default function AvatarCreatorScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'style' | 'photo'>('style');
  const [avatarStyle, setAvatarStyle] = useState<Partial<AvatarStyle>>({});

  const generateAvatarMutation = useMutation(generateAvatar, {
    onSuccess: () => {
      queryClient.invalidateQueries('userAvatars');
      Alert.alert(
        'Avatar Created!',
        'Your new avatar has been generated successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    },
    onError: () => {
      Alert.alert('Error', 'Failed to generate avatar. Please try again.');
    },
  });

  const uploadPhotoMutation = useMutation(uploadAvatarPhoto, {
    onSuccess: () => {
      queryClient.invalidateQueries('userAvatars');
      Alert.alert(
        'Avatar Created!',
        'Your avatar has been created from your photo successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    },
    onError: () => {
      Alert.alert('Error', 'Failed to process photo. Please try again.');
    },
  });

  const handleGenerateAvatar = () => {
    generateAvatarMutation.mutate({
      userId: 'user_123',
      style: avatarStyle
    });
  };

  const handlePhotoUpload = (formData: FormData) => {
    uploadPhotoMutation.mutate(formData);
  };

  const handleRandomize = () => {
    setAvatarStyle({
      hairColor: AVATAR_CONFIG.HAIR_COLORS[Math.floor(Math.random() * AVATAR_CONFIG.HAIR_COLORS.length)],
      skinColor: AVATAR_CONFIG.SKIN_COLORS[Math.floor(Math.random() * AVATAR_CONFIG.SKIN_COLORS.length)],
      eyeColor: AVATAR_CONFIG.EYE_COLORS[Math.floor(Math.random() * AVATAR_CONFIG.EYE_COLORS.length)],
      hairStyle: AVATAR_CONFIG.HAIR_STYLES[Math.floor(Math.random() * AVATAR_CONFIG.HAIR_STYLES.length)],
      facialHair: AVATAR_CONFIG.FACIAL_HAIR[Math.floor(Math.random() * AVATAR_CONFIG.FACIAL_HAIR.length)],
      accessories: [AVATAR_CONFIG.ACCESSORIES[Math.floor(Math.random() * AVATAR_CONFIG.ACCESSORIES.length)]]
    });
  };

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'style' && styles.activeTab]}
          onPress={() => setActiveTab('style')}
        >
          <Icon 
            name="palette" 
            size={20} 
            color={activeTab === 'style' ? '#007AFF' : '#666'} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'style' && styles.activeTabText
          ]}>
            Style
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'photo' && styles.activeTab]}
          onPress={() => setActiveTab('photo')}
        >
          <Icon 
            name="photo-camera" 
            size={20} 
            color={activeTab === 'photo' ? '#007AFF' : '#666'} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'photo' && styles.activeTabText
          ]}>
            Photo
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'style' ? (
          <View style={styles.styleTab}>
            <View style={styles.header}>
              <Text style={styles.title}>Customize Your Avatar</Text>
              <TouchableOpacity style={styles.randomizeButton} onPress={handleRandomize}>
                <Icon name="shuffle" size={20} color="#007AFF" />
                <Text style={styles.randomizeText}>Randomize</Text>
              </TouchableOpacity>
            </View>

            <AvatarStyleSelector
              style={avatarStyle}
              onStyleChange={setAvatarStyle}
            />

            <TouchableOpacity
              style={[
                styles.generateButton,
                generateAvatarMutation.isLoading && styles.disabledButton
              ]}
              onPress={handleGenerateAvatar}
              disabled={generateAvatarMutation.isLoading}
            >
              {generateAvatarMutation.isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.buttonText}>Generating...</Text>
                </>
              ) : (
                <>
                  <Icon name="auto-fix-high" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Generate Avatar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoTab}>
            <Text style={styles.title}>Upload Your Photo</Text>
            <Text style={styles.subtitle}>
              Upload a photo and our AI will create a personalized avatar based on your features.
            </Text>

            <PhotoUploader
              onUpload={handlePhotoUpload}
              isLoading={uploadPhotoMutation.isLoading}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  styleTab: {
    padding: 16,
  },
  photoTab: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  randomizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  randomizeText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});