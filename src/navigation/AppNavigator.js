import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import EventsScreen from '../screens/EventsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import RidersScreen from '../screens/RidersScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import stack screens
import EventDetailScreen from '../screens/EventDetailScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import RiderDetailScreen from '../screens/RiderDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddBikeScreen from '../screens/AddBikeScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="DashboardMain" component={DashboardScreen} />
  </Stack.Navigator>
);

const EventsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="EventsMain" component={EventsScreen} />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
  </Stack.Navigator>
);

const MessagesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MessagesMain" component={MessagesScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

const RidersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="RidersMain" component={RidersScreen} />
    <Stack.Screen name="RiderDetail" component={RiderDetailScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="AddBike" component={AddBikeScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Events') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Messages') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Riders') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.secondary,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardStack}
          options={{ title: 'Feed' }}
        />
        <Tab.Screen 
          name="Events" 
          component={EventsStack}
          options={{ title: 'Events' }}
        />
        <Tab.Screen 
          name="Messages" 
          component={MessagesStack}
          options={{ title: 'Messages' }}
        />
        <Tab.Screen 
          name="Riders" 
          component={RidersStack}
          options={{ title: 'Riders' }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileStack}
          options={{ title: 'Profile' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
