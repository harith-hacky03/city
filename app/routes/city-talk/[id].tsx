import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
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
const CARD_PADDING = Math.min(SCREEN_WIDTH * 0.04, 20); // Cap maximum padding
const ICON_SIZE = Math.min(SCREEN_WIDTH * 0.06, 24); // Cap maximum icon size
const FONT_SIZE = {
  title: Math.min(SCREEN_WIDTH * 0.06, 24),
  header: Math.min(SCREEN_WIDTH * 0.055, 22),
  content: Math.min(SCREEN_WIDTH * 0.04, 16),
  meta: Math.min(SCREEN_WIDTH * 0.035, 14),
  tag: Math.min(SCREEN_WIDTH * 0.03, 12),
};

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  upvotes: number;
  replies?: Comment[];
}

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
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    engagement: 234 + 45
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
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
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
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    engagement: 156 + 28
  }
];

// Mock data for comments
const mockComments: Comment[] = [
  {
    id: 1,
    author: "ParkLover",
    content: "This will be great for the community. The facilities look amazing!",
    timestamp: "1h ago",
    upvotes: 45,
    replies: [
      {
        id: 2,
        author: "LocalResident",
        content: "I can't wait to try the new skate park!",
        timestamp: "30m ago",
        upvotes: 12
      }
    ]
  },
  {
    id: 3,
    author: "CityPlanner",
    content: "The park will be open daily from 6 AM to 10 PM. We've included sustainable features like solar-powered lighting and water recycling systems.",
    timestamp: "2h ago",
    upvotes: 78,
    replies: []
  }
];

export default function CityTalkDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: number; author: string; parentId?: number } | null>(null);
  const [likedPost, setLikedPost] = useState<string | null>(null);
  const [postVotes, setPostVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [commentVotes, setCommentVotes] = useState<Record<number, { upvotes: number; downvotes: number }>>({});
  const [likedComments, setLikedComments] = useState<Record<number, { liked: string | null; replies?: any[] }>>({});
  const [likedReplies, setLikedReplies] = useState<Record<number, string | null>>({});
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const scrollViewRef = useRef<ScrollView>(null);
  const [imageError, setImageError] = useState(false);
  const [newCommentId, setNewCommentId] = useState<number | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Find the post by ID
  const post = cityTalks.find(p => p.id === Number(id));

  // Initialize votes when post is found
  useEffect(() => {
    if (post) {
      setPostVotes({ upvotes: post.upvotes, downvotes: 0 });
      // Initialize comment votes
      const initialCommentVotes = comments.reduce<Record<number, { upvotes: number; downvotes: number }>>((acc, comment) => {
        // Initialize votes for the comment
        acc[comment.id] = { upvotes: comment.upvotes, downvotes: 0 };
        // Initialize votes for each reply
        comment.replies?.forEach(reply => {
          acc[reply.id] = { upvotes: reply.upvotes, downvotes: 0 };
        });
        return acc;
      }, {});
      setCommentVotes(initialCommentVotes);
    }
  }, [post]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // If post not found, show error or redirect
  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  // Handle comment submission
  const handleComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now(),
        author: "CurrentUser",
        content: commentText.trim(),
        timestamp: "Just now",
        upvotes: 0,
        replies: []
      };

      setComments(prev => [...prev, newComment]);
      setCommentVotes(prev => ({
        ...prev,
        [newComment.id]: { upvotes: 0, downvotes: 0 }
      }));
      setLikedComments(prev => ({
        ...prev,
        [newComment.id]: { liked: null }
      }));

      setCommentText('');
      Keyboard.dismiss();
    }
  };

  // Handle post voting
  const handlePostVote = (voteType: string) => {
    setLikedPost((prev) => {
      if (prev === voteType) {
        // Remove vote
        setPostVotes(current => ({
          upvotes: voteType === 'like' ? current.upvotes - 1 : current.upvotes,
          downvotes: voteType === 'dislike' ? current.downvotes - 1 : current.downvotes
        }));
        return null;
      } else {
        // Add new vote and remove opposite vote if exists
        setPostVotes(current => ({
          upvotes: voteType === 'like' ? current.upvotes + 1 : current.upvotes - (prev === 'like' ? 1 : 0),
          downvotes: voteType === 'dislike' ? current.downvotes + 1 : current.downvotes - (prev === 'dislike' ? 1 : 0)
        }));
        return voteType;
      }
    });
  };

  // Handle comment voting
  const handleCommentVote = (commentId: number, voteType: string) => {
    setLikedComments(prev => {
      const currentVote = prev[commentId]?.liked;
      if (currentVote === voteType) {
        // Remove vote
        setCommentVotes(current => ({
          ...current,
          [commentId]: {
            upvotes: voteType === 'like' ? current[commentId].upvotes - 1 : current[commentId].upvotes,
            downvotes: voteType === 'dislike' ? current[commentId].downvotes - 1 : current[commentId].downvotes
          }
        }));
        return { ...prev, [commentId]: { ...prev[commentId], liked: null } };
      } else {
        // Add new vote and remove opposite vote if exists
        setCommentVotes(current => ({
          ...current,
          [commentId]: {
            upvotes: voteType === 'like' ? current[commentId].upvotes + 1 : current[commentId].upvotes - (currentVote === 'like' ? 1 : 0),
            downvotes: voteType === 'dislike' ? current[commentId].downvotes + 1 : current[commentId].downvotes - (currentVote === 'dislike' ? 1 : 0)
          }
        }));
        return { ...prev, [commentId]: { ...prev[commentId], liked: voteType } };
      }
    });
  };

  // Handle reply voting
  const handleReplyVote = (replyId: number, voteType: string) => {
    setLikedReplies(prev => {
      const currentVote = prev[replyId];
      if (currentVote === voteType) {
        // Remove vote
        setCommentVotes(current => ({
          ...current,
          [replyId]: {
            upvotes: voteType === 'like' ? current[replyId].upvotes - 1 : current[replyId].upvotes,
            downvotes: voteType === 'dislike' ? current[replyId].downvotes - 1 : current[replyId].downvotes
          }
        }));
        return { ...prev, [replyId]: null };
      } else {
        // Add new vote and remove opposite vote if exists
        setCommentVotes(current => ({
          ...current,
          [replyId]: {
            upvotes: voteType === 'like' ? current[replyId].upvotes + 1 : current[replyId].upvotes - (currentVote === 'like' ? 1 : 0),
            downvotes: voteType === 'dislike' ? current[replyId].downvotes + 1 : current[replyId].downvotes - (currentVote === 'dislike' ? 1 : 0)
          }
        }));
        return { ...prev, [replyId]: voteType };
      }
    });
  };

  // Handle reply submission
  const handleReply = (parentId: number, content: string) => {
    if (!content.trim()) return;

    const newReply: Comment = {
      id: Date.now(),
      author: "CurrentUser",
      content: content.trim(),
      timestamp: "Just now",
      upvotes: 0,
      replies: []
    };

    setComments(prev => {
      const addReplyToComment = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies)
            };
          }
          return comment;
        });
      };
      return addReplyToComment(prev);
    });

    setCommentVotes(prev => ({
      ...prev,
      [newReply.id]: { upvotes: 0, downvotes: 0 }
    }));

    setCommentText('');
    setReplyTo(null);
    Keyboard.dismiss();
  };

  // Render comment and its replies
  const renderComment = (comment: Comment, depth = 0) => {
    return (
      <View 
        key={comment.id} 
        style={[styles.commentCard, depth > 0 && styles.replyCard]}
        onLayout={() => {
          if (comment.id === newCommentId) {
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({
                y: comment.id * 100, // Approximate scroll position
                animated: true
              });
              setNewCommentId(null);
            }, 100);
          }
        }}
      >
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{comment.author}</Text>
          <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
        </View>
        <Text style={styles.commentContent}>{comment.content}</Text>
        <View style={styles.commentFooter}>
          <View style={styles.commentActions}>
            <View style={styles.voteActions}>
              <TouchableOpacity 
                style={styles.commentAction}
                onPress={() => depth === 0 ? handleCommentVote(comment.id, 'like') : handleReplyVote(comment.id, 'like')}
              >
                <FontAwesome 
                  name="arrow-up" 
                  size={ICON_SIZE * 0.6} 
                  color={depth === 0 ? 
                    (likedComments[comment.id]?.liked === 'like' ? '#007AFF' : '#666') :
                    (likedReplies[comment.id] === 'like' ? '#007AFF' : '#666')
                  } 
                />
                <Text style={styles.commentActionText}>{commentVotes[comment.id]?.upvotes || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.commentAction}
                onPress={() => depth === 0 ? handleCommentVote(comment.id, 'dislike') : handleReplyVote(comment.id, 'dislike')}
              >
                <FontAwesome 
                  name="arrow-down" 
                  size={ICON_SIZE * 0.6} 
                  color={depth === 0 ? 
                    (likedComments[comment.id]?.liked === 'dislike' ? '#007AFF' : '#666') :
                    (likedReplies[comment.id] === 'dislike' ? '#007AFF' : '#666')
                  } 
                />
                <Text style={styles.commentActionText}>{commentVotes[comment.id]?.downvotes || 0}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.commentAction}
              onPress={() => setReplyTo({ id: comment.id, author: comment.author })}
            >
              <FontAwesome name="reply" size={ICON_SIZE * 0.6} color="#666" />
              <Text style={styles.commentActionText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          keyboardVisible && { paddingBottom: SCREEN_HEIGHT * 0.2 }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.postContainer}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <View style={styles.postInfo}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <View style={styles.postMeta}>
                <Text style={styles.postAuthor}>
                  Posted by <Text style={styles.postAuthorName}>{post.author}</Text>
                </Text>
                <Text style={styles.postTimestamp}>{post.timestamp}</Text>
              </View>
            </View>
          </View>

          {/* Post Content */}
          <Text style={styles.postContent}>{post.content}</Text>

          {/* Post Image */}
          {post.image && !imageError && (
            <Image 
              source={{ uri: post.image }} 
              style={styles.postImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          )}

          {/* Post Footer */}
          <View style={styles.postFooter}>
            <View style={styles.voteContainer}>
              <TouchableOpacity 
                style={styles.voteButton}
                onPress={() => handlePostVote('like')}
              >
                <FontAwesome 
                  name="arrow-up" 
                  size={ICON_SIZE * 0.7} 
                  color={likedPost === 'like' ? '#007AFF' : '#666'} 
                />
              </TouchableOpacity>
              <Text style={styles.voteCount}>{postVotes.upvotes}</Text>
              <TouchableOpacity 
                style={styles.voteButton}
                onPress={() => handlePostVote('dislike')}
              >
                <FontAwesome 
                  name="arrow-down" 
                  size={ICON_SIZE * 0.7} 
                  color={likedPost === 'dislike' ? '#007AFF' : '#666'} 
                />
              </TouchableOpacity>
              <Text style={styles.voteCount}>{postVotes.downvotes}</Text>
            </View>
            
            <View style={styles.locationContainer}>
              <FontAwesome name="map-marker" size={ICON_SIZE * 0.7} color="#007AFF" />
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

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments</Text>
            {comments.map(comment => renderComment(comment))}
          </View>
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={[
        styles.inputContainer,
        keyboardVisible && styles.inputContainerKeyboardVisible
      ]}>
        {replyTo && (
          <View style={styles.replyingToContainer}>
            <Text style={styles.replyingToText}>
              Replying to {replyTo.author}
            </Text>
            <TouchableOpacity onPress={() => setReplyTo(null)}>
              <FontAwesome name="times" size={ICON_SIZE * 0.6} color="#666" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={replyTo ? `Reply to ${replyTo.author}...` : "Add a comment..."}
            placeholderTextColor="#666"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
            onPress={() => {
              if (replyTo) {
                handleReply(replyTo.id, commentText);
              } else {
                handleComment();
              }
            }}
            disabled={!commentText.trim()}
          >
            <FontAwesome name="send" size={20} color={commentText.trim() ? "#fff" : "#666"} />
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Math.min(SCREEN_HEIGHT * 0.1, 80),
  },
  postContainer: {
    padding: CARD_PADDING,
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
  },
  postHeader: {
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
  },
  postInfo: {
    flex: 1,
  },
  postTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.015, 12),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
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
    fontWeight: 'bold',
    color: '#000',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  postTimestamp: {
    fontSize: FONT_SIZE.meta,
    color: '#666',
    flexShrink: 0,
  },
  postContent: {
    fontSize: FONT_SIZE.content,
    color: '#333',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
    lineHeight: FONT_SIZE.content * 1.5,
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
  },
  postImage: {
    width: '100%',
    height: Math.min(SCREEN_HEIGHT * 0.25, 300),
    borderRadius: Math.min(SCREEN_WIDTH * 0.02, 8),
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Math.min(SCREEN_HEIGHT * 0.015, 12),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.015, 12),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    flexWrap: 'wrap',
    gap: Math.min(SCREEN_WIDTH * 0.02, 8),
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
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    gap: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  tag: {
    backgroundColor: '#E6F2FF',
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.03, 12),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.008, 6),
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    marginRight: Math.min(SCREEN_WIDTH * 0.02, 8),
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
  },
  tagText: {
    color: '#007AFF',
    fontSize: FONT_SIZE.tag,
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: Math.min(SCREEN_HEIGHT * 0.02, 16),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  commentsTitle: {
    fontSize: FONT_SIZE.header,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.02, 16),
  },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: Math.min(SCREEN_WIDTH * 0.03, 12),
    padding: CARD_PADDING,
    marginBottom: Math.min(SCREEN_HEIGHT * 0.015, 12),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
  },
  commentAuthor: {
    fontSize: FONT_SIZE.meta,
    fontWeight: 'bold',
    color: '#000',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  commentTimestamp: {
    fontSize: FONT_SIZE.meta,
    color: '#666',
  },
  commentContent: {
    fontSize: FONT_SIZE.content,
    color: '#333',
    marginBottom: Math.min(SCREEN_HEIGHT * 0.015, 12),
    lineHeight: FONT_SIZE.content * 1.4,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Math.min(SCREEN_HEIGHT * 0.01, 8),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  voteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Math.min(SCREEN_WIDTH * 0.015, 6),
  },
  commentActionText: {
    marginLeft: Math.min(SCREEN_WIDTH * 0.015, 6),
    color: '#666',
    fontSize: FONT_SIZE.meta,
  },
  replyCard: {
    marginLeft: Math.min(SCREEN_WIDTH * 0.04, 16),
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
  },
  repliesContainer: {
    marginTop: Math.min(SCREEN_HEIGHT * 0.01, 8),
  },
  inputContainer: {
    padding: Math.min(SCREEN_WIDTH * 0.03, 12),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputContainerKeyboardVisible: {
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: Math.min(SCREEN_WIDTH * 0.02, 8),
    borderRadius: Math.min(SCREEN_WIDTH * 0.02, 8),
    marginBottom: Math.min(SCREEN_HEIGHT * 0.01, 8),
    width: '95%',
  },
  replyingToText: {
    fontSize: FONT_SIZE.meta,
    color: '#666',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    paddingHorizontal: Math.min(SCREEN_WIDTH * 0.04, 16),
    paddingVertical: Math.min(SCREEN_HEIGHT * 0.01, 8),
    color: '#000',
    maxHeight: Math.min(SCREEN_HEIGHT * 0.15, 100),
    marginRight: Math.min(SCREEN_WIDTH * 0.02, 8),
  },
  sendButton: {
    width: Math.min(SCREEN_WIDTH * 0.1, 40),
    height: Math.min(SCREEN_WIDTH * 0.1, 40),
    borderRadius: Math.min(SCREEN_WIDTH * 0.05, 20),
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  errorText: {
    fontSize: FONT_SIZE.content,
    color: '#666',
    textAlign: 'center',
    marginTop: Math.min(SCREEN_HEIGHT * 0.2, 160),
  },
});