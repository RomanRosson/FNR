import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const RidersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Add Friend Modal states
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [addFriendSearchQuery, setAddFriendSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [friendRequests, setFriendRequests] = useState({});

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadFriends();
    }
  }, [currentUser]);

  useEffect(() => {
    filterFriends();
  }, [searchQuery, friends]);

  const loadCurrentUser = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
        await loadFriendRequests(user.uid);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadFriends = async () => {
    try {
      setIsLoading(true);
      // For now, we'll show accepted friend requests as friends
      // In a real app, you'd have a separate friends collection
      const requestsRef = collection(db, 'friendRequests');
      const acceptedQuery = query(
        requestsRef, 
        where('senderId', '==', currentUser.uid),
        where('status', '==', 'accepted')
      );
      const receivedQuery = query(
        requestsRef, 
        where('receiverId', '==', currentUser.uid),
        where('status', '==', 'accepted')
      );
      
      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(acceptedQuery),
        getDocs(receivedQuery)
      ]);
      
      const friendIds = new Set();
      
      // Add friends from sent requests
      sentSnapshot.forEach((doc) => {
        friendIds.add(doc.data().receiverId);
      });
      
      // Add friends from received requests
      receivedSnapshot.forEach((doc) => {
        friendIds.add(doc.data().senderId);
      });
      
      // Fetch friend details
      const friendsList = [];
      for (const friendId of friendIds) {
        try {
          const userDoc = await getDoc(doc(db, 'users', friendId));
          if (userDoc.exists()) {
            friendsList.push({
              id: friendId,
              ...userDoc.data()
            });
          }
        } catch (error) {
          console.error('Error fetching friend details:', error);
        }
      }
      
      setFriends(friendsList);
    } catch (error) {
      console.error('Error loading friends:', error);
      Alert.alert('Error', 'Failed to load friends. Please try again.', [], { cancelable: true });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFriendRequests = async (userId) => {
    try {
      const requestsRef = collection(db, 'friendRequests');
      const sentQuery = query(requestsRef, where('senderId', '==', userId));
      const sentSnapshot = await getDocs(sentQuery);
      
      const requests = {};
      sentSnapshot.forEach((doc) => {
        const requestData = doc.data();
        requests[requestData.receiverId] = requestData.status;
      });
      
      setFriendRequests(requests);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  const filterFriends = () => {
    if (!searchQuery.trim()) {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter(friend => 
        friend.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  };

  const searchForNewFriends = async () => {
    if (!addFriendSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const results = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.isActive && 
            userData.uid !== currentUser?.uid &&
            (userData.username?.toLowerCase().includes(addFriendSearchQuery.toLowerCase()) ||
             userData.displayName?.toLowerCase().includes(addFriendSearchQuery.toLowerCase()))) {
          results.push({
            id: doc.id,
            ...userData
          });
        }
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for users:', error);
      Alert.alert('Error', 'Failed to search for users. Please try again.', [], { cancelable: true });
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (receiverId) => {
    if (!currentUser) return;
    
    try {
      const requestData = {
        senderId: currentUser.uid,
        receiverId: receiverId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        senderUsername: currentUser.displayName || 'Unknown',
        receiverUsername: searchResults.find(r => r.uid === receiverId)?.username || 'Unknown'
      };

      const requestRef = doc(db, 'friendRequests', `${currentUser.uid}_${receiverId}`);
      await setDoc(requestRef, requestData);

      // Update local state
      setFriendRequests(prev => ({
        ...prev,
        [receiverId]: 'pending'
      }));

      Alert.alert('Friend Request Sent', 'Your friend request has been sent successfully!', [], { cancelable: true });
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request. Please try again.', [], { cancelable: true });
    }
  };

  const getFriendRequestStatus = (userId) => {
    return friendRequests[userId] || 'none';
  };

  const getAddFriendButton = (user) => {
    const status = getFriendRequestStatus(user.uid);
    
    switch (status) {
      case 'pending':
        return (
          <TouchableOpacity style={styles.pendingButton} disabled>
            <Feather name="clock" size={16} color="#FFA500" />
            <Text style={styles.pendingText}>Pending</Text>
          </TouchableOpacity>
        );
      case 'accepted':
        return (
          <TouchableOpacity style={styles.friendsButton} disabled>
            <Feather name="check" size={16} color="#4CAF50" />
            <Text style={styles.friendsText}>Friends</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => sendFriendRequest(user.uid)}
          >
            <Feather name="user-plus" size={16} color="#1877F2" />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        );
    }
  };

  const renderFriendItem = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ 
          uri: item.profilePicture || 'https://i.pravatar.cc/100?img=5' 
        }} 
        style={styles.avatar} 
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.displayName || 'Friend'}</Text>
        <Text style={styles.username}>@{item.username || 'username'}</Text>
        <Text style={styles.bike}>
          {item.bikeMake && item.bikeModel ? 
            `${item.bikeMake} ${item.bikeModel}` : 
            'No bike info'
          }
        </Text>
      </View>
    </View>
  );

  const renderSearchResultItem = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ 
          uri: item.profilePicture || 'https://i.pravatar.cc/100?img=5' 
        }} 
        style={styles.avatar} 
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.displayName || 'User'}</Text>
        <Text style={styles.username}>@{item.username || 'username'}</Text>
        <Text style={styles.bike}>
          {item.bikeMake && item.bikeModel ? 
            `${item.bikeMake} ${item.bikeModel}` : 
            'No bike info'
          }
        </Text>
      </View>
      {getAddFriendButton(item)}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1877F2" />
          <Text style={styles.loadingText}>Loading friends...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Friends</Text>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.addFriendBtn}
            onPress={() => setShowAddFriendModal(true)}
          >
            <Feather name="user-plus" size={20} color="#1877F2" />
          </TouchableOpacity>
        </View>
      </View>

      {filteredFriends.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="users" size={48} color="#666" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'No friends found matching your search' : 'No friends yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {!searchQuery && 'Tap the + button to add friends'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.id}
          renderItem={renderFriendItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Friend Modal */}
      <Modal
        visible={showAddFriendModal}
        animationType="slide"
        onRequestClose={() => setShowAddFriendModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddFriendModal(false)}>
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalSearchContainer}>
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search by username..."
              placeholderTextColor="#666"
              value={addFriendSearchQuery}
              onChangeText={(text) => {
                setAddFriendSearchQuery(text);
                // Debounce search
                setTimeout(() => {
                  if (text === addFriendSearchQuery) {
                    searchForNewFriends();
                  }
                }, 500);
              }}
            />
            {addFriendSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => {
                setAddFriendSearchQuery('');
                setSearchResults([]);
              }}>
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1877F2" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="search" size={48} color="#666" />
              <Text style={styles.emptyText}>
                {addFriendSearchQuery ? 'No users found' : 'Search for users to add as friends'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderSearchResultItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default RidersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 4,
  },
  addFriendBtn: {
    marginLeft: 8,
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#1877F2',
    marginBottom: 4,
  },
  bike: {
    fontSize: 14,
    color: '#bbb',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1877F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  pendingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    opacity: 0.7,
  },
  pendingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  friendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    opacity: 0.7,
  },
  friendsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  modalSearchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 4,
  },
});
