import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Image, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  SafeAreaView,
  Modal,
  FlatList
} from 'react-native';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';

const Profile = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [tempProfile, setTempProfile] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownType, setDropdownType] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Dropdown options
  const licenseTypes = ['L', 'RE', 'R'];
  const bikeColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Silver', 'Gray'];
  
  // Generate years from 1980 to current year
  const currentYear = new Date().getFullYear();
  const bikeYears = [];
  for (let year = currentYear; year >= 1980; year--) {
    bikeYears.push(year.toString());
  }
  
  // Mock bike data for dropdowns
  const bikeMakes = ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'Harley-Davidson', 'KTM', 'Triumph', 'Aprilia'];
  const bikeModels = {
    'Honda': ['CBR600RR', 'CBR1000RR', 'CB650R', 'CB1000R', 'CRF450R', 'CRF250L', 'Rebel 300', 'Rebel 500'],
    'Yamaha': ['YZF-R6', 'YZF-R1', 'MT-07', 'MT-09', 'YZF-R3', 'FZ-07', 'FZ-09', 'WR250R'],
    'Kawasaki': ['Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Ninja H2', 'Z900', 'Versys 650', 'Vulcan S'],
    'Suzuki': ['GSX-R600', 'GSX-R750', 'GSX-R1000', 'SV650', 'GSX-S750', 'DR-Z400', 'V-Strom 650'],
    'BMW': ['S1000RR', 'R1250GS', 'F850GS', 'R nineT', 'K1600GT', 'F800GS', 'R1200RT'],
    'Ducati': ['Panigale V4', 'Monster 821', 'Multistrada 950', 'Scrambler', 'Diavel', 'Streetfighter V4'],
    'Harley-Davidson': ['Sportster', 'Softail', 'Touring', 'Street', 'Fat Boy', 'Road King', 'Electra Glide'],
    'KTM': ['Duke 390', 'Duke 790', 'Duke 1290', 'RC 390', 'RC 8C', 'Adventure 790', 'Adventure 1290'],
    'Triumph': ['Street Triple', 'Speed Triple', 'Tiger 800', 'Tiger 1200', 'Bonneville', 'Rocket 3', 'Scrambler'],
    'Aprilia': ['RSV4', 'Tuono V4', 'Shiver 900', 'Dorsoduro 900', 'RS 660', 'Tuono 660']
  };

  useEffect(() => {
    const loadUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        await loadUserProfile(user.uid);
      }
    };
    
    loadUserData();
  }, []);

  const loadUserProfile = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile(userData);
        setTempProfile(userData);
      } else {
        await createUserDocument(uid);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const createUserDocument = async (uid) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      const userData = {
        uid: uid,
        email: user.email,
        displayName: user.displayName || 'Rider Name',
        username: user.displayName || 'Rider Name',
        dateCreated: new Date().toISOString(),
        dateLastAccessed: new Date().toISOString(),
        profilePicture: null,
        bio: null,
        dateOfBirth: null,
        phoneNumber: null,
        licenseType: null,
        bikeMake: null,
        bikeModel: null,
        bikeYear: null,
        bikeColor: null,
        isActive: true,
      };
      
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, userData);
      setUserProfile(userData);
      setTempProfile(userData);
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfile({ ...userProfile });
  };

  const handleSave = async () => {
    if (!tempProfile.displayName?.trim()) {
      Alert.alert('Invalid Name', 'Please enter a valid display name.', [], { cancelable: true });
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      // Update Firebase Auth
      await updateProfile(user, {
        displayName: tempProfile.displayName.trim()
      });
      
      // Update Firestore user document
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        ...tempProfile,
        dateLastAccessed: new Date().toISOString(),
      });
      
      setUserProfile({ ...tempProfile });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!', [], { cancelable: true });
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Update Failed', 'Please try again.', [], { cancelable: true });
    }
  };

  const handleCancel = () => {
    setTempProfile({ ...userProfile });
    setIsEditing(false);
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // No manual navigation needed — App.js will react to the user state change
      })
      .catch((error) => {
        console.error('Logout error:', error);
        Alert.alert('Logout Failed', 'Please try again.', [], { cancelable: true });
      });
  };

  // Profile picture upload function
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
        base64: false,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        // For now, just update the local profile
        // In a real app, you'd upload to Cloudinary here
        setTempProfile({...tempProfile, profilePicture: result.assets[0].uri});
        Alert.alert('Success', 'Profile picture updated! Save your changes to apply.', [], { cancelable: true });
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.', [], { cancelable: true });
    }
  };

  // Dropdown functions
  const showDropdownMenu = (type) => {
    setDropdownType(type);
    setShowDropdown(true);
  };

  const selectDropdownOption = (option) => {
    const updatedProfile = {...tempProfile, [dropdownType]: option};
    
    // If changing bike make, clear the model
    if (dropdownType === 'bikeMake') {
      updatedProfile.bikeModel = null;
    }
    
    setTempProfile(updatedProfile);
    setShowDropdown(false);
  };

  const getDropdownOptions = () => {
    switch (dropdownType) {
      case 'licenseType':
        return licenseTypes;
      case 'bikeMake':
        return bikeMakes;
      case 'bikeModel':
        return bikeModels[tempProfile.bikeMake] || [];
      case 'bikeYear':
        return bikeYears;
      case 'bikeColor':
        return bikeColors;
      default:
        return [];
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      // Handle DDMMYYYY format (no slashes)
      if (dateString.length === 8 && !dateString.includes('/')) {
        const day = dateString.substring(0, 2);
        const month = dateString.substring(2, 4);
        const year = dateString.substring(4, 8);
        return `${day}/${month}/${year}`;
      }
      
      // Handle DD/MM/YYYY format (with slashes)
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const day = parts[0];
          const month = parts[1];
          const year = parts[2];
          // Return the original format if it looks valid
          if (day && month && year && day.length >= 1 && month.length >= 1 && year.length === 4) {
            return `${day}/${month}/${year}`;
          }
        }
      }
      
      // Handle ISO date format
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-AU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      
      return 'Invalid date';
    } catch (error) {
      return 'Invalid date';
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    try {
      let date;
      
      // Handle DDMMYYYY format (no slashes)
      if (dob.length === 8 && !dob.includes('/')) {
        const day = dob.substring(0, 2);
        const month = dob.substring(2, 4);
        const year = dob.substring(4, 8);
        
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        
        // Basic validation
        if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= new Date().getFullYear()) {
          date = new Date(yearNum, monthNum - 1, dayNum);
        }
      }
      // Handle DD/MM/YYYY format
      else if (dob.includes('/')) {
        const parts = dob.split('/');
        if (parts.length === 3) {
          const day = parts[0];
          const month = parts[1];
          const year = parts[2];
          // More flexible validation - allow single digit day/month
          if (day && month && year && year.length === 4) {
            const dayNum = parseInt(day, 10);
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt(year, 10);
            
            // Basic validation
            if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= new Date().getFullYear()) {
              date = new Date(yearNum, monthNum - 1, dayNum);
            }
          }
        }
      } else {
        date = new Date(dob);
      }
      
      if (!date || isNaN(date.getTime())) return null;
      
      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      return null;
    }
  };

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {isEditing ? (
                <TouchableOpacity onPress={handleProfilePicturePress}>
                  {(tempProfile.profilePicture || userProfile.profilePicture) ? (
                    <Image
                      source={{ uri: tempProfile.profilePicture || userProfile.profilePicture }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Feather name="user" size={40} color="#666" />
                    </View>
                  )}
                  <View style={styles.editPhotoOverlay}>
                    <Feather name="camera" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              ) : (
                (userProfile.profilePicture || tempProfile.profilePicture) ? (
                  <Image
                    source={{ uri: userProfile.profilePicture || tempProfile.profilePicture }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Feather name="user" size={40} color="#666" />
                  </View>
                )
              )}
            </View>
            
            <View style={styles.nameContainer}>
              {isEditing ? (
                <TextInput
                  style={styles.nameInput}
                  value={tempProfile.displayName || ''}
                  onChangeText={(text) => setTempProfile({...tempProfile, displayName: text})}
                  placeholder="Enter display name"
                  placeholderTextColor="#666"
                  autoFocus={true}
                  maxLength={30}
                />
              ) : (
                <Text style={styles.name}>{userProfile.displayName || 'Rider Name'}</Text>
              )}
            </View>
            
            <Text style={styles.username}>@{userProfile.username || 'username'}</Text>
            
            {userProfile.bio && (
              <Text style={styles.bio}>{userProfile.bio}</Text>
            )}
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Username</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={tempProfile.username || ''}
                  onChangeText={(text) => setTempProfile({...tempProfile, username: text})}
                  placeholder="Enter username"
                  placeholderTextColor="#666"
                />
              ) : (
                <Text style={styles.infoValue}>{userProfile.username || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={tempProfile.dateOfBirth || ''}
                  onChangeText={(text) => setTempProfile({...tempProfile, dateOfBirth: text})}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#666"
                />
              ) : (
                <Text style={styles.infoValue}>
                  {formatDate(userProfile.dateOfBirth)}
                  {userProfile.dateOfBirth && calculateAge(userProfile.dateOfBirth) !== null && ` (${calculateAge(userProfile.dateOfBirth)} years old)`}
                </Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={tempProfile.phoneNumber || ''}
                  onChangeText={(text) => setTempProfile({...tempProfile, phoneNumber: text})}
                  placeholder="Enter phone number"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{userProfile.phoneNumber || 'Not provided'}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>License Type</Text>
              {isEditing ? (
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => showDropdownMenu('licenseType')}
                >
                  <Text style={styles.dropdownButtonText}>
                    {tempProfile.licenseType || 'Select license type'}
                  </Text>
                  <Feather name="chevron-down" size={16} color="#1877F2" />
                </TouchableOpacity>
              ) : (
                <Text style={styles.infoValue}>{userProfile.licenseType || 'Not specified'}</Text>
              )}
            </View>
          </View>

          {/* Bike Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Bike</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Make</Text>
              {isEditing ? (
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => showDropdownMenu('bikeMake')}
                >
                  <Text style={styles.dropdownButtonText}>
                    {tempProfile.bikeMake || 'Select bike make'}
                  </Text>
                  <Feather name="chevron-down" size={16} color="#1877F2" />
                </TouchableOpacity>
              ) : (
                <Text style={styles.infoValue}>{userProfile.bikeMake || 'Not specified'}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Model</Text>
              {isEditing ? (
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => showDropdownMenu('bikeModel')}
                  disabled={!tempProfile.bikeMake}
                >
                  <Text style={[styles.dropdownButtonText, !tempProfile.bikeMake && styles.disabledText]}>
                    {tempProfile.bikeModel || 'Select bike model'}
                  </Text>
                  <Feather name="chevron-down" size={16} color={tempProfile.bikeMake ? "#1877F2" : "#666"} />
                </TouchableOpacity>
              ) : (
                <Text style={styles.infoValue}>{userProfile.bikeModel || 'Not specified'}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Year</Text>
              {isEditing ? (
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => showDropdownMenu('bikeYear')}
                >
                  <Text style={styles.dropdownButtonText}>
                    {tempProfile.bikeYear || 'Select bike year'}
                  </Text>
                  <Feather name="chevron-down" size={16} color="#1877F2" />
                </TouchableOpacity>
              ) : (
                <Text style={styles.infoValue}>{userProfile.bikeYear || 'Not specified'}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Color</Text>
              {isEditing ? (
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => showDropdownMenu('bikeColor')}
                >
                  <Text style={styles.dropdownButtonText}>
                    {tempProfile.bikeColor || 'Select bike color'}
                  </Text>
                  <Feather name="chevron-down" size={16} color="#1877F2" />
                </TouchableOpacity>
              ) : (
                <Text style={styles.infoValue}>{userProfile.bikeColor || 'Not specified'}</Text>
              )}
            </View>
          </View>

          {/* Account Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{formatDate(userProfile.dateCreated)}</Text>
            </View>

            <TouchableOpacity style={styles.deactivateBtn}>
              <Text style={styles.deactivateText}>Deactivate my account</Text>
            </TouchableOpacity>
          </View>

          {/* Edit Buttons */}
          {isEditing && (
            <View style={styles.editButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Feather name="x" size={20} color="#fff" />
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Feather name="check" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editProfileBtn} onPress={handleEdit}>
              <Feather name="edit-2" size={20} color="#1877F2" />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Feather name="log-out" size={20} color="#E53935" />
              <Text style={styles.logoutText}>Logout</Text>
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
                Select {dropdownType === 'licenseType' ? 'License Type' : 
                       dropdownType === 'bikeMake' ? 'Bike Make' :
                       dropdownType === 'bikeModel' ? 'Bike Model' :
                       dropdownType === 'bikeYear' ? 'Bike Year' :
                       dropdownType === 'bikeColor' ? 'Bike Color' : ''}
              </Text>
              <TouchableOpacity onPress={() => setShowDropdown(false)}>
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={getDropdownOptions()}
              keyExtractor={(item) => item}
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

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2a2a2a',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#1877F2',
    minWidth: 200,
  },
  email: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  infoLabel: {
    fontSize: 14,
    color: '#aaa',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    flex: 2,
    textAlign: 'right',
  },
  infoInput: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1877F2',
    flex: 2,
    textAlign: 'right',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 20,
  },
  cancelBtn: {
    backgroundColor: '#666',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#1877F2',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  editProfileBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1877F2',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 10,
  },
  editProfileText: {
    color: '#1877F2',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E53935',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginLeft: 10,
  },
  logoutText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    fontSize: 14,
    color: '#1877F2',
    marginBottom: 8,
  },
  editPhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1877F2',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1877F2',
    flex: 2,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
    textAlign: 'right',
  },
  disabledText: {
    color: '#666',
  },
  deactivateBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  deactivateText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#fff',
  },
});
