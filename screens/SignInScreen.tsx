import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../provider/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Chat: undefined;
};

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

const COOLDOWN_PERIOD = 60000; // 1 minute in milliseconds

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { signUp } = useAuth();
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prevTime) => Math.max(0, prevTime - 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const lastAttempt = await AsyncStorage.getItem('lastSignUpAttempt');
    const now = Date.now();
    if (lastAttempt && now - parseInt(lastAttempt) < COOLDOWN_PERIOD) {
      const remainingTime = COOLDOWN_PERIOD - (now - parseInt(lastAttempt));
      setCooldownTime(remainingTime);
      setError(`Please wait ${Math.ceil(remainingTime / 1000)} seconds before trying again.`);
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password);
      await AsyncStorage.setItem('lastSignUpAttempt', now.toString());
      Toast.show({
        type: 'success',
        text1: 'Sign Up Successful',
        text2: 'You can now log in with your new account.',
      });
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('Detailed sign-up error:', error);
      if (error.message === 'Email rate limit exceeded') {
        setCooldownTime(COOLDOWN_PERIOD);
        setError(`Email rate limit exceeded. Please wait ${COOLDOWN_PERIOD / 1000} seconds before trying again.`);
      } else if (error.message === 'Email already in use') {
        setError('This email is already registered. Please use a different email or try to log in.');
      } else {
        setError(`Sign-up failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading && cooldownTime === 0}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading && cooldownTime === 0}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!isLoading && cooldownTime === 0}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {cooldownTime > 0 && (
        <Text style={styles.cooldownText}>
          Please wait {Math.ceil(cooldownTime / 1000)} seconds before trying again.
        </Text>
      )}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button 
          title="Sign Up" 
          onPress={handleSignUp} 
          disabled={isLoading || cooldownTime > 0} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  cooldownText: {
    color: 'orange',
    marginBottom: 10,
  },
});

export default SignUpScreen;