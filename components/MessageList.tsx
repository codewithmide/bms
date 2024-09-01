import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { useAuth } from '../provider/AuthProvider';
import { BlinkRenderer } from './BlinkRenderer'; // Import the BlinkRenderer component

interface Message {
  id: string;
  content: string;
  sender: string;
  recipient: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user } = useAuth();
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const isBlinkLink = (content: string) => {
    // Simple check to see if the content contains a blink link
    return content.startsWith('https://dial.to/?action=solana-action:');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUserMessage = item.sender === user?.email;

    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessageContainer : styles.recipientMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isUserMessage ? styles.userMessageBubble : styles.recipientMessageBubble
        ]}>
          {isBlinkLink(item.content) ? (
            <BlinkRenderer url={item.content} />
          ) : (
            <Text style={[
              styles.messageText,
              isUserMessage ? styles.userMessageText : styles.recipientMessageText
            ]}>
              {item.content}
            </Text>
          )}
        </View>
        <Text style={[
          styles.timestamp,
          isUserMessage ? styles.userTimestamp : styles.recipientTimestamp
        ]}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderMessage}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  recipientMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 12,
    padding: 10,
  },
  userMessageBubble: {
    backgroundColor: '#007AFF',
  },
  recipientMessageBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: 'white',
  },
  recipientMessageText: {
    color: 'black',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
  },
  userTimestamp: {
    color: '#8E8E93',
    textAlign: 'right',
  },
  recipientTimestamp: {
    color: '#8E8E93',
    textAlign: 'left',
  },
});

export default MessageList;
