import { FontAwesome } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_PADDING = Math.min(SCREEN_WIDTH * 0.04, 20);
const FONT_SIZE = {
  title: Math.min(SCREEN_WIDTH * 0.07, 24),
  header: Math.min(SCREEN_WIDTH * 0.07, 24),
  content: Math.min(SCREEN_WIDTH * 0.04, 16),
  meta: Math.min(SCREEN_WIDTH * 0.035, 14),
  tag: Math.min(SCREEN_WIDTH * 0.035, 14),
};

const filterTags = [
  "Events", "Arts", "Food", "Transport", "Parks", "Development",
  "Local", "Infrastructure", "Community", "Education", "Health",
  "Sports", "Entertainment", "Shopping", "Environment"
];

export default function AddPostScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        // Create a permanent file in the app's document directory
        const fileName = result.assets[0].uri.split('/').pop();
        const newPath = `${FileSystem.documentDirectory}${fileName}`;
        
        // Copy the file to the permanent location
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: newPath
        });

        setImage(newPath);
      } catch (error) {
        alert('Error saving image. Please try again.');
      }
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newPost = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      content: content.trim(),
      image: image || null,
      tags: selectedTags,
      location: location.trim(),
      author: "You",
      timestamp: "Just now",
      upvotes: 0,
      comments: 0,
      createdAt: new Date(),
      engagement: 0
    };

    // Pass the new post back to the main screen
    router.back();
    router.push({
      pathname: "/routes/city-talk",
      params: { newPost: JSON.stringify(newPost) }
    });
  };

  const filteredTags = filterTags.filter(tag => 
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Post</Text>
        <TouchableOpacity 
          style={[styles.submitButton, (!title.trim() || !content.trim()) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!title.trim() || !content.trim()}
        >
          <Text style={[styles.submitButtonText, (!title.trim() || !content.trim()) && styles.submitButtonTextDisabled]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="What's happening in your city?"
            placeholderTextColor="#666"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
          <TextInput
            style={styles.locationInput}
            placeholder="Location (optional)"
            placeholderTextColor="#666"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <FontAwesome name="times-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.tagsContainer}>
          <Text style={styles.tagsTitle}>Add Tags</Text>
          <View style={styles.tagSearchContainer}>
            <FontAwesome name="search" size={16} color="#666" style={styles.tagSearchIcon} />
            <TextInput
              style={styles.tagSearchInput}
              placeholder="Search tags..."
              placeholderTextColor="#666"
              value={tagSearch}
              onChangeText={setTagSearch}
            />
            {tagSearch ? (
              <TouchableOpacity 
                style={styles.clearTagSearchButton}
                onPress={() => setTagSearch('')}
              >
                <FontAwesome name="times-circle" size={16} color="#666" />
              </TouchableOpacity>
            ) : null}
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsList}
          >
            {filteredTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.tagSelected
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.tagTextSelected
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity 
          style={styles.addImageButton}
          onPress={pickImage}
        >
          <FontAwesome name="camera" size={20} color="#007AFF" />
          <Text style={styles.addImageText}>
            {image ? 'Change Image' : 'Add Image'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.02, 12),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  headerTitle: {
    fontSize: FONT_SIZE.header,
    fontWeight: '600',
    color: '#000',
  },
  submitButton: {
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.01, 8),
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    backgroundColor: '#007AFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: FONT_SIZE.meta,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#666',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: CARD_PADDING,
    paddingBottom: Math.max(SCREEN_HEIGHT * 0.3, 200),
  },
  inputContainer: {
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
  },
  titleInput: {
    fontSize: FONT_SIZE.title,
    fontWeight: '600',
    color: '#000',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
    padding: 0,
  },
  contentInput: {
    fontSize: FONT_SIZE.content,
    color: '#000',
    minHeight: Math.min(SCREEN_HEIGHT * 0.2, 150),
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
    padding: 0,
  },
  locationInput: {
    fontSize: FONT_SIZE.meta,
    color: '#000',
    padding: 0,
  },
  imageContainer: {
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
    borderRadius: Math.min(SCREEN_WIDTH * 0.03, 12),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: Math.min(SCREEN_HEIGHT * 0.25, 200),
    borderRadius: Math.min(SCREEN_WIDTH * 0.03, 12),
  },
  removeImageButton: {
    position: 'absolute',
    top: Math.min(SCREEN_HEIGHT * 0.01, 8),
    right: Math.min(SCREEN_WIDTH * 0.02, 8),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: Math.min(SCREEN_WIDTH * 0.03, 12),
    padding: Math.min(SCREEN_WIDTH * 0.01, 4),
  },
  tagsContainer: {
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
  },
  tagsTitle: {
    fontSize: FONT_SIZE.meta,
    fontWeight: '600',
    color: '#000',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
  },
  tagSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.03, 12),
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
    height: Math.min(SCREEN_HEIGHT * 0.045, 40),
  },
  tagSearchIcon: {
    marginRight: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  tagSearchInput: {
    flex: 1,
    fontSize: FONT_SIZE.meta,
    color: '#000',
    padding: 0,
  },
  clearTagSearchButton: {
    padding: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  tagsList: {
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.01, 8),
    gap: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.012, 10),
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    marginRight: Math.min(SCREEN_WIDTH * 0.02, 8),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tagSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tagText: {
    color: '#007AFF',
    fontSize: FONT_SIZE.tag,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: '#fff',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Math.min(SCREEN_HEIGHT * 0.015, 12),
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
  },
  addImageText: {
    color: '#007AFF',
    fontSize: FONT_SIZE.meta,
    fontWeight: '600',
    marginLeft: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
}); 