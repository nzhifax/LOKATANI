import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import '../utils/i18n'; 
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { ProductProvider } from '../contexts/ProductContext';


export default function RootLayout() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const setupUser = async () => {
      const fakeUser = { email: 'z@gmail.com', role: 'buyer' };
      await AsyncStorage.setItem('user', JSON.stringify(fakeUser));
      setRole(fakeUser.role);
    };

    setupUser();
  }, []);

  if (!role) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            {/* Stack tetap di dalam semua Provider */}
            <Stack screenOptions={{ headerShown: false }}>
              {/* Halaman umum */}
              <Stack.Screen name="index" />
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="auth/register" />

              {/* Layout berdasarkan role */}
              {role === 'buyer' ? (
                <Stack.Screen name="(tabsBuyer)" />
              ) : (
                <Stack.Screen name="(tabsFarmer)" />
              )}
            </Stack>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
