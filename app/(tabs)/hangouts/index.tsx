import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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

// Mock data for hangouts
const hangouts = [
  {
    id: 1,
    title: "Coffee & Conversation",
    location: "Third Wave Coffee, Koramangala",
    date: "Today, 6:30 PM",
    time: "6:30 PM",
    attendees: 2,
    maxAttendees: 2,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    category: "Coffee",
    description: "Looking for someone to share stories over a cup of coffee. Let's connect and see where it goes!",
    age: "25-30",
    gender: "Female",
  },
  {
    id: 2,
    title: "Weekend Movie Night",
    location: "PVR Phoenix MarketCity",
    date: "Tomorrow, 7:00 PM",
    time: "7:00 PM",
    attendees: 1,
    maxAttendees: 2,
    image: null,
    category: "Movies",
    description: "Anyone up for watching the latest Bollywood release? Looking for a movie buddy!",
    age: "28-35",
    gender: "Male",
  },
  {
    id: 3,
    title: "Dinner at Olive Beach",
    location: "Olive Beach, Indiranagar",
    date: "Sat, Mar 23",
    time: "8:00 PM",
    attendees: 1,
    maxAttendees: 2,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    category: "Dinner",
    description: "Looking for someone to enjoy a romantic dinner with. Great ambiance and amazing food!",
    age: "26-32",
    gender: "Female",
  },
  {
    id: 4,
    title: "Shopping at UB City",
    location: "UB City Mall",
    date: "Sun, Mar 24",
    time: "2:00 PM",
    attendees: 1,
    maxAttendees: 2,
    image: null,
    category: "Shopping",
    description: "Looking for a shopping partner to explore the latest collections. Let's make it fun!",
    age: "24-30",
    gender: "Female",
  },
];

const categories = ["All", "Coffee", "Movies", "Dinner", "Shopping", "Adventure", "Cultural"];

export default function HangoutsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategories, setShowCategories] = useState(false);

  const filteredHangouts = selectedCategory === "All" 
    ? hangouts 
    : hangouts.filter(hangout => hangout.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Category Selector */}
      <TouchableOpacity 
        style={styles.categorySelector}
        onPress={() => setShowCategories(true)}
      >
        <Text style={styles.categorySelectorText}>
          {selectedCategory}
        </Text>
        <FontAwesome name="chevron-down" size={16} color="#007AFF" />
      </TouchableOpacity>

      {/* Categories Modal */}
      <Modal
        visible={showCategories}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategories(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategories(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategories(false)}>
                <FontAwesome name="times" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.categoriesList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category && styles.categoryItemActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategories(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryItemText,
                      selectedCategory === category && styles.categoryItemTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                  {selectedCategory === category && (
                    <FontAwesome name="check" size={16} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Hangouts List */}
      <ScrollView 
        style={styles.hangoutsList}
        contentContainerStyle={styles.hangoutsContent}
      >
        {filteredHangouts.map((hangout) => (
          <Pressable
            key={hangout.id}
            style={styles.hangoutCard}
            onPress={() => router.push(`/routes/hangouts/${hangout.id}`)}
          >
            {hangout.image && (
              <Image source={{ uri: hangout.image }} style={styles.hangoutImage} />
            )}
            <View style={styles.hangoutContent}>
              <View style={styles.hangoutHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.hangoutTitle}>{hangout.title}</Text>
                  <View style={styles.ageGenderContainer}>
                    <Text style={styles.ageGenderText}>{hangout.age} • {hangout.gender}</Text>
                  </View>
                </View>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>{hangout.category}</Text>
                </View>
              </View>

              <Text style={styles.hangoutDescription} numberOfLines={2}>
                {hangout.description}
              </Text>

              <View style={styles.hangoutDetails}>
                <View style={styles.detailItem}>
                  <FontAwesome name="map-marker" size={16} color="#007AFF" />
                  <Text style={styles.detailText}>{hangout.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <FontAwesome name="calendar" size={16} color="#007AFF" />
                  <Text style={styles.detailText}>{hangout.date}</Text>
                </View>
              </View>

              <View style={styles.attendeesContainer}>
                <Pressable 
                  style={styles.chatButton}
                  onPress={() => router.push(`/routes/hangouts/${hangout.id}`)}
                >
                  <FontAwesome name="comment" size={16} color="#fff" style={styles.chatIcon} />
                  <Text style={styles.chatButtonText}>Chat</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Add Hangout FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/routes/hangouts/add')}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CARD_PADDING,
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.015, 12),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categorySelectorText: {
    fontSize: FONT_SIZE.content,
    fontWeight: '600',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    borderTopRightRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: CARD_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: FONT_SIZE.header,
    fontWeight: '600',
    color: '#000',
  },
  categoriesList: {
    padding: CARD_PADDING,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.015, 12),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryItemActive: {
    backgroundColor: '#f5f5f5',
  },
  categoryItemText: {
    fontSize: FONT_SIZE.content,
    color: '#000',
  },
  categoryItemTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  hangoutsList: {
    flex: 1,
  },
  hangoutsContent: {
    padding: CARD_PADDING,
  },
  hangoutCard: {
    backgroundColor: '#fff',
    borderRadius: Math.min(SCREEN_WIDTH * 0.03, 12),
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hangoutImage: {
    width: '100%',
    height: Math.min(SCREEN_HEIGHT * 0.25, 200),
  },
  hangoutContent: {
    padding: CARD_PADDING,
  },
  hangoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
  },
  titleContainer: {
    flex: 1,
    marginRight: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  hangoutTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: '600',
    color: '#000',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.005, 4),
  },
  ageGenderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageGenderText: {
    fontSize: FONT_SIZE.meta,
    color: '#666',
  },
  categoryTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.03, 12),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.008, 6),
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
  },
  categoryTagText: {
    fontSize: FONT_SIZE.tag,
    color: '#007AFF',
    fontWeight: '600',
  },
  hangoutDescription: {
    fontSize: FONT_SIZE.content,
    color: '#333',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.015, 12),
    lineHeight: FONT_SIZE.content * 1.5,
  },
  hangoutDetails: {
    marginBottom: Math.min(SCREEN_HEIGHT * 0.015, 12),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.008, 6),
  },
  detailText: {
    fontSize: FONT_SIZE.meta,
    color: '#666',
    marginLeft: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Math.min(SCREEN_HEIGHT * 0.015, 12),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.01, 8),
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
  },
  chatIcon: {
    marginRight: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  chatButtonText: {
    fontSize: FONT_SIZE.meta,
    color: '#fff',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: Math.min(SCREEN_WIDTH * 0.05, 20),
    bottom: Math.min(SCREEN_HEIGHT * 0.04, 30),
    width: Math.min(SCREEN_WIDTH * 0.12, 48),
    height: Math.min(SCREEN_WIDTH * 0.12, 48),
    borderRadius: Math.min(SCREEN_WIDTH * 0.06, 24),
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
}); 