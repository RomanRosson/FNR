import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const DashboardScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.banner}>
        <Text style={styles.bannerText}>Friday Night Rides</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Welcome to FNR</Text>

        {/* 🔥 Ride Planning */}
        <View style={styles.card}>
          <Text style={styles.cardText}>🏍️ Plan your next ride</Text>
        </View>

        {/* 📍 Popular Meetups */}
        <View style={styles.card}>
          <Text style={styles.cardText}>🔥 Popular Meetups</Text>
        </View>

        {/* 🕒 Recent Activity */}
        <View style={styles.card}>
          <Text style={styles.cardText}>🕒 Recent Rides</Text>
        </View>

        {/* 📸 Gallery Teaser */}
        <View style={styles.card}>
          <Text style={styles.cardText}>📸 View Ride Photos</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  banner: {
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: '#202020ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bannerText: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'FugazOne_400Regular',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#eee',
  },
});
