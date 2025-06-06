import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Mock data for sharing posts
const sharingPosts = [
  {
    id: 1,
    title: "2BHK Apartment for Rent",
    type: "House",
    location: "Indiranagar",
    price: "₹25,000/month",
    description: "Fully furnished 2BHK apartment available for rent. Close to metro station and tech parks.",
    image: "https://example.com/apartment.jpg",
    postedBy: "Rahul S.",
    postedTime: "2h ago"
  },
  {
    id: 2,
    title: "Football Turf Booking",
    type: "Turf",
    location: "Koramangala",
    price: "₹1,200/hour",
    description: "Professional football turf available for booking. Floodlights, changing rooms, and parking available.",
    image: null,
    postedBy: "Sports Hub",
    postedTime: "5h ago"
  },
  {
    id: 3,
    title: "Gym Equipment Sale",
    type: "Fitness",
    location: "HSR Layout",
    price: "₹15,000",
    description: "Selling complete home gym setup. Includes treadmill, weights, and bench. Barely used.",
    image: null,
    postedBy: "Fitness Freak",
    postedTime: "1d ago"
  }
];

export default function SharingScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'House', 'Turf', 'Fitness', 'Other'];

  const handlePostPress = (postId: number) => {
    router.push({
      pathname: "/routes/sharing/[id]",
      params: { id: postId }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Posts List */}
        <View style={styles.postsContainer}>
          {sharingPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.postCard}
              onPress={() => handlePostPress(post.id)}
              activeOpacity={1}
            >
              {post.image && (
                <Image
                  source={{ uri: post.image }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.postContent}>
                <View style={styles.postHeader}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>{post.title}</Text>
                    <Text style={styles.type}>{post.type}</Text>
                  </View>
                </View>
                
                <Text style={styles.postLocation}>
                  <FontAwesome name="map-marker" size={14} color="#666" /> {post.location}
                </Text>
                
                <Text style={styles.postDescription} numberOfLines={2}>
                  {post.description}
                </Text>

                <View style={styles.postFooter}>
                  <Text style={styles.postedBy}>Posted by {post.postedBy}</Text>
                  <Text style={styles.postedTime}>{post.postedTime}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Post Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/routes/sharing/create')}
        activeOpacity={1}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  postsContainer: {
    padding: 16,
    gap: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  postLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedBy: {
    fontSize: 14,
    color: '#666',
  },
  postedTime: {
    fontSize: 14,
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
}); 