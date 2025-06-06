import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_PADDING = Math.min(SCREEN_WIDTH * 0.04, 20); // Cap maximum padding
const HEADER_PADDING = Math.min(SCREEN_WIDTH * 0.04, 20);
const ICON_SIZE = Math.min(SCREEN_WIDTH * 0.06, 24); // Cap maximum icon size
const FONT_SIZE = {
  title: Math.min(SCREEN_WIDTH * 0.07, 24), // Cap maximum font size
  header: Math.min(SCREEN_WIDTH * 0.07, 24),
  content: Math.min(SCREEN_WIDTH * 0.04, 16),
  meta: Math.min(SCREEN_WIDTH * 0.035, 14),
  tag: Math.min(SCREEN_WIDTH * 0.035, 14),
};

const BOTTOM_BAR_HEIGHT = 60; // Height of the bottom tab bar

// Mock data for city talks
const cityTalks = [
  {
    id: 1,
    title: "New Park Opening in Downtown",
    content: "The new Central Park will open next month with amazing facilities including a skate park, outdoor gym, and children's playground.",
    author: "CityPlanner",
    timestamp: "2h ago",
    upvotes: 234,
    comments: 45,
    location: "Downtown",
    image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84",
    tags: ["Parks", "Development"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    engagement: 234 + 45 // upvotes + comments
  },
  {
    id: 2,
    title: "Best Street Food Spots",
    content: "Share your favorite street food vendors and hidden gems around the city. Looking for authentic local flavors!",
    author: "FoodieExplorer",
    timestamp: "5h ago",
    upvotes: 189,
    comments: 32,
    location: "Riverside",
    tags: ["Food", "Local"],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    engagement: 189 + 32
  },
  {
    id: 3,
    title: "Public Transport Improvements",
    content: "New bus routes and extended metro hours starting next month. Check out the new schedule and give your feedback.",
    author: "TransitUser",
    timestamp: "1d ago",
    upvotes: 156,
    comments: 28,
    location: "City Center",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3",
    tags: ["Transport", "Infrastructure"],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    engagement: 156 + 28
  },
  {
    id: 4,
    title: "Weekend Market in Central Square",
    content: "Don't miss the biggest weekend market this Saturday! Local artisans, fresh produce, and live music.",
    author: "MarketLover",
    timestamp: "30m ago",
    upvotes: 89,
    comments: 15,
    location: "Central Square",
    tags: ["Events", "Local"],
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    engagement: 89 + 15
  },
  {
    id: 5,
    title: "City Art Festival Next Month",
    content: "The annual City Art Festival is coming back with more artists and installations than ever before!",
    author: "ArtEnthusiast",
    timestamp: "3h ago",
    upvotes: 312,
    comments: 67,
    location: "Arts District",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
    tags: ["Events", "Arts"],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    engagement: 312 + 67
  }
];

export default function CityTalkScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedSort, setSelectedSort] = useState('hot');
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: 'like' | 'dislike' | null }>({});
  const [postVotes, setPostVotes] = useState<{ [key: number]: { upvotes: number; downvotes: number } }>({});
  const [showSortOptions, setShowSortOptions] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [posts, setPosts] = useState(cityTalks);
  const scrollY = new Animated.Value(0);

  const filterTags = [
    "Events", "Arts", "Food", "Transport", "Parks", "Development",
    "Local", "Infrastructure", "Community", "Education", "Health",
    "Sports", "Entertainment", "Shopping", "Environment"
  ];

  const toggleFilter = (tag: string) => {
    setSelectedFilters(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle new post from add screen
  useEffect(() => {
    if (params.newPost) {
      try {
        const newPost = JSON.parse(params.newPost as string);
        // Ensure the image URI is properly set
        if (newPost.image) {
          newPost.image = newPost.image.toString();
        }
        setPosts(prevPosts => [newPost, ...prevPosts]);
        // Clear the params to prevent duplicate posts
        router.setParams({});
      } catch (error) {
        // Silent error handling
      }
    }
  }, [params.newPost]);

  // Initialize votes when component mounts
  useEffect(() => {
    const initialVotes = cityTalks.reduce((acc, post) => {
      acc[post.id] = { upvotes: post.upvotes, downvotes: 0 };
      return acc;
    }, {} as { [key: number]: { upvotes: number; downvotes: number } });
    setPostVotes(initialVotes);
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowSortOptions(offsetY <= 0);
        if (offsetY > 0) {
          setShowFilters(false);
        }
      }
    }
  );

  const getSortedPosts = () => {
    let filteredPosts = [...posts];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.location.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filters
    if (selectedFilters.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        selectedFilters.some(filter => 
          post.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
        )
      );
    }

    // Apply sorting
    switch (selectedSort) {
      case 'hot':
        return filteredPosts.sort((a, b) => b.engagement - a.engagement);
      case 'new':
        return filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'top':
        return filteredPosts.sort((a, b) => b.upvotes - a.upvotes);
      default:
        return filteredPosts;
    }
  };

  const handlePostPress = (postId: string) => {
    router.push(`/(tabs)/city-talk/${postId}`);
  };

  const handleImageError = (postId: number) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  const handleVote = (postId: number, voteType: 'like' | 'dislike') => {
    setLikedPosts(prev => {
      const currentVote = prev[postId];
      if (currentVote === voteType) {
        // Remove vote
        setPostVotes(current => ({
          ...current,
          [postId]: {
            upvotes: voteType === 'like' ? current[postId].upvotes - 1 : current[postId].upvotes,
            downvotes: voteType === 'dislike' ? current[postId].downvotes - 1 : current[postId].downvotes
          }
        }));
        return { ...prev, [postId]: null };
      } else {
        // Add new vote and remove opposite vote if exists
        setPostVotes(current => ({
          ...current,
          [postId]: {
            upvotes: voteType === 'like' ? current[postId].upvotes + 1 : current[postId].upvotes - (currentVote === 'like' ? 1 : 0),
            downvotes: voteType === 'dislike' ? current[postId].downvotes + 1 : current[postId].downvotes - (currentVote === 'dislike' ? 1 : 0)
          }
        }));
        return { ...prev, [postId]: voteType };
      }
    });
  };

  const handleAddPost = (post: {
    title: string;
    content: string;
    image?: string;
    tags: string[];
  }) => {
    // In a real app, this would send the post to an API
    console.log('New post:', post);
    // For now, we'll just close the modal
    router.push('/(tabs)/city-talk/add');
  };

  const handleAuthorPress = (author: string) => {
    // In a real app, this would navigate to the user's profile
    console.log('View profile for:', author);
  };

  return (
    <View style={styles.container}>
      {/* Sort Options or Search */}
      {showSortOptions && (
        <View style={styles.sortContainer}>
          {showSearch ? (
            <View style={styles.searchInputContainer}>
              <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search posts..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  setSearchQuery('');
                  setShowSearch(false);
                }}
              >
                <FontAwesome name="times-circle" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity 
                  style={[styles.sortButton, selectedSort === 'hot' && styles.sortButtonActive]}
                  onPress={() => setSelectedSort('hot')}
                >
                  <FontAwesome name="fire" size={16} color={selectedSort === 'hot' ? '#FF6B6B' : '#666'} />
                  <Text style={[styles.sortButtonText, selectedSort === 'hot' && styles.sortButtonTextActive]}>Hot</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sortButton, selectedSort === 'new' && styles.sortButtonActive]}
                  onPress={() => setSelectedSort('new')}
                >
                  <FontAwesome name="clock-o" size={16} color={selectedSort === 'new' ? '#4ECDC4' : '#666'} />
                  <Text style={[styles.sortButtonText, selectedSort === 'new' && styles.sortButtonTextActive]}>New</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sortButton, selectedSort === 'top' && styles.sortButtonActive]}
                  onPress={() => setSelectedSort('top')}
                >
                  <FontAwesome name="trophy" size={16} color={selectedSort === 'top' ? '#FFD93D' : '#666'} />
                  <Text style={[styles.sortButtonText, selectedSort === 'top' && styles.sortButtonTextActive]}>Top</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sortButton, showSearch && styles.sortButtonActive]}
                  onPress={() => setShowSearch(true)}
                >
                  <FontAwesome name="search" size={16} color={showSearch ? '#007AFF' : '#666'} />
                  <Text style={[styles.sortButtonText, showSearch && styles.sortButtonTextActive]}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sortButton, showFilters && styles.sortButtonActive]}
                  onPress={() => setShowFilters(!showFilters)}
                >
                  <FontAwesome name="filter" size={16} color={showFilters ? '#007AFF' : '#666'} />
                  <Text style={[styles.sortButtonText, showFilters && styles.sortButtonTextActive]}>Filters</Text>
                </TouchableOpacity>
              </ScrollView>
              {showFilters && (
                <View style={styles.filterContainer}>
                  <View style={styles.filterHeader}>
                    <View style={styles.filterTagsWrapper}>
                      <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterTagsContainer}
                      >
                        {filterTags.map((tag) => (
                          <TouchableOpacity
                            key={tag}
                            style={[
                              styles.filterTag,
                              selectedFilters.includes(tag) && styles.filterTagSelected
                            ]}
                            onPress={() => toggleFilter(tag)}
                          >
                            <Text style={[
                              styles.filterTagText,
                              selectedFilters.includes(tag) && styles.filterTagTextSelected
                            ]}>
                              {tag}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                    <TouchableOpacity 
                      style={styles.closeFilterButton}
                      onPress={() => {
                        setShowFilters(false);
                        setSelectedFilters([]); // Clear all selected filters
                      }}
                    >
                      <FontAwesome name="times-circle" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      )}

      {/* Posts */}
      <Animated.ScrollView 
        style={styles.postsContainer}
        contentContainerStyle={[
          styles.postsContentContainer,
          showFilters && { paddingTop: Math.min(SCREEN_HEIGHT * 0.08, 60) }
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {getSortedPosts().map((post) => (
          <TouchableOpacity 
            key={post.id} 
            style={styles.postCard}
            onPress={() => handlePostPress(post.id.toString())}
            activeOpacity={0.7}
          >
            {/* Post Header */}
            <View style={styles.postHeader}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <View style={styles.postMeta}>
                <TouchableOpacity onPress={() => handleAuthorPress(post.author)}>
                  <Text style={styles.postAuthor}>
                    Posted by <Text style={styles.postAuthorName}>{post.author}</Text>
                  </Text>
                </TouchableOpacity>
                <Text style={styles.postTimestamp}>{post.timestamp}</Text>
              </View>
            </View>

            {/* Post Content */}
            <Text style={styles.postContent} numberOfLines={3}>
              {post.content}
            </Text>

            {/* Post Image */}
            {post.image && (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: post.image }} 
                  style={styles.postImage}
                  resizeMode="cover"
                  onError={() => handleImageError(post.id)}
                />
              </View>
            )}

            <View style={styles.postFooter}>
              <View style={styles.voteContainer}>
                <TouchableOpacity 
                  style={styles.voteButton}
                  onPress={() => handleVote(post.id, 'like')}
                >
                  <FontAwesome 
                    name="arrow-up" 
                    size={16} 
                    color={likedPosts[post.id] === 'like' ? '#007AFF' : '#666'} 
                  />
                </TouchableOpacity>
                <Text style={styles.voteCount}>{postVotes[post.id]?.upvotes || post.upvotes}</Text>
                <TouchableOpacity 
                  style={styles.voteButton}
                  onPress={() => handleVote(post.id, 'dislike')}
                >
                  <FontAwesome 
                    name="arrow-down" 
                    size={16} 
                    color={likedPosts[post.id] === 'dislike' ? '#007AFF' : '#666'} 
                  />
                </TouchableOpacity>
                <Text style={styles.voteCount}>{postVotes[post.id]?.downvotes || 0}</Text>
              </View>
              
              <View style={styles.locationContainer}>
                <FontAwesome name="map-marker" size={16} color="#007AFF" />
                <Text style={styles.locationText}>{post.location}</Text>
              </View>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {post.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>

      {/* Add Post FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/(tabs)/city-talk/add')}
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
  sortContainer: {
    backgroundColor: '#fff',
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.015, 12),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.03, 15),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Math.min(SCREEN_WIDTH * 0.02, 10),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.01, 8),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#999',
  },
  sortButtonActive: {
    backgroundColor: '#fff',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    marginLeft: Math.min(SCREEN_WIDTH * 0.015, 6),
    color: '#666',
    fontSize: FONT_SIZE.meta,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  postsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.03, 15),
    paddingTop: Math.min(SCREEN_HEIGHT * 0.08, 60), // Add padding to account for sort options
  },
  postsContentContainer: {
    paddingBottom: BOTTOM_BAR_HEIGHT + Math.min(SCREEN_HEIGHT * 0.02, 16),
  },
  postCard: {
    backgroundColor: '#fff',
    padding: CARD_PADDING,
    marginVertical: Math.min(SCREEN_HEIGHT * 0.01, 8),
    borderRadius: Math.min(SCREEN_WIDTH * 0.03, 12),
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    marginBottom: Math.min(SCREEN_HEIGHT * 0.015, 12),
    paddingBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  postTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: '700',
    color: '#000',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.008, 6),
    flexWrap: 'wrap',
    width: '100%',
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
    gap: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  postAuthor: {
    fontSize: FONT_SIZE.meta,
    color: '#666',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  postAuthorName: {
    fontSize: FONT_SIZE.meta,
    color: '#000',
    fontStyle: 'italic',
  },
  postTimestamp: {
    fontSize: FONT_SIZE.meta,
    color: '#666',
    flexShrink: 0, // Prevent timestamp from shrinking
  },
  postContent: {
    fontSize: FONT_SIZE.content,
    color: '#333',
    lineHeight: FONT_SIZE.content * 1.5,
    flexWrap: 'wrap',
    marginVertical: Math.min(SCREEN_HEIGHT * 0.015, 12),
    width: '100%',
  },
  postImage: {
    width: '100%',
    height: Math.min(SCREEN_HEIGHT * 0.25, 300), // Cap maximum height
    borderRadius: Math.min(SCREEN_WIDTH * 0.02, 8),
    marginVertical: Math.min(SCREEN_HEIGHT * 0.015, 12),
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Math.min(SCREEN_HEIGHT * 0.015, 12),
    marginTop: Math.min(SCREEN_HEIGHT * 0.01, 8),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexWrap: 'wrap',
    gap: Math.min(SCREEN_WIDTH * 0.02, 8),
    width: '100%',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    padding: Math.min(SCREEN_WIDTH * 0.01, 4),
  },
  voteButton: {
    padding: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  voteCount: {
    marginHorizontal: Math.min(SCREEN_WIDTH * 0.02, 8),
    fontSize: FONT_SIZE.meta,
    color: '#333',
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Math.min(SCREEN_WIDTH * 0.02, 8),
    maxWidth: '40%',
    flexShrink: 1,
  },
  locationText: {
    marginLeft: Math.min(SCREEN_WIDTH * 0.015, 6),
    fontSize: FONT_SIZE.meta,
    color: '#007AFF',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Math.min(SCREEN_HEIGHT * 0.015, 12),
    paddingTop: Math.min(SCREEN_HEIGHT * 0.01, 8),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    width: '100%',
    gap: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.03, 12),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.008, 6),
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    marginBottom: Math.min(SCREEN_HEIGHT * 0.005, 4),
    borderWidth: 1,
    borderColor: '#ddd',
    flexShrink: 0,
  },
  tagText: {
    color: '#007AFF',
    fontSize: FONT_SIZE.tag,
    fontWeight: '600',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginTop: SCREEN_HEIGHT * 0.06, // Add margin to account for sort options
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.03, 12),
    height: Math.min(SCREEN_HEIGHT * 0.045, 40),
    width: '100%',
  },
  searchIcon: {
    marginRight: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.content,
    color: '#000',
    padding: 0,
  },
  clearButton: {
    padding: Math.min(SCREEN_WIDTH * 0.02, 8),
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
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.015, 12),
    marginTop: Math.min(SCREEN_HEIGHT * 0.015, 12),
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterTagsWrapper: {
    flex: 1,
    marginRight: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  filterTagsContainer: {
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.03, 12),
    gap: Math.min(SCREEN_WIDTH * 0.03, 12),
  },
  closeFilterButton: {
    padding: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  filterTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.012, 10),
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    marginRight: Math.min(SCREEN_WIDTH * 0.03, 12),
    borderWidth: 1,
    borderColor: '#ddd',
    flexShrink: 0,
  },
  filterTagSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterTagText: {
    color: '#007AFF',
    fontSize: FONT_SIZE.tag,
    fontWeight: '600',
  },
  filterTagTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  imageContainer: {
    marginBottom: Math.min(SCREEN_HEIGHT * 0.015, 12),
  },
}); 