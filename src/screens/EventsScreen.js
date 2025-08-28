import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';

const EventsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreateButton, setShowCreateButton] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, activeFilter]);

  const loadEvents = async () => {
    // Simulate loading events
    const mockEvents = [
      {
        id: 1,
        title: 'Friday Night Ride - Sydney CBD',
        type: 'fnr',
        date: '2024-01-19',
        time: '19:00',
        location: 'Hyde Park, Sydney',
        coordinates: { latitude: -33.8688, longitude: 151.2093 },
        organizer: {
          name: 'Mike "Thunder" Johnson',
          role: 'gold',
          avatar: 'https://example.com/avatar1.jpg',
        },
        attendees: 156,
        maxAttendees: 200,
        description: 'Join us for the weekly Friday Night Ride through Sydney CBD. Meet at Hyde Park at 7 PM, kickstands up at 7:30 PM.',
        tags: ['FNR', 'Sydney', 'CBD', 'Social'],
        isSponsored: false,
        weather: {
          condition: 'partly-cloudy',
          temperature: 22,
          precipitation: 0,
        },
        status: 'upcoming',
      },
      {
        id: 2,
        title: 'Blue Mountains Scenic Ride',
        type: 'scenic',
        date: '2024-01-21',
        time: '09:00',
        location: 'Katoomba, Blue Mountains',
        coordinates: { latitude: -33.7123, longitude: 150.3119 },
        organizer: {
          name: 'Sarah "Speed" Chen',
          role: 'silver',
          avatar: 'https://example.com/avatar2.jpg',
        },
        attendees: 23,
        maxAttendees: 30,
        description: 'Scenic ride through the beautiful Blue Mountains. Perfect for photography and enjoying the views.',
        tags: ['Scenic', 'Blue Mountains', 'Photography', 'Day Trip'],
        isSponsored: false,
        weather: {
          condition: 'sunny',
          temperature: 18,
          precipitation: 0,
        },
        status: 'upcoming',
      },
      {
        id: 3,
        title: 'Track Day - Eastern Creek',
        type: 'track',
        date: '2024-01-25',
        time: '08:00',
        location: 'Sydney Motorsport Park',
        coordinates: { latitude: -33.7833, longitude: 150.8667 },
        organizer: {
          name: 'FNR Sydney',
          role: 'platinum',
          avatar: 'https://example.com/fnr-logo.jpg',
        },
        attendees: 45,
        maxAttendees: 50,
        description: 'Track day at Eastern Creek. All skill levels welcome. Safety gear required.',
        tags: ['Track Day', 'Eastern Creek', 'Performance', 'Training'],
        isSponsored: true,
        sponsor: 'Sydney Motorsport Park',
        weather: {
          condition: 'sunny',
          temperature: 25,
          precipitation: 0,
        },
        status: 'upcoming',
      },
    ];

    setEvents(mockEvents);
  };

  const filterEvents = () => {
    let filtered = events;
    
    switch (activeFilter) {
      case 'fnr':
        filtered = events.filter(event => event.type === 'fnr');
        break;
      case 'scenic':
        filtered = events.filter(event => event.type === 'scenic');
        break;
      case 'track':
        filtered = events.filter(event => event.type === 'track');
        break;
      case 'sponsored':
        filtered = events.filter(event => event.isSponsored);
        break;
      case 'my-events':
        filtered = events.filter(event => event.organizer.name === 'Current User');
        break;
      default:
        filtered = events;
    }
    
    setFilteredEvents(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleCreateEvent = () => {
    navigation.navigate('CreateEvent');
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetail', { event });
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Events</Text>
          <Text style={styles.subtitle}>Find your next ride</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateEvent}
        >
          <Ionicons name="add" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            title="Create Event"
            onPress={handleCreateEvent}
            leftIcon="add-circle"
            style={styles.quickActionButton}
            fullWidth
          />
          
          <View style={styles.quickActionRow}>
            <Button
              title="Find Nearby"
              variant="outline"
              leftIcon="location"
              style={[styles.quickActionButton, styles.halfWidth]}
            />
            <Button
              title="My Events"
              variant="outline"
              leftIcon="calendar"
              style={[styles.quickActionButton, styles.halfWidth]}
            />
          </View>
        </View>

        {/* Filters */}
        <EventFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Events List */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeFilter === 'all' ? 'All Events' : 
               activeFilter === 'fnr' ? 'Friday Night Rides' :
               activeFilter === 'scenic' ? 'Scenic Rides' :
               activeFilter === 'track' ? 'Track Days' :
               activeFilter === 'sponsored' ? 'Sponsored Events' :
               'My Events'}
            </Text>
            <Text style={styles.eventCount}>{filteredEvents.length} events</Text>
          </View>

          {filteredEvents.length === 0 ? (
            <Card style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No events found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your filters or create a new event
              </Text>
              <Button
                title="Create Event"
                onPress={handleCreateEvent}
                style={styles.emptyStateButton}
              />
            </Card>
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event)}
              />
            ))
          )}
        </View>

        {/* Load More */}
        {filteredEvents.length > 0 && (
          <Button
            title="Load More Events"
            variant="outline"
            onPress={() => loadEvents()}
            style={styles.loadMoreButton}
            fullWidth
          />
        )}
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
    flex: 1,
  },
  
  title: {
    ...typography.headingLarge,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  
  quickActions: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  
  quickActionButton: {
    marginBottom: spacing.sm,
  },
  
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  halfWidth: {
    width: '48%',
  },
  
  eventsSection: {
    marginTop: spacing.lg,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  sectionTitle: {
    ...typography.headingMedium,
    color: colors.textPrimary,
  },
  
  eventCount: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  
  emptyTitle: {
    ...typography.headingMedium,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  
  emptyStateButton: {
    width: '60%',
  },
  
  loadMoreButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});

export default EventsScreen;
