import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const events = [
  {
    id: '1',
    title: 'Friday Night Ride - Sydney',
    date: 'Sep 13, 2025',
    location: 'Sydney Olympic Park',
  },
  {
    id: '2',
    title: 'Coastal Cruise - Gold Coast',
    date: 'Sep 15, 2025',
    location: 'Surfers Paradise',
  },
  {
    id: '3',
    title: 'Melbourne Meetup',
    date: 'Sep 20, 2025',
    location: 'Flinders Street Station',
  },
];

const EventsScreen = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.date}</Text>
      <Text style={styles.meta}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default EventsScreen;

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
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    color: '#aaa',
  },
});
