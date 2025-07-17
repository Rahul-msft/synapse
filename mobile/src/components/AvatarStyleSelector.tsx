import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { AVATAR_CONFIG, AvatarStyle } from '@synapse/shared';

interface AvatarStyleSelectorProps {
  style: Partial<AvatarStyle>;
  onStyleChange: (style: Partial<AvatarStyle>) => void;
}

export default function AvatarStyleSelector({ style, onStyleChange }: AvatarStyleSelectorProps) {
  const updateStyle = (field: keyof AvatarStyle, value: string | string[]) => {
    onStyleChange({ ...style, [field]: value });
  };

  const renderColorPalette = (
    label: string,
    colors: readonly string[],
    selectedColor: string | undefined,
    onSelect: (color: string) => void
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.colorPalette}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor,
              ]}
              onPress={() => onSelect(color)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderOptionSelector = (
    label: string,
    options: readonly string[],
    selectedOption: string | undefined,
    onSelect: (option: string) => void
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.optionRow}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionChip,
                selectedOption === option && styles.selectedChip,
              ]}
              onPress={() => onSelect(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option && styles.selectedText,
                ]}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderAccessorySelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Accessories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.optionRow}>
          {AVATAR_CONFIG.ACCESSORIES.map((accessory) => {
            const isSelected = style.accessories?.includes(accessory);
            return (
              <TouchableOpacity
                key={accessory}
                style={[
                  styles.optionChip,
                  isSelected && styles.selectedChip,
                ]}
                onPress={() => {
                  const current = style.accessories || [];
                  const newAccessories = isSelected
                    ? current.filter(a => a !== accessory)
                    : [...current, accessory];
                  updateStyle('accessories', newAccessories);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {accessory.charAt(0).toUpperCase() + accessory.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderOptionSelector(
        'Hair Style',
        AVATAR_CONFIG.HAIR_STYLES,
        style.hairStyle,
        (value) => updateStyle('hairStyle', value)
      )}

      {renderColorPalette(
        'Hair Color',
        AVATAR_CONFIG.HAIR_COLORS,
        style.hairColor,
        (value) => updateStyle('hairColor', value)
      )}

      {renderColorPalette(
        'Skin Color',
        AVATAR_CONFIG.SKIN_COLORS,
        style.skinColor,
        (value) => updateStyle('skinColor', value)
      )}

      {renderColorPalette(
        'Eye Color',
        AVATAR_CONFIG.EYE_COLORS,
        style.eyeColor,
        (value) => updateStyle('eyeColor', value)
      )}

      {renderOptionSelector(
        'Facial Hair',
        AVATAR_CONFIG.FACIAL_HAIR,
        style.facialHair,
        (value) => updateStyle('facialHair', value)
      )}

      {renderAccessorySelector()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedColor: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  optionChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});