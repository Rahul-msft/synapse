import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PhotoUploaderProps {
  onUpload: (formData: FormData) => void;
  isLoading?: boolean;
}

export default function PhotoUploader({ onUpload, isLoading = false }: PhotoUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);

  const selectImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setSelectedImage(asset.uri || null);
        setImageFile(asset);
      }
    });
  };

  const handleUpload = () => {
    if (!imageFile) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('photo', {
      uri: imageFile.uri,
      type: imageFile.type,
      name: imageFile.fileName || 'avatar-photo.jpg',
    } as any);
    formData.append('userId', 'user_123'); // TODO: Get from auth context

    onUpload(formData);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.uploadArea}
        onPress={selectImage}
        disabled={isLoading}
      >
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderContent}>
            <Icon name="photo-camera" size={48} color="#ccc" />
            <Text style={styles.placeholderText}>Tap to select a photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {selectedImage && (
        <View style={styles.imageInfo}>
          <Text style={styles.infoText}>
            Selected: {imageFile?.fileName || 'Image selected'}
          </Text>
          {imageFile?.fileSize && (
            <Text style={styles.sizeText}>
              Size: {(imageFile.fileSize / 1024 / 1024).toFixed(2)} MB
            </Text>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={selectImage}
          disabled={isLoading}
        >
          <Icon name="photo-library" size={20} color="#007AFF" />
          <Text style={styles.selectButtonText}>
            {selectedImage ? 'Change Photo' : 'Select Photo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedImage || isLoading) && styles.disabledButton
          ]}
          onPress={handleUpload}
          disabled={!selectedImage || isLoading}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.uploadButtonText}>Processing...</Text>
            </>
          ) : (
            <>
              <Icon name="cloud-upload" size={20} color="#fff" />
              <Text style={styles.uploadButtonText}>Create Avatar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>📸 Photo Tips:</Text>
        <Text style={styles.tipText}>• Use a clear, well-lit photo</Text>
        <Text style={styles.tipText}>• Face should be clearly visible</Text>
        <Text style={styles.tipText}>• Avoid sunglasses or hats</Text>
        <Text style={styles.tipText}>• Higher quality photos work better</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  uploadArea: {
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContent: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  imageInfo: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sizeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  selectButton: {
    flexDirection: 'row',
    backgroundColor: '#f0f8ff',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  selectButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 2,
  },
});