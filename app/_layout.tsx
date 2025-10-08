import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ProductProvider } from '../contexts/ProductContext'; 
import '../utils/i18n';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ProductProvider> {}
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="auth/register" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="product/[id]" />
              <Stack.Screen name="checkout" />
              <Stack.Screen name="payment" />
            </Stack>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
