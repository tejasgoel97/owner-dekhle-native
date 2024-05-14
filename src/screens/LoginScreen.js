import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Text, Input} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {setUserInfo} from '../store/actions';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from '@rneui/base';
import {THEME_COLOR} from '../assets/colors/colors';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the Login button
  const dispatch = useDispatch();

  const handleUsernameInput = text => {
    setUsername(text);
  };

  const handlePasswordInput = text => {
    setPassword(text);
  };

  const handleLogin = async () => {
    setLoading(true); // Start loading
    try {
      const response = await api.post('/auth/email/login', {
        phoneNumber: username,
        email: username,
        password,
      });
      if (response.data.success) {
        const userInfo = response.data.userInfo;
        const serializedState = JSON.stringify(userInfo);
        console.log({serializedState});
        await AsyncStorage.setItem('user-info', serializedState);
        dispatch(setUserInfo(userInfo));
        navigation.navigate('HomeScreen'); // Navigation after successful login
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: response.data.message,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Failed',
          text2: error.response.data.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2: 'An unexpected error occurred during login',
        });
        console.log('Login error:', error);
      }
    } finally {
      setLoading(false); // End loading regardless of the outcome
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')} // Path to your local logo image
          style={styles.logo}
        />
      </View>

      <View>
        <Text>Enter your Email/Password</Text>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={handleUsernameInput}
          autoCapitalize="none"
        />
      </View>

      <View>
        <Text>Enter your password</Text>
        <Input
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordInput}
          secureTextEntry={true}
        />
        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading} // Use the loading state for the spinner
          buttonStyle={{backgroundColor: THEME_COLOR}}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.registerText}>Not a registered user? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  registerText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    color: THEME_COLOR,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default LoginScreen;
