import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';

const EventFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    {
      id: 'all',
      label: 'All',
      icon: 'grid-outline',
      color: colors.textSecondary,
    },
    {
      id: 'fnr',
      label: 'FNR',
      icon: 'bicycle',
      color: colors.primary,
    },
    {
      id: 'scenic',
      label: 'Scenic',
      icon: 'mountain',
      color: colors.success,
    },
    {
      id: 'track',
      label: 'Track',
      icon: 'speedometer',
      color: colors.accent,
    },
    {
      id: 'social',
      label: 'Social',
      icon: 'people',
      color: colors.warning,
    },
    {
      id: 'sponsored',
      label: 'Sponsored',
      icon: 'star',
      color: colors.gold,
    },
    {
      id: 'my-events',
      label: 'My Events',
      icon: 'calendar',
      color: colors.info,
    },
  ];

  const handleFilterPress = (filterId) => {
    onFilterChange(filterId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Events</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                isActive && styles.activeFilterButton,
                { borderColor: isActive ? filter.color : colors.border }
              ]}
              onPress={() => handleFilterPress(filter.id)}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={filter.icon} 
                size={18} 
                color={isActive ? filter.color : colors.textMuted} 
              />
              <Text style={[
                styles.filterLabel,
                isActive && { color: filter.color }
              ]}>
                {filter.label}
              </Text>
              
              {isActive && (
                <View style={[styles.activeIndicator, { backgroundColor: filter.color }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {/* Quick Filter Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Ionicons name="location" size={16} color={colors.accent} />
          <Text style={styles.quickActionText}>Nearby</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <Ionicons name="time" size={16} color={colors.warning} />
          <Text style={styles.quickActionText}>Today</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <Ionicons name="sunny" size={16} color={colors.sunny} />
          <Text style={styles.quickActionText}>Good Weather</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  
  title: {
    ...typography.headingSmall,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  
  filtersContainer: {
    paddingRight: spacing.screenPadding,
  },
  
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    position: 'relative',
    minWidth: 80,
    justifyContent: 'center',
  },
  
  activeFilterButton: {
    backgroundColor: colors.background,
    borderWidth: 2,
  },
  
  filterLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    width: 4,
    height: 4,
    borderRadius: 2,
    marginLeft: -2,
  },
  
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  
  quickActionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
});

export default EventFilters;
