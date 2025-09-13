import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

const Profile = ({ navigation }) => {
  const handleLogout = () => {
  const auth = getAuth();
    signOut(auth)
      .then(() => {
        // No manual navigation needed — App.js will react to the user state change
      })
      .catch((error) => {
        console.error('Logout error:', error);
        Alert.alert('Logout Failed', 'Please try again.');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <Image
          source={require('../../assets/FNR_800.jpg')} // Replace with your own image
          style={styles.avatar}
        />
        <Text style={styles.name}>Rider Name</Text>
        <Text style={styles.email}>youremail@example.com</Text>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 24,
    alignItems: 'center',
  },
  profileBox: {
    alignItems: 'center',
    marginTop: 80,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2a2a2a',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#aaa',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    width: '100%',
    marginVertical: 40,
  },
  logoutBtn: {
    backgroundColor: '#E53935',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
