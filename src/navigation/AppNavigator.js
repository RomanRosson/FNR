import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import DashboardScreen from '../screens/Dashboard';
import EventsScreen from '../screens/Events';
import Map from '../screens/Map';
import RidersScreen from '../screens/Riders';
import ProfileScreen from '../screens/Profile';

const Tab = createBottomTabNavigator();

const CustomTabButton = (props) => (
  <TouchableOpacity
    activeOpacity={0.8}
    {...props}
    style={[props.style, { backgroundColor: 'transparent' }]}
  />
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const iconSize = 24;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home';
              break;
            case 'Events':
              iconName = 'calendar';
              break;
            case 'Map':
              iconName = 'map-pin';
              break;
            case 'Riders':
              iconName = 'users';
              break;
            case 'Profile':
              return (
                <FontAwesome5 
                  name="motorcycle" 
                  size={iconSize} 
                  color={color} 
                />
              );
          }

          return (
            <FeatherIcon 
              name={iconName} 
              size={iconSize} 
              color={color} 
            />
          );
        },
        tabBarButton: (props) => <CustomTabButton {...props} />,
        tabBarActiveTintColor: '#1877F2',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopWidth: 0.5,
          borderTopColor: '#333',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 0,
          paddingHorizontal: 12,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Riders" component={RidersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
