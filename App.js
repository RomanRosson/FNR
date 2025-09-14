import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase'; // Update path as needed
import AppNavigator from './src/navigation/AppNavigator';
import Login from './src/screens/Login';
import { useFonts, FugazOne_400Regular } from '@expo-google-fonts/fugaz-one';

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

  if (!fontsLoaded || initializing) {
    return null
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <Login />}
    </NavigationContainer>
  );
}
