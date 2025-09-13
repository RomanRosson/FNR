import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const riders = [
  {
    id: '1',
    name: 'Alex Rider',
    bike: 'Yamaha R1',
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
  {
    id: '2',
    name: 'Mia Thompson',
    bike: 'Kawasaki Ninja ZX-6R',
    avatar: 'https://i.pravatar.cc/100?img=6',
  },
  {
    id: '3',
    name: 'Jake Storm',
    bike: 'Ducati Panigale V2',
    avatar: 'https://i.pravatar.cc/100?img=7',
  },
];

const RidersScreen = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.bike}>{item.bike}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Find Riders</Text>
      <FlatList
        data={riders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default RidersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1f1f1f',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  bike: {
    fontSize: 14,
    color: '#bbb',
  },
});
