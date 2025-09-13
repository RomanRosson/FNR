import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase'; // Update path as needed
import AppNavigator from './src/navigation/AppNavigator';
import Login from './src/screens/Login';

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) return null; // Optionally show splash screen here

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <Login />}
    </NavigationContainer>
  );
}