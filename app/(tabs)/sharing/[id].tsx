import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Mock data for sharing posts (in real app, this would come from an API)
const sharingPosts = [
  {
    id: 1,
    title: "2BHK Apartment for Rent",
    type: "House",
    location: "Indiranagar",
    price: "₹25,000/month",
    description: "Fully furnished 2BHK apartment available for rent. Close to metro station and tech parks. The apartment features modern amenities, 24/7 water supply, power backup, and security. Available for immediate move-in.",
    image: "https://example.com/apartment.jpg",
    postedBy: "Rahul S.",
    postedTime: "2h ago",
    details: {
      amenities: ["Parking", "Power Backup", "24/7 Water", "Security", "Lift"]
    }
  },
  {
    id: 2,
    title: "Football Turf Booking",
    type: "Turf",
    location: "Koramangala",
    price: "₹1,200/hour",
    description: "Professional football turf available for booking. Floodlights, changing rooms, and parking available. Perfect for weekend matches and tournaments.",
    image: null,
    postedBy: "Sports Hub",
    postedTime: "5h ago",
    details: {
      amenities: ["Parking", "Water Supply", "First Aid", "Refreshments"]
    }
  },
  {
    id: 3,
    title: "Gym Equipment Sale",
    type: "Fitness",
    location: "HSR Layout",
    price: "₹15,000",
    description: "Selling complete home gym setup. Includes treadmill, weights, and bench. Barely used, in excellent condition.",
    image: null,
    postedBy: "Fitness Freak",
    postedTime: "1d ago",
    details: {
      amenities: ["Assembly Available", "Delivery Available"]
    }
  }
];

export default function SharingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Find the post with the matching ID
  const post = sharingPosts.find(p => p.id === Number(id));

  // If post is not found, show error or redirect
  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  const handleChat = () => {
    // TODO: Navigate to chat screen
    console.log('Navigate to chat with:', post.postedBy);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Image */}
        {post.image ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: post.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={1}
            >
              <FontAwesome name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButtonNoImage}
              onPress={() => router.back()}
              activeOpacity={1}
            >
              <FontAwesome name="arrow-left" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        <View style={[styles.content, !post.image && styles.contentNoImage]}>
          {/* Title and Price */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.type}>{post.type}</Text>
              <Text style={styles.price}>{post.price}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <FontAwesome name="map-marker" size={16} color="#666" />
            <Text style={styles.location}>{post.location}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesList}>
              {post.details.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <FontAwesome name="check-circle" size={16} color="#007AFF" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{post.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={handleChat}
            activeOpacity={1}
          >
            <FontAwesome name="comments" size={20} color="#fff" />
            <Text style={styles.chatButtonText}>Chat with {post.postedBy}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} activeOpacity={1}>
            <FontAwesome name="share" size={20} color="#666" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    height: 60,
    width: '100%',
    position: 'relative',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonNoImage: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  contentNoImage: {
    paddingTop: 0,
    marginTop: 16,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  type: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  amenitiesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  amenitiesList: {
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenityText: {
    fontSize: 16,
    color: '#333',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    padding: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
  },
  chatButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  shareButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
}); 