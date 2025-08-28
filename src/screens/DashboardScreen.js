import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, layout } from '../theme';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import QuickStats from '../components/dashboard/QuickStats';
import FeedPost from '../components/dashboard/FeedPost';

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [feedPosts, setFeedPosts] = useState([]);
  const [weatherAlert, setWeatherAlert] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Simulate loading data
    setFeedPosts([
      {
        id: 1,
        user: {
          name: 'Mike "Thunder" Johnson',
          avatar: 'https://example.com/avatar1.jpg',
          role: 'gold',
        },
        content: 'Just finished an epic ride through the Blue Mountains! Perfect weather and amazing views. Who's up for next weekend? 🏍️',
        timestamp: '2 hours ago',
        likes: 24,
        comments: 8,
        type: 'ride',
      },
      {
        id: 2,
        user: {
          name: 'Sarah "Speed" Chen',
          avatar: 'https://example.com/avatar2.jpg',
          role: 'silver',
        },
        content: 'New bike day! Finally got my hands on the Ducati Panigale V4. Can't wait to hit the track! 🔥',
        timestamp: '5 hours ago',
        likes: 42,
        comments: 15,
        type: 'bike',
        image: 'https://example.com/bike1.jpg',
      },
      {
        id: 3,
        user: {
          name: 'FNR Sydney',
          avatar: 'https://example.com/fnr-logo.jpg',
          role: 'platinum',
        },
        content: '🚨 WEATHER ALERT: Heavy rain expected in Sydney CBD from 6-8 PM. Tonight\'s FNR is CANCELLED. Stay safe riders!',
        timestamp: '1 hour ago',
        likes: 67,
        comments: 23,
        type: 'alert',
        isAlert: true,
      },
    ]);

    // Simulate weather alert
    setWeatherAlert({
      type: 'rain',
      message: 'Rain expected in 15 minutes',
      severity: 'moderate',
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleCreatePost = () => {
    Alert.alert('Create Post', 'This feature will be available soon!');
  };

  const handlePostAction = (postId, action) => {
    // Handle like, comment, share actions
    console.log(`${action} post ${postId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Ionicons name="bicycle" size={24} color={colors.primary} />
          </View>
          <Text style={styles.appTitle}>FNR</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Weather Alert Banner */}
        {weatherAlert && (
          <Card variant="primary" style={styles.weatherAlert}>
            <View style={styles.alertContent}>
              <Ionicons 
                name="warning" 
                size={20} 
                color={colors.textPrimary} 
              />
              <Text style={styles.alertText}>{weatherAlert.message}</Text>
            </View>
          </Card>
        )}

        {/* Quick Stats */}
        <QuickStats />

        {/* Weather Widget */}
        <WeatherWidget />

        {/* Create Post Button */}
        <Button
          title="Share Your Ride"
          onPress={handleCreatePost}
          leftIcon="camera-outline"
          style={styles.createPostButton}
          fullWidth
        />

        {/* Feed Posts */}
        <View style={styles.feedSection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {feedPosts.map((post) => (
            <FeedPost
              key={post.id}
              post={post}
              onAction={handlePostAction}
            />
          ))}
        </View>

        {/* Load More */}
        <Button
          title="Load More"
          variant="outline"
          onPress={() => loadDashboardData()}
          style={styles.loadMoreButton}
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  
  appTitle: {
    ...typography.headingLarge,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  
  weatherAlert: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  alertText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  
  createPostButton: {
    marginVertical: spacing.lg,
  },
  
  feedSection: {
    marginTop: spacing.lg,
  },
  
  sectionTitle: {
    ...typography.headingMedium,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  
  loadMoreButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});

export default DashboardScreen;
