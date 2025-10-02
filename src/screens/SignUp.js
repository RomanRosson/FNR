import React, { useState, useEffect } from 'react';
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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
// Hardcoded API key for API Ninjas
const API_NINJAS_SECRET = '4BXi9XEYJWt7WA/310DZQQ==DcvzMgPztvKRPxZ7';

// Cloudinary configuration - Parse from provided URL
// CLOUDINARY_URL=cloudinary://934537995483936:rhnHOM8U9gZJrVnIWDljQZnGw_8@dx8akcxji
const CLOUDINARY_CLOUD_NAME = 'dx8akcxji';
const CLOUDINARY_API_KEY = '934537995483936';
const CLOUDINARY_API_SECRET = 'rhnHOM8U9gZJrVnIWDljQZnGw_8';
const CLOUDINARY_UPLOAD_PRESET = 'fnr_profile_pictures'; // Your new unsigned preset

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    username: '',
    dateOfBirth: '',
    phoneNumber: '',
    licenseType: '',
    bikeMake: '',
    bikeModel: '',
    bikeYear: '',
    bikeColor: '',
    profilePicture: null,
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownType, setDropdownType] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [bikeMakes, setBikeMakes] = useState([]);
  const [bikeModels, setBikeModels] = useState([]);
  const [bikeYears, setBikeYears] = useState([]);
  const [calculatedAge, setCalculatedAge] = useState(null);
  const [validationMessages, setValidationMessages] = useState({
    email: '',
    username: ''
  });
  const [isValidating, setIsValidating] = useState({
    email: false,
    username: false
  });
  const [isLoadingBikeData, setIsLoadingBikeData] = useState({
    models: false,
    years: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const navigation = useNavigation();

  const licenseTypes = ['L', 'RE', 'R'];
  const bikeColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Silver', 'Gray'];

  // Cloudinary upload function - Now using your unsigned preset
  const uploadToCloudinary = async (imageUri) => {
    try {
      setIsUploadingImage(true);
      
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header - let fetch handle it for FormData
        }
      );
      
      const result = await response.json();
      
      console.log('Cloudinary upload response:', result);
      
      if (result.secure_url) {
        console.log('Profile picture uploaded successfully:', result.secure_url);
        return result.secure_url;
      } else {
        console.error('Cloudinary upload failed - no secure_url:', result);
        throw new Error(`Upload failed: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error; // Re-throw to be handled by caller
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Image picker function
  const handleProfilePicturePress = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to upload a profile picture.', [], { cancelable: true });
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: false,
        quality: 0.7,
        base64: false,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        // Store the local image URI, don't upload yet
        setFormData(prev => ({ ...prev, profilePicture: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.', [], { cancelable: true });
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateString) => {
    if (!dateString) return null;
    
    // Remove slashes and spaces, keep only numbers
    const cleanDate = dateString.replace(/[\/\s]/g, '');
    
    // Check if we have exactly 8 digits (DDMMYYYY)
    if (cleanDate.length !== 8) return null;
    
    // Extract day, month, year
    const day = parseInt(cleanDate.substring(0, 2));
    const month = parseInt(cleanDate.substring(2, 4));
    const year = parseInt(cleanDate.substring(4, 8));
    
    // Validate the date
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
      return null;
    }
    
    // Create date object (month is 0-indexed in JavaScript)
    const birthDate = new Date(year, month - 1, day);
    
    // Check if the date is valid
    if (birthDate.getDate() !== day || birthDate.getMonth() !== month - 1 || birthDate.getFullYear() !== year) {
      return null;
    }
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : null;
  };

  // Validation functions
  const checkEmailExists = async (email) => {
    if (!email || !email.includes('@')) {
      setValidationMessages(prev => ({ ...prev, email: '' }));
      return;
    }

    setIsValidating(prev => ({ ...prev, email: true }));
    
    try {
      const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setValidationMessages(prev => ({ ...prev, email: 'An account with this email already exists' }));
      } else {
        setValidationMessages(prev => ({ ...prev, email: '' }));
      }
    } catch (error) {
      console.error('Error checking email:', error);
      // Don't show error message if we can't check - just clear validation
      setValidationMessages(prev => ({ ...prev, email: '' }));
    } finally {
      setIsValidating(prev => ({ ...prev, email: false }));
    }
  };

  const checkUsernameExists = async (username) => {
    if (!username || username.trim().length < 3) {
      setValidationMessages(prev => ({ ...prev, username: '' }));
      return;
    }

    setIsValidating(prev => ({ ...prev, username: true }));
    
    try {
      const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setValidationMessages(prev => ({ ...prev, username: 'Username taken' }));
      } else {
        setValidationMessages(prev => ({ ...prev, username: '' }));
      }
    } catch (error) {
      console.error('Error checking username:', error);
      // Don't show error message if we can't check - just clear validation
      setValidationMessages(prev => ({ ...prev, username: '' }));
    } finally {
      setIsValidating(prev => ({ ...prev, username: false }));
    }
  };

  // Debounced validation
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const debouncedEmailCheck = debounce(checkEmailExists, 500);
  const debouncedUsernameCheck = debounce(checkUsernameExists, 500);

  // API Ninjas Motorcycle API functions
  const fetchMotorcycleMakes = async () => {
    console.log('Using fallback motorcycle data (API requires premium subscription)');
    // Use fallback data since API requires premium subscription
    setBikeMakes(['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'Ducati', 'BMW', 'KTM', 'Aprilia', 'Triumph', 'Harley-Davidson', 'Indian', 'Victory', 'Buell', 'MV Agusta', 'Moto Guzzi']);
  };

  const fetchMotorcycleModels = async (make) => {
    setIsLoadingBikeData(prev => ({ ...prev, models: true }));
    
    // Use fallback data since API requires premium subscription
    const models = getFallbackModels(make);
    setIsLoadingBikeData(prev => ({ ...prev, models: false }));
    return models;
  };

  const fetchMotorcycleYears = async (make, model) => {
    setIsLoadingBikeData(prev => ({ ...prev, years: true }));
    
    // Use fallback data with 1980-current year range
    const years = getFallbackYears(make, model);
    setIsLoadingBikeData(prev => ({ ...prev, years: false }));
    return years;
  };

  // Fallback data functions
  const getFallbackModels = (make) => {
    const fallbackData = {
      'Honda': ['CBR600RR', 'CBR1000RR', 'CB650R', 'CRF300L', 'Rebel 500', 'Gold Wing', 'Africa Twin'],
      'Yamaha': ['YZF-R6', 'YZF-R1', 'MT-07', 'MT-09', 'Tenere 700', 'FZ-07', 'FZ-09'],
      'Kawasaki': ['Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Z650', 'Versys 650', 'Ninja H2'],
      'Suzuki': ['GSX-R600', 'GSX-R750', 'GSX-R1000', 'SV650', 'V-Strom 650', 'Hayabusa'],
      'Ducati': ['Panigale V2', 'Panigale V4', 'Monster 821', 'Monster 937', 'Scrambler Icon'],
      'BMW': ['S 1000 RR', 'R 1250 GS', 'F 900 R', 'K 1600 GT'],
      'KTM': ['1290 Super Duke R', '390 Duke', '890 Adventure', 'RC 390'],
      'Aprilia': ['RSV4', 'Tuono V4', 'RS 660'],
      'Triumph': ['Street Triple RS', 'Tiger 900', 'Bonneville T120', 'Speed Triple'],
      'Harley-Davidson': ['Sportster', 'Softail', 'Touring', 'Street'],
      'Indian': ['Scout', 'Chief', 'Chieftain', 'Roadmaster'],
      'Victory': ['Gunner', 'High-Ball', 'Judge'],
      'Buell': ['XBRR', '1125R', 'Firebolt'],
      'MV Agusta': ['F4', 'Brutale', 'Dragster'],
      'Moto Guzzi': ['V7', 'V9', 'California']
    };
    return fallbackData[make] || [];
  };

  const getFallbackYears = (make, model) => {
    // Return a range of years from 1980 to current year
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1980; year--) {
      years.push(year);
    }
    return years;
  };

  // Use comprehensive motorcycle database

  useEffect(() => {
    // Initialize bike makes from API Ninjas
    fetchMotorcycleMakes();
  }, []);

  useEffect(() => {
    // Calculate age when date of birth changes
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth);
      setCalculatedAge(age); // Will be null if invalid/incomplete
    } else {
      setCalculatedAge(null);
    }
  }, [formData.dateOfBirth]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Trigger validation for email and username
    if (field === 'email') {
      debouncedEmailCheck(value);
    } else if (field === 'username') {
      debouncedUsernameCheck(value);
    }
  };

  const showDropdownMenu = (type) => {
    setDropdownType(type);
    switch (type) {
      case 'license':
        setDropdownOptions(licenseTypes);
        break;
      case 'bikeMake':
        setDropdownOptions(bikeMakes);
        break;
      case 'bikeModel':
        if (formData.bikeMake) {
          fetchMotorcycleModels(formData.bikeMake).then(models => {
            setDropdownOptions(models);
          });
        }
        break;
      case 'bikeYear':
        if (formData.bikeMake && formData.bikeModel) {
          fetchMotorcycleYears(formData.bikeMake, formData.bikeModel).then(years => {
            setDropdownOptions(years);
          });
        }
        break;
      case 'bikeColor':
        setDropdownOptions(bikeColors);
        break;
    }
    setShowDropdown(true);
  };

  const selectDropdownOption = (option) => {
    switch (dropdownType) {
      case 'license':
        handleInputChange('licenseType', option);
        break;
      case 'bikeMake':
        handleInputChange('bikeMake', option);
        handleInputChange('bikeModel', ''); // Reset model when make changes
        handleInputChange('bikeYear', ''); // Reset year when make changes
        break;
      case 'bikeModel':
        handleInputChange('bikeModel', option);
        handleInputChange('bikeYear', ''); // Reset year when model changes
        break;
      case 'bikeYear':
        handleInputChange('bikeYear', option.toString());
        break;
      case 'bikeColor':
        handleInputChange('bikeColor', option);
        break;
    }
    setShowDropdown(false);
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        const { email, password, confirmPassword, displayName, username } = formData;
        
        // Check for validation errors
        if (validationMessages.email) {
          Alert.alert('Email Error', validationMessages.email, [], { cancelable: true });
          return false;
        }
        if (validationMessages.username) {
          Alert.alert('Username Error', validationMessages.username, [], { cancelable: true });
          return false;
        }
        
        if (!email || !email.includes('@')) {
          Alert.alert('Invalid Email', 'Please enter a valid email address.', [], { cancelable: true });
          return false;
        }
        if (!password || password.length < 6) {
          Alert.alert('Weak Password', 'Password must be at least 6 characters long.', [], { cancelable: true });
          return false;
        }
        if (password !== confirmPassword) {
          Alert.alert('Password Mismatch', 'Passwords do not match.', [], { cancelable: true });
          return false;
        }
        if (!displayName || displayName.trim().length < 2) {
          Alert.alert('Invalid Name', 'Please enter a valid display name.', [], { cancelable: true });
          return false;
        }
        if (!username || username.trim().length < 3) {
          Alert.alert('Invalid Username', 'Username must be at least 3 characters long.', [], { cancelable: true });
          return false;
        }
        return true;
      case 2:
        // Profile picture and bio step - both required
        if (!formData.bio || formData.bio.trim().length < 10) {
          Alert.alert('Missing Information', 'Please write a bio about your ride (at least 10 characters).', [], { cancelable: true });
          return false;
        }
        return true;
      case 3:
        if (!formData.dateOfBirth) {
          Alert.alert('Missing Information', 'Please enter your date of birth.', [], { cancelable: true });
          return false;
        }
        if (!formData.licenseType) {
          Alert.alert('Missing Information', 'Please select your license type.', [], { cancelable: true });
          return false;
        }
        return true;
      case 4:
        if (!formData.bikeMake || !formData.bikeModel || !formData.bikeYear) {
          Alert.alert('Missing Information', 'Please complete all bike information.', [], { cancelable: true });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const validateForm = () => {
    const { email, password, confirmPassword, displayName, username, dateOfBirth } = formData;

    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.', [], { cancelable: true });
      return false;
    }

    if (!password || password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.', [], { cancelable: true });
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.', [], { cancelable: true });
      return false;
    }

    if (!displayName || displayName.trim().length < 2) {
      Alert.alert('Invalid Name', 'Please enter a valid display name.', [], { cancelable: true });
      return false;
    }

    if (!username || username.trim().length < 3) {
      Alert.alert('Invalid Username', 'Username must be at least 3 characters long.', [], { cancelable: true });
      return false;
    }

    if (!dateOfBirth) {
      Alert.alert('Missing Information', 'Please enter your date of birth.', [], { cancelable: true });
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateCurrentStep()) return;

    setIsLoading(true);

    try {
      const auth = getAuth();
      
      // Upload profile picture to Cloudinary first (if one was selected)
      let profilePictureUrl = null;
      if (formData.profilePicture) {
        try {
          profilePictureUrl = await uploadToCloudinary(formData.profilePicture);
          console.log('Profile picture uploaded successfully:', profilePictureUrl);
        } catch (uploadError) {
          console.error('Profile picture upload failed:', uploadError);
          // For now, skip the upload and continue with account creation
          // The user can update their profile picture later
          profilePictureUrl = null;
          Alert.alert('Upload Warning', 'Account created but profile picture upload failed. You can update it later.', [], { cancelable: true });
        }
      }
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: formData.displayName.trim()
      });

      // Create user document in Firestore
      const userData = {
        uid: user.uid,
        email: formData.email,
        displayName: formData.displayName.trim(),
        username: formData.username.trim(),
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber || null,
        licenseType: formData.licenseType || null,
        bikeMake: formData.bikeMake || null,
        bikeModel: formData.bikeModel || null,
        bikeYear: formData.bikeYear || null,
        bikeColor: formData.bikeColor || null,
        profilePicture: profilePictureUrl,
        bio: formData.bio || null,
        dateCreated: new Date().toISOString(),
        dateLastAccessed: new Date().toISOString(),
        isActive: true,
      };

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, userData);

      Alert.alert(
        'Welcome to FNR!', 
        'Your account has been created successfully. You can now join Friday Night Rides!',
        [{ text: 'OK', onPress: () => {
          // Navigation will be handled automatically by App.js
        }}],
        { cancelable: true }
      );

    } catch (error) {
      console.error('Sign up error:', error);
      
      let message = 'Something went wrong. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already registered. Please use a different email or try logging in.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          message = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/operation-not-allowed':
          message = 'Email/password accounts are not enabled. Please contact support.';
          break;
        default:
          console.log('Unhandled signup error:', error.code, error.message);
      }

      Alert.alert('Sign Up Failed', message, [], { cancelable: true });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      
      <View style={styles.inputContainer}>
        <Feather name="user" size={18} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Display Name"
          placeholderTextColor="#888"
          style={styles.input}
          value={formData.displayName}
          onChangeText={(value) => handleInputChange('displayName', value)}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Feather name="at-sign" size={18} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Username"
          placeholderTextColor="#888"
          style={styles.input}
          value={formData.username}
          onChangeText={(value) => handleInputChange('username', value)}
          autoCapitalize="none"
        />
        {isValidating.username && (
          <Feather name="loader" size={16} color="#FFFFFF" style={styles.loadingIcon} />
        )}
        {!isValidating.username && formData.username && formData.username.trim().length >= 3 && !validationMessages.username && (
          <Feather name="check-circle" size={20} color="#4CAF50" style={styles.successIcon} />
        )}
      </View>
      {validationMessages.username ? (
        <Text style={styles.errorText}>{validationMessages.username}</Text>
      ) : null}

      <View style={styles.inputContainer}>
        <Feather name="mail" size={18} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.input}
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {isValidating.email && (
          <Feather name="loader" size={16} color="#FFFFFF" style={styles.loadingIcon} />
        )}
      </View>
      {validationMessages.email ? (
        <Text style={styles.errorText}>{validationMessages.email}</Text>
      ) : null}

      <View style={styles.inputContainer}>
        <Feather name="lock" size={18} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          style={styles.input}
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Feather 
            name={showPassword ? "eye-off" : "eye"} 
            size={18} 
            color="#888" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Feather name="lock" size={18} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          style={styles.input}
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          secureTextEntry
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Profile Setup</Text>
      
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity 
          style={styles.profilePictureButton}
          onPress={handleProfilePicturePress}
          disabled={isUploadingImage}
        >
          {formData.profilePicture ? (
            <Image 
              source={{ uri: formData.profilePicture }} 
              style={styles.profilePictureImage}
              resizeMode="cover"
            />
          ) : (
            <>
              <Feather name="camera" size={24} color="#888" />
              <Text style={styles.profilePictureText}>
                {isUploadingImage ? 'Uploading...' : 'Add Profile Picture'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Tell us about your ride! (Required)"
          placeholderTextColor="#888"
          style={[styles.input, styles.bioInput]}
          value={formData.bio}
          onChangeText={(value) => handleInputChange('bio', value)}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
        <Feather name="edit-3" size={18} color="#888" style={styles.icon} />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Riding Information</Text>
      
      <View style={styles.inputContainer}>
        <Feather name="calendar" size={18} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Date of Birth (DD/MM/YYYY)"
          placeholderTextColor="#888"
          style={styles.input}
          value={formData.dateOfBirth}
          onChangeText={(value) => handleInputChange('dateOfBirth', value)}
        />
      </View>

      {calculatedAge && (
        <View style={styles.ageConfirmation}>
          <Text style={styles.ageText}>You are {calculatedAge} years old</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={() => showDropdownMenu('license')}
      >
        <Text style={[styles.dropdownText, !formData.licenseType && styles.placeholderText]}>
          {formData.licenseType || 'Select License Type'}
        </Text>
        <Feather name="chevron-down" size={20} color="#888" />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Feather name="phone" size={18} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Phone Number (Optional)"
          placeholderTextColor="#888"
          style={styles.input}
          value={formData.phoneNumber}
          onChangeText={(value) => handleInputChange('phoneNumber', value)}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Bike</Text>
      
      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={() => showDropdownMenu('bikeMake')}
      >
        <Text style={[styles.dropdownText, !formData.bikeMake && styles.placeholderText]}>
          {formData.bikeMake || 'Select Bike Make'}
        </Text>
        <Feather name="chevron-down" size={20} color="#888" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.dropdownButton, !formData.bikeMake && styles.disabledButton]} 
        onPress={() => formData.bikeMake && showDropdownMenu('bikeModel')}
        disabled={!formData.bikeMake}
      >
        <Text style={[styles.dropdownText, !formData.bikeModel && styles.placeholderText]}>
          {isLoadingBikeData.models ? 'Loading models...' : (formData.bikeModel || 'Select Bike Model')}
        </Text>
        <Feather name="chevron-down" size={20} color="#888" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.dropdownButton, !formData.bikeModel && styles.disabledButton]} 
        onPress={() => formData.bikeModel && showDropdownMenu('bikeYear')}
        disabled={!formData.bikeModel}
      >
        <Text style={[styles.dropdownText, !formData.bikeYear && styles.placeholderText]}>
          {isLoadingBikeData.years ? 'Loading years...' : (formData.bikeYear || 'Select Bike Year')}
        </Text>
        <Feather name="chevron-down" size={20} color="#888" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={() => showDropdownMenu('bikeColor')}
      >
        <Text style={[styles.dropdownText, !formData.bikeColor && styles.placeholderText]}>
          {formData.bikeColor || 'Select Bike Color'}
        </Text>
        <Feather name="chevron-down" size={20} color="#888" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../../assets/blue-helmet.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Join Friday Night Rides</Text>
          <Text style={styles.subtitle}>Step {currentStep} of 4</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${(currentStep / 4) * 100}%` }]} />
          </View>

          {/* Render Current Step */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            {currentStep > 1 && (
              <TouchableOpacity style={styles.prevBtn} onPress={prevStep}>
                <Text style={styles.prevBtnText}>Previous</Text>
              </TouchableOpacity>
            )}
            
            {currentStep < 4 ? (
              <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
                <Text style={styles.nextBtnText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.signUpBtn, isLoading && styles.disabledBtn]} 
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={styles.signUpText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}> Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {dropdownType === 'license' && 'Select License Type'}
                {dropdownType === 'bikeMake' && 'Select Bike Make'}
                {dropdownType === 'bikeModel' && 'Select Bike Model'}
                {dropdownType === 'bikeYear' && 'Select Bike Year'}
                {dropdownType === 'bikeColor' && 'Select Bike Color'}
              </Text>
              <TouchableOpacity onPress={() => setShowDropdown(false)}>
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={dropdownOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectDropdownOption(item)}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 24,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'FugazOne_400Regular',
    marginBottom: 4,
    alignSelf: 'center',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
    alignSelf: 'center',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 32,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1877F2',
    borderRadius: 2,
  },
  stepContainer: {
    marginBottom: 32,
  },
  stepTitle: {
    color: '#1877F2',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
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
  loadingIcon: {
    marginLeft: 8,
  },
  successIcon: {
    marginLeft: 8,
  },
  successIndicator: {
    marginLeft: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  ageConfirmation: {
    backgroundColor: '#1877F2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  ageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownButton: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  placeholderText: {
    color: '#888',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  prevBtn: {
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  prevBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: '#1877F2',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  signUpBtn: {
    backgroundColor: '#1877F2',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  disabledBtn: {
    backgroundColor: '#666',
  },
  signUpText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#aaa',
    fontSize: 16,
  },
  loginLink: {
    color: '#1877F2',
    fontSize: 14,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePictureButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#555',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureText: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  profilePictureImage: {
    width: 136,
    height: 136,
    borderRadius: 68,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  eyeIcon: {
    padding: 8,
  },
});

export default SignUp;

