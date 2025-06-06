import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    BackHandler,
    Dimensions,
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

// Mock data for chat messages
const mockMessages = [
  {
    id: 1,
    user: "John D.",
    message: "Hey everyone! Who's joining for coffee?",
    timestamp: "2:25 PM",
    isCurrentUser: false
  },
  {
    id: 2,
    user: "Sarah M.",
    message: "I'll be there in 10 minutes!",
    timestamp: "2:26 PM",
    isCurrentUser: false
  },
  {
    id: 3,
    user: "You",
    message: "Just arrived at Starbucks",
    timestamp: "2:27 PM",
    isCurrentUser: true
  },
  {
    id: 4,
    user: "Mike R.",
    message: "I'm running a bit late, will be there in 15",
    timestamp: "2:28 PM",
    isCurrentUser: false
  }
];

interface RoomChatProps {
  roomName: string;
  participants: number;
  onClose: () => void;
}

export default function RoomChat({ roomName, participants, onClose }: RoomChatProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => backHandler.remove();
  }, [onClose]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: "You",
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.roomName}>{roomName}</Text>
          <Text style={styles.participants}>{participants} participants</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <FontAwesome name="ellipsis-v" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.messageContainer,
              msg.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
            ]}
          >
            {!msg.isCurrentUser && (
              <Text style={styles.userName}>{msg.user}</Text>
            )}
            <View style={[
              styles.messageBubble,
              msg.isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
            ]}>
              <Text style={[
                styles.messageText,
                !msg.isCurrentUser && styles.otherUserMessageText
              ]}>{msg.message}</Text>
              <Text style={[
                styles.timestamp,
                !msg.isCurrentUser && styles.otherUserTimestamp
              ]}>{msg.timestamp}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <FontAwesome name="send" size={20} color={message.trim() ? "#fff" : "#666"} />
        </TouchableOpacity>
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
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  participants: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  userName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  currentUserBubble: {
    backgroundColor: '#007AFF',
  },
  otherUserBubble: {
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  otherUserMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },
  otherUserTimestamp: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
}); 