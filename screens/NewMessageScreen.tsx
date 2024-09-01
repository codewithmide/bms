import React, { useState } from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../provider/AuthProvider";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Chat: { recipientEmail: string };
};

type NewMessageScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};

const NewMessageScreen: React.FC<NewMessageScreenProps> = ({ navigation }) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const { user } = useAuth();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleRecipientEmailChange = (email: string) => {
    setRecipientEmail(email);
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleStartConversation = () => {
    if (validateEmail(recipientEmail)) {
      navigation.navigate("Chat", { recipientEmail });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.recipientContainer}>
        <TextInput
          style={styles.recipientInput}
          placeholder="Recipient's email"
          value={recipientEmail}
          onChangeText={handleRecipientEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartConversation}
        disabled={!validateEmail(recipientEmail)}
      >
        <Text style={styles.startButtonText}>Start Conversation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  recipientContainer: {
    marginBottom: 20,
  },
  recipientInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewMessageScreen;