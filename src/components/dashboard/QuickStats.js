import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import Card from '../ui/Card';

const QuickStats = () => {
  const stats = [
    {
      id: 1,
      title: 'Active Riders',
      value: '2,847',
      icon: 'people',
      color: colors.primary,
      change: '+12%',
      changeType: 'positive',
    },
    {
      id: 2,
      title: 'Tonight\'s FNR',
      value: '156',
      icon: 'bicycle',
      color: colors.accent,
      change: 'RSVP\'d',
      changeType: 'info',
    },
    {
      id: 3,
      title: 'Events This Week',
      value: '23',
      icon: 'calendar',
      color: colors.success,
      change: '+5',
      changeType: 'positive',
    },
    {
      id: 4,
      title: 'Weather Alert',
      value: 'Rain',
      icon: 'rainy',
      color: colors.rain,
      change: '15 min',
      changeType: 'warning',
    },
  ];

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return colors.success;
      case 'negative':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.accent;
      default:
        return colors.textMuted;
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'trending-up';
      case 'negative':
        return 'trending-down';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'remove';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Stats</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <TouchableOpacity key={stat.id} style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
              </View>
              <View style={styles.changeContainer}>
                <Ionicons 
                  name={getChangeIcon(stat.changeType)} 
                  size={12} 
                  color={getChangeColor(stat.changeType)} 
                />
                <Text style={[styles.changeText, { color: getChangeColor(stat.changeType) }]}>
                  {stat.change}
                </Text>
              </View>
            </View>
            
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add-circle" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Create Event</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="map" size={20} color={colors.accent} />
          <Text style={styles.actionText}>Find Riders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="notifications" size={20} color={colors.warning} />
          <Text style={styles.actionText}>Alerts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  title: {
    ...typography.headingMedium,
    color: colors.textPrimary,
  },
  
  refreshButton: {
    padding: spacing.xs,
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  changeText: {
    ...typography.caption,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  
  statValue: {
    ...typography.headingLarge,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  
  statTitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
  },
  
  actionButton: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  
  actionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default QuickStats;
