import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  Platform,
} from "react-native";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { supabaseMessagingService } from "../services/messaging";
import { useAuth } from "../provider/AuthProvider";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface Message {
  id: string;
  content: string;
  sender: string;
  recipient: string;
  created_at: string;
}

type RootStackParamList = {
  Chat: { recipientEmail: string };
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "Chat">;

type ChatScreenProps = {
  route: ChatScreenRouteProp;
  navigation: ChatScreenNavigationProp;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { recipientEmail } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [user, recipientEmail]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>{recipientEmail}</Text>
      ),
    });
  }, [navigation, recipientEmail]);

  const loadMessages = async () => {
    if (user?.email) {
      try {
        const conversationMessages =
          await supabaseMessagingService.getConversationMessages(
            user.email,
            recipientEmail
          );
        setMessages(conversationMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (user?.email && content.trim() !== "") {
      try {
        await supabaseMessagingService.sendMessage(
          user.email,
          recipientEmail,
          content
        );
        loadMessages();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <MessageList messages={messages} />
      <MessageInput onSend={handleSendMessage} isValid={true} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  recipientContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  recipientEmail: {
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "white", // Set background color to white
  },
  headerTitle: {
    fontSize: 12, // Set font size to 12px
    fontWeight: "bold",
    color: "black", // Adjust color as needed
  },
});

export default ChatScreen;
