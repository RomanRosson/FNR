import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import Card from '../ui/Card';

const EventCard = ({ event, onPress }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'fnr':
        return 'bicycle';
      case 'scenic':
        return 'mountain';
      case 'track':
        return 'speedometer';
      case 'social':
        return 'people';
      default:
        return 'calendar';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'fnr':
        return colors.primary;
      case 'scenic':
        return colors.success;
      case 'track':
        return colors.accent;
      case 'social':
        return colors.warning;
      default:
        return colors.textMuted;
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return 'sunny';
      case 'partly-cloudy':
        return 'partly-sunny';
      case 'cloudy':
        return 'cloudy';
      case 'rainy':
        return 'rainy';
      default:
        return 'partly-sunny';
    }
  };

  const getWeatherColor = (condition) => {
    switch (condition) {
      case 'sunny':
        return colors.sunny;
      case 'rainy':
        return colors.rain;
      default:
        return colors.cloudy;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-AU', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getAttendanceStatus = () => {
    const percentage = (event.attendees / event.maxAttendees) * 100;
    if (percentage >= 90) {
      return { status: 'Almost Full', color: colors.warning };
    } else if (percentage >= 75) {
      return { status: 'Filling Up', color: colors.info };
    } else {
      return { status: 'Plenty of Space', color: colors.success };
    }
  };

  const attendanceStatus = getAttendanceStatus();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.container}>
        {/* Event Header */}
        <View style={styles.header}>
          <View style={styles.eventType}>
            <View style={[styles.typeIcon, { backgroundColor: getEventTypeColor(event.type) + '20' }]}>
              <Ionicons 
                name={getEventTypeIcon(event.type)} 
                size={16} 
                color={getEventTypeColor(event.type)} 
              />
            </View>
            <Text style={[styles.typeText, { color: getEventTypeColor(event.type) }]}>
              {event.type === 'fnr' ? 'FNR' : 
               event.type === 'scenic' ? 'Scenic' :
               event.type === 'track' ? 'Track Day' :
               event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.bookmarkButton}
            onPress={handleBookmark}
          >
            <Ionicons 
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
              size={20} 
              color={isBookmarked ? colors.primary : colors.textMuted} 
            />
          </TouchableOpacity>
        </View>

        {/* Event Title */}
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Event Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={colors.textMuted} />
            <Text style={styles.detailText}>
              {formatDate(event.date)} at {event.time}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={colors.textMuted} />
            <Text style={styles.detailText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        </View>

        {/* Event Description */}
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>

        {/* Tags */}
        <View style={styles.tags}>
          {event.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {event.tags.length > 3 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>+{event.tags.length - 3}</Text>
            </View>
          )}
        </View>

        {/* Event Footer */}
        <View style={styles.footer}>
          <View style={styles.organizer}>
            <Image 
              source={{ uri: event.organizer.avatar }} 
              style={styles.organizerAvatar}
              defaultSource={require('../../../assets/default-avatar.png')}
            />
            <View style={styles.organizerInfo}>
              <Text style={styles.organizerName}>{event.organizer.name}</Text>
              {event.organizer.role && (
                <View style={[styles.roleBadge, { backgroundColor: colors[event.organizer.role] }]}>
                  <Ionicons name="trophy" size={10} color={colors.textPrimary} />
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.eventStats}>
            <View style={styles.attendance}>
              <Ionicons name="people" size={16} color={colors.textMuted} />
              <Text style={styles.attendanceText}>
                {event.attendees}/{event.maxAttendees}
              </Text>
            </View>
            
            <View style={styles.weather}>
              <Ionicons 
                name={getWeatherIcon(event.weather.condition)} 
                size={16} 
                color={getWeatherColor(event.weather.condition)} 
              />
              <Text style={styles.weatherText}>{event.weather.temperature}°</Text>
            </View>
          </View>
        </View>

        {/* Sponsored Badge */}
        {event.isSponsored && (
          <View style={styles.sponsoredBadge}>
            <Ionicons name="star" size={12} color={colors.gold} />
            <Text style={styles.sponsoredText}>Sponsored by {event.sponsor}</Text>
          </View>
        )}

        {/* Attendance Status */}
        <View style={styles.attendanceStatus}>
          <View style={[styles.statusIndicator, { backgroundColor: attendanceStatus.color }]} />
          <Text style={[styles.statusText, { color: attendanceStatus.color }]}>
            {attendanceStatus.status}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    position: 'relative',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  eventType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  
  typeText: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  bookmarkButton: {
    padding: spacing.xs,
  },
  
  title: {
    ...typography.headingMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 24,
  },
  
  details: {
    marginBottom: spacing.sm,
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  
  detailText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  
  description: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  
  tag: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  
  tagText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  organizer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  organizerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  organizerName: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  
  roleBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  eventStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  attendance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  
  attendanceText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  
  weather: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  weatherText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  
  sponsoredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gold + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  
  sponsoredText: {
    ...typography.caption,
    color: colors.gold,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  
  attendanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
});

export default EventCard;
