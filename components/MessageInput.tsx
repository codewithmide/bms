import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MessageInputProps {
  onSend: (message: string) => void;
  isValid: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, isValid }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() !== '' && isValid) {
      onSend(message);
      setMessage('');
    }
  };

  const isButtonActive = message.trim() !== '' && isValid;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Send a blink..."
        multiline
        onFocus={() => console.log('Input focused')}  // Debugging line
      />
      <TouchableOpacity
        style={[styles.sendButton, !isButtonActive && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!isButtonActive}
      >
        <Ionicons name="send" size={24} color={isButtonActive ? "#007AFF" : "#A0A0A0"} />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingBottom: 20,
    backgroundColor: 'white',  // Ensure background color is set
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: 'white',  // Ensure the input background color is set
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});

export default MessageInput;
