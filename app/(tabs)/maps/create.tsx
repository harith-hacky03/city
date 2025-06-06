import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateRoomScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleSubmit = () => {
    // Reset errors
    setTitleError('');
    setDescriptionError('');

    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    // Validate description
    if (!description.trim()) {
      setDescriptionError('Description is required');
      return;
    }

    if (description.length > 50) {
      setDescriptionError('Description must be at most 50 characters');
      return;
    }

    // TODO: Handle room creation
    console.log('Creating room:', { title, description });
    
    // Navigate back to maps screen
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={1}
        >
          <FontAwesome name="arrow-left" size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Room</Text>
        <TouchableOpacity 
          style={[styles.createButton, (!title.trim() || !description.trim() || description.length > 50) && styles.createButtonDisabled]} 
          onPress={handleSubmit}
          disabled={!title.trim() || !description.trim() || description.length > 50}
          activeOpacity={1}
        >
          <Text style={[styles.createButtonText, (!title.trim() || !description.trim() || description.length > 50) && styles.createButtonTextDisabled]}>
            Create
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <View style={styles.inputBox}>
            <FontAwesome name="pencil" size={16} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter room title"
              placeholderTextColor="#999"
              maxLength={30}
            />
          </View>
          {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <View style={styles.inputBox}>
            <FontAwesome name="align-left" size={16} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter room description (max 50 chars)"
              placeholderTextColor="#999"
              maxLength={50}
              multiline
            />
          </View>
          <View style={styles.charCountContainer}>
            <Text style={[styles.charCount, description.length > 50 && styles.charCountError]}>
              {description.length}/50
            </Text>
          </View>
          {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}
        </View>
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  createButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonTextDisabled: {
    color: '#999',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  charCountContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#666',
  },
  charCountError: {
    color: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
}); 