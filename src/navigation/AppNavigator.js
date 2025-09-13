import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
    activeOpacity={1}
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
                <View style={route.name === 'Map' ? styles.mapIconWrapper : null}>
                  <FontAwesome5 name="motorcycle" size={size} color={color} />
                </View>
              );
          }

          return (
            <View>
              <FeatherIcon name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarButton: (props) => <CustomTabButton {...props} />,
        tabBarActiveTintColor: '#1877F2',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
          paddingBottom: 6,
          height: 65,
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

const styles = StyleSheet.create({
  mapIconWrapper: {
    backgroundColor: '#2c2c2e',
    padding: 12,
    borderRadius: 32,
    marginBottom: 10,
  },
});

export default AppNavigator;
