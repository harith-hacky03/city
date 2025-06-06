import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_PADDING = Math.min(SCREEN_WIDTH * 0.04, 20);
const FONT_SIZE = {
  title: Math.min(SCREEN_WIDTH * 0.06, 24),
  header: Math.min(SCREEN_WIDTH * 0.055, 22),
  content: Math.min(SCREEN_WIDTH * 0.04, 16),
  meta: Math.min(SCREEN_WIDTH * 0.035, 14),
};

// Mock user data
const userData = {
  name: "John Doe",
  username: "@johndoe",
  bio: "City explorer and community enthusiast. Love discovering new places and sharing experiences.",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  stats: {
    posts: 42,
    friends: 567
  },
  badges: [
    { name: "Early Adopter", icon: "star" },
    { name: "Top Contributor", icon: "trophy" },
    { name: "Community Leader", icon: "users" }
  ],
  socialLinks: {
    instagram: "@johndoe_insta",
    telegram: "@johndoe_telegram",
    tinder: "@johndoe_tinder",
    bumble: "@johndoe_bumble",
    hinge: "@johndoe_hinge"
  }
};

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image 
              source={{ uri: userData.avatar }} 
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.username}>{userData.username}</Text>
            </View>
          </View>
          <Text style={styles.bio}>{userData.bio}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.stats.posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.stats.friends}</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
        </View>

        {/* Social Links Section */}
        <View style={styles.socialLinksSection}>
          <Text style={styles.sectionTitle}>Social Profiles</Text>
          <View style={styles.socialLinksContainer}>
            <TouchableOpacity style={[styles.socialLink, { borderColor: '#E1306C' }]}>
              <FontAwesome name="instagram" size={20} color="#E1306C" />
              <Text style={[styles.socialLinkText, { color: '#E1306C' }]}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialLink, { borderColor: '#0088cc' }]}>
              <FontAwesome name="telegram" size={20} color="#0088cc" />
              <Text style={[styles.socialLinkText, { color: '#0088cc' }]}>Telegram</Text>
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

        {/* Badges Section */}
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <View style={styles.badgesContainer}>
            {userData.badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <FontAwesome name={badge.icon as any} size={24} color="#007AFF" />
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Activity Section */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <Text style={styles.emptyText}>No recent activity</Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Button */}
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => {
          // TODO: Implement edit profile functionality
          console.log('Edit profile pressed');
        }}
      >
        <FontAwesome name="edit" size={20} color="#fff" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
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
  header: {
    padding: CARD_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.title,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  username: {
    fontSize: FONT_SIZE.meta,
    color: '#666',
  },
  bio: {
    fontSize: FONT_SIZE.content,
    color: '#333',
    lineHeight: FONT_SIZE.content * 1.5,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: CARD_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZE.header,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZE.meta,
    color: '#666',
  },
  badgesSection: {
    padding: CARD_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.header,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    minWidth: 100,
  },
  badgeName: {
    fontSize: FONT_SIZE.meta,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  activitySection: {
    padding: CARD_PADDING,
  },
  activityList: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.content,
    color: '#666',
  },
  editButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: FONT_SIZE.content,
    fontWeight: '600',
    marginLeft: 8,
  },
  socialLinksSection: {
    padding: CARD_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  socialLinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  socialLinkText: {
    fontSize: FONT_SIZE.content,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 