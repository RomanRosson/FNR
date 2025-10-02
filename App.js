import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase'; // Update path as needed
import AppNavigator from './src/navigation/AppNavigator';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import { useFonts, FugazOne_400Regular } from '@expo-google-fonts/fugaz-one';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  let [fontsLoaded] = useFonts({
    FugazOne_400Regular,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing || !fontsLoaded) return null; // Wait for fonts to load

  return (
    <NavigationContainer>
      {user ? (
        <AppNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}