import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // ✅ Fix here

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);

      // ✅ Safe navigation
      if (navigation?.replace) {
        navigation.replace('MainApp');
      } else {
        console.warn('[Login] navigation.replace is not available.');
      }

    } catch (error) {
      let message = 'Something went wrong. Please try again.';

      switch (error.code) {
        case 'auth/invalid-email':
          message = 'The email address is not valid.';
          break;
        case 'auth/user-disabled':
          message = 'This user account has been disabled.';
          break;
        case 'auth/user-not-found':
          message = 'No user found with this email.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password.';
          break;
        case 'auth/invalid-credential':
          message = 'Invalid email or password.';
          break;
        default:
          console.log('[Login] Unhandled error:', error.code, error.message);
      }

      Alert.alert('Login Failed', message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Image
        source={require('../../assets/blue-helmet.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Friday Night Rides</Text>

      <View style={styles.inputContainer}>
        <Feather name="mail" size={18} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          selectionColor="#fff"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Feather name="lock" size={18} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          selectionColor="#fff"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.forgotBtn}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>New here?</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Coming Soon...', 'FNR is currently invite-only.')
          }
        >
          <Text style={styles.signupLink}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 26,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: -60,
    marginBottom: 30,
    borderRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'FugazOne_400Regular',
    marginBottom: 36,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#1877F2',
    fontSize: 14,
  },
  loginBtn: {
    backgroundColor: '#1877F2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 28,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#aaa',
    fontSize: 14,
  },
  signupLink: {
    color: '#1877F2',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Login;
