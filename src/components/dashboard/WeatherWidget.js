import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import Card from '../ui/Card';

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: 'partly-cloudy',
    humidity: 65,
    windSpeed: 15,
    visibility: 'Good',
    precipitation: 0,
  });

  const [location, setLocation] = useState('Sydney, NSW');

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return 'sunny';
      case 'cloudy':
        return 'cloudy';
      case 'partly-cloudy':
        return 'partly-sunny';
      case 'rainy':
        return 'rainy';
      case 'stormy':
        return 'thunderstorm';
      default:
        return 'partly-sunny';
    }
  };

  const getWeatherColor = (condition) => {
    switch (condition) {
      case 'sunny':
        return colors.sunny;
      case 'rainy':
      case 'stormy':
        return colors.rain;
      default:
        return colors.cloudy;
    }
  };

  const getRidingConditions = () => {
    if (weather.precipitation > 0) {
      return { status: 'Not Recommended', color: colors.error, icon: 'warning' };
    } else if (weather.windSpeed > 25) {
      return { status: 'Use Caution', color: colors.warning, icon: 'alert' };
    } else {
      return { status: 'Good', color: colors.success, icon: 'checkmark-circle' };
    }
  };

  const ridingConditions = getRidingConditions();

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={colors.textMuted} />
          <Text style={styles.location}>{location}</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainWeather}>
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>{weather.temperature}°</Text>
          <Text style={styles.celsius}>C</Text>
        </View>
        
        <View style={styles.weatherInfo}>
          <Ionicons 
            name={getWeatherIcon(weather.condition)} 
            size={48} 
            color={getWeatherColor(weather.condition)} 
          />
          <Text style={styles.condition}>Partly Cloudy</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="water" size={16} color={colors.accent} />
          <Text style={styles.detailText}>{weather.humidity}%</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="airplane" size={16} color={colors.accent} />
          <Text style={styles.detailText}>{weather.windSpeed} km/h</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="eye" size={16} color={colors.accent} />
          <Text style={styles.detailText}>{weather.visibility}</Text>
        </View>
      </View>

      <View style={styles.ridingConditions}>
        <View style={styles.conditionHeader}>
          <Ionicons 
            name={ridingConditions.icon} 
            size={20} 
            color={ridingConditions.color} 
          />
          <Text style={styles.conditionLabel}>Riding Conditions</Text>
        </View>
        <Text style={[styles.conditionStatus, { color: ridingConditions.color }]}>
          {ridingConditions.status}
        </Text>
      </View>

      {weather.precipitation > 0 && (
        <View style={styles.precipitationAlert}>
          <Ionicons name="rainy" size={16} color={colors.rain} />
          <Text style={styles.alertText}>
            {weather.precipitation}mm rain expected in next hour
          </Text>
        </View>
      )}
    </Card>
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
  
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  location: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  
  refreshButton: {
    padding: spacing.xs,
  },
  
  mainWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  temperature: {
    ...typography.displayLarge,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  
  celsius: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  
  weatherInfo: {
    alignItems: 'center',
  },
  
  condition: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  detailItem: {
    alignItems: 'center',
  },
  
  detailText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  
  ridingConditions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  conditionLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  
  conditionStatus: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  
  precipitationAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.rain + '20',
    padding: spacing.sm,
    borderRadius: spacing.borderRadius.sm,
    marginTop: spacing.md,
  },
  
  alertText: {
    ...typography.bodySmall,
    color: colors.rain,
    marginLeft: spacing.sm,
    flex: 1,
  },
});

export default WeatherWidget;
