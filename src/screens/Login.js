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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // ✅ Fix here

  const ensureUserDocument = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Rider Name',
          dateCreated: new Date().toISOString(),
          dateLastAccessed: new Date().toISOString(),
          username: user.displayName || 'Rider Name',
          dob: null, // Can be added later
        };
        
        await setDoc(userDocRef, userData);
        console.log('User document created in Firestore');
      } else {
        // Update last accessed date
        await setDoc(userDocRef, {
          dateLastAccessed: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error ensuring user document:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter both email and password.', [], { cancelable: true });
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore if it doesn't exist
      await ensureUserDocument(user);

      // Navigation is handled automatically by App.js based on auth state

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

      Alert.alert('Login Failed', message, [], { cancelable: true });
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
          onPress={() => navigation.navigate('SignUp')}
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
    textAlign: 'center',
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
    fontSize: 15,
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
