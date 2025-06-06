import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 16;

// Mock data for hangouts (same as in index.tsx)
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
    interests: ["Reading", "Travel", "Photography"],
    about: "I'm a software engineer who loves exploring new cafes and meeting interesting people. Looking for meaningful conversations and connections.",
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
    interests: ["Movies", "Music", "Food"],
    about: "Movie enthusiast looking for someone to share popcorn and conversations with. Love both Bollywood and Hollywood films.",
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
    interests: ["Food", "Travel", "Art"],
    about: "Foodie and art lover who enjoys good conversations over great food. Looking for someone to share culinary adventures with.",
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
    interests: ["Fashion", "Shopping", "Beauty"],
    about: "Fashion enthusiast looking for a shopping buddy to explore new trends and styles together.",
  },
];

// Hide header for this route
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function HangoutLayout() {
  return <HangoutDetailScreen />;
}

function HangoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const hangout = hangouts.find(h => h.id === Number(id));

  if (!hangout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Hangout not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {hangout.image && (
          <Image source={{ uri: hangout.image }} style={styles.image} />
        )}

        <View style={styles.detailsContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{hangout.title}</Text>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{hangout.category}</Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.ageGender}>
              <Text style={styles.ageGenderText}>{hangout.age} • {hangout.gender}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{hangout.about}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {hangout.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Details</Text>
            <View style={styles.detailItem}>
              <FontAwesome name="map-marker" size={16} color="#007AFF" />
              <Text style={styles.detailText}>{hangout.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome name="calendar" size={16} color="#007AFF" />
              <Text style={styles.detailText}>{hangout.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome name="clock-o" size={16} color="#007AFF" />
              <Text style={styles.detailText}>{hangout.time}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connect</Text>
            <View style={styles.socialLinksContainer}>
              <TouchableOpacity style={[styles.socialLink, { borderColor: '#E1306C' }]}>
                <FontAwesome name="instagram" size={20} color="#E1306C" />
                <Text style={[styles.socialLinkText, { color: '#E1306C' }]}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialLink, { borderColor: '#FF6B6B' }]}>
                <FontAwesome name="heart" size={20} color="#FF6B6B" />
                <Text style={[styles.socialLinkText, { color: '#FF6B6B' }]}>Tinder</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialLink, { borderColor: '#FFC629' }]}>
                <FontAwesome name="circle" size={20} color="#FFC629" />
                <Text style={[styles.socialLinkText, { color: '#FFC629' }]}>Bumble</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialLink, { borderColor: '#FF6B6B' }]}>
                <FontAwesome name="square" size={20} color="#FF6B6B" />
                <Text style={[styles.socialLinkText, { color: '#FF6B6B' }]}>Hinge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.chatButton}>
          <FontAwesome name="comment" size={16} color="#fff" style={styles.chatIcon} />
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  detailsContainer: {
    padding: CARD_PADDING,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 12,
  },
  categoryTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileInfo: {
    marginBottom: 20,
  },
  ageGender: {
    marginTop: 4,
  },
  ageGenderText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  interestTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  interestText: {
    color: '#007AFF',
    fontSize: 14,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    color: '#333',
    marginLeft: 12,
    fontSize: 16,
  },
  socialLinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 8,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  socialLinkText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  chatButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatIcon: {
    marginRight: 8,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
}); 