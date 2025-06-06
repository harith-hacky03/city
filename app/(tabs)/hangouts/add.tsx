import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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

const categories = ["Coffee", "Movies", "Dinner", "Shopping", "Adventure", "Cultural", "Sports", "Music", "Art", "Food"];

export default function AddHangoutScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ageStart, setAgeStart] = useState('');
  const [ageEnd, setAgeEnd] = useState('');
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const fileName = result.assets[0].uri.split('/').pop();
        const newPath = `${FileSystem.documentDirectory}${fileName}`;
        
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

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setDate(formatDate(selectedDate));
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedTime) {
      setSelectedTime(selectedTime);
      setTime(formatTime(selectedTime));
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !location.trim() || !date.trim() || !time.trim() || !selectedCategory || !ageStart.trim() || !ageEnd.trim() || !gender.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newHangout = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      date: date.trim(),
      time: time.trim(),
      image: image || null,
      category: selectedCategory,
      age: `${ageStart.trim()}-${ageEnd.trim()}`,
      gender: gender.trim(),
      attendees: 1,
      maxAttendees: 2,
      createdAt: new Date()
    };

    router.back();
    router.push({
      pathname: "/routes/hangouts",
      params: { newHangout: JSON.stringify(newHangout) }
    });
  };

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
        <Text style={styles.headerTitle}>Create Hangout</Text>
        <TouchableOpacity 
          style={[styles.submitButton, (!title.trim() || !description.trim() || !location.trim() || !date.trim() || !time.trim() || !selectedCategory || !ageStart.trim() || !ageEnd.trim() || !gender.trim()) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!title.trim() || !description.trim() || !location.trim() || !date.trim() || !time.trim() || !selectedCategory || !ageStart.trim() || !ageEnd.trim() || !gender.trim()}
        >
          <Text style={[styles.submitButtonText, (!title.trim() || !description.trim() || !location.trim() || !date.trim() || !time.trim() || !selectedCategory || !ageStart.trim() || !ageEnd.trim() || !gender.trim()) && styles.submitButtonTextDisabled]}>
            Create
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
          <View style={styles.inputBox}>
            <FontAwesome name="pencil" size={20} color="#007AFF" style={styles.inputIcon} />
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              placeholderTextColor="#666"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.inputBox}>
            <FontAwesome name="align-left" size={20} color="#007AFF" style={styles.inputIcon} />
            <TextInput
              style={styles.contentInput}
              placeholder="Describe your hangout..."
              placeholderTextColor="#666"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputBox}>
            <FontAwesome name="map-marker" size={20} color="#007AFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="#666"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <TouchableOpacity 
            style={styles.inputBox}
            onPress={() => setShowDatePicker(true)}
          >
            <FontAwesome name="calendar" size={20} color="#007AFF" style={styles.inputIcon} />
            <Text style={[styles.input, !date && styles.placeholderText]}>
              {date || 'Select Date'}
            </Text>
          </TouchableOpacity>

          {(showDatePicker || Platform.OS === 'ios') && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
              style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
            />
          )}

          <TouchableOpacity 
            style={styles.inputBox}
            onPress={() => setShowTimePicker(true)}
          >
            <FontAwesome name="clock-o" size={20} color="#007AFF" style={styles.inputIcon} />
            <Text style={[styles.input, !time && styles.placeholderText]}>
              {time || 'Select Time'}
            </Text>
          </TouchableOpacity>

          {(showTimePicker || Platform.OS === 'ios') && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
              style={Platform.OS === 'ios' ? styles.iosTimePicker : undefined}
            />
          )}

          <View style={styles.ageRangeContainer}>
            <Text style={styles.ageRangeLabel}>Age Range</Text>
            <View style={styles.ageRangeInputs}>
              <View style={[styles.inputBox, styles.ageInputBox]}>
                <FontAwesome name="user" size={20} color="#007AFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Min"
                  placeholderTextColor="#666"
                  value={ageStart}
                  onChangeText={setAgeStart}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <Text style={styles.ageRangeSeparator}>to</Text>
              <View style={[styles.inputBox, styles.ageInputBox]}>
                <TextInput
                  style={styles.input}
                  placeholder="Max"
                  placeholderTextColor="#666"
                  value={ageEnd}
                  onChangeText={setAgeEnd}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            </View>
          </View>

          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Gender</Text>
            <TouchableOpacity 
              style={styles.inputBox}
              onPress={() => setShowGenderPicker(true)}
            >
              <FontAwesome name="venus-mars" size={20} color="#007AFF" style={styles.inputIcon} />
              <Text style={[styles.input, !gender && styles.placeholderText]}>
                {gender || 'Select Gender'}
              </Text>
              <FontAwesome name="chevron-down" size={16} color="#666" style={styles.chevronIcon} />
            </TouchableOpacity>

            {showGenderPicker && (
              <View style={styles.genderOptionsContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.genderOption,
                      gender === option && styles.genderOptionSelected
                    ]}
                    onPress={() => {
                      setGender(option);
                      setShowGenderPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      gender === option && styles.genderOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
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

        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Select Category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.category,
                  selectedCategory === category && styles.categorySelected
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected
                ]}>
                  {category}
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
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.015, 12),
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputIcon: {
    marginRight: Math.min(SCREEN_WIDTH * 0.03, 12),
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.content,
    color: '#000',
    padding: 0,
  },
  titleInput: {
    flex: 1,
    fontSize: FONT_SIZE.title,
    fontWeight: '600',
    color: '#000',
    padding: 0,
  },
  contentInput: {
    flex: 1,
    fontSize: FONT_SIZE.content,
    color: '#000',
    minHeight: Math.min(SCREEN_HEIGHT * 0.2, 150),
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
  categoriesContainer: {
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
  },
  categoriesTitle: {
    fontSize: FONT_SIZE.meta,
    fontWeight: '600',
    color: '#000',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
  },
  categoriesList: {
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.01, 8),
    gap: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  category: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.012, 10),
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    marginRight: Math.min(SCREEN_WIDTH * 0.02, 8),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categorySelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    color: '#007AFF',
    fontSize: FONT_SIZE.tag,
    fontWeight: '600',
  },
  categoryTextSelected: {
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
  placeholderText: {
    color: '#666',
  },
  iosDatePicker: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  iosTimePicker: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  ageRangeContainer: {
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
  },
  ageRangeLabel: {
    fontSize: FONT_SIZE.meta,
    fontWeight: '600',
    color: '#000',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
  },
  ageRangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ageInputBox: {
    flex: 1,
    marginBottom: 0,
  },
  ageRangeSeparator: {
    fontSize: FONT_SIZE.content,
    color: '#666',
    marginHorizontal: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  genderContainer: {
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
  },
  genderLabel: {
    fontSize: FONT_SIZE.meta,
    fontWeight: '600',
    color: '#000',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
  },
  chevronIcon: {
    marginLeft: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  genderOptionsContainer: {
    backgroundColor: '#fff',
    borderRadius: Math.min(SCREEN_WIDTH * 0.03, 12),
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: Math.min(SCREEN_HEIGHT * 0.01, 8),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  genderOption: {
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.015, 12),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  genderOptionSelected: {
    backgroundColor: '#007AFF',
  },
  genderOptionText: {
    fontSize: FONT_SIZE.content,
    color: '#000',
  },
  genderOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
}); 