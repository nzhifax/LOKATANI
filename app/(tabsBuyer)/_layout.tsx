// app/(tabsBuyer)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ProductProvider } from '../../contexts/ProductContext';

export default function PembeliLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

  return (
    <ProductProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        {/* Beranda */}
        <Tabs.Screen
          name="homeBuyer"
          options={{
            title: t('home.title') || 'Beranda',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Keranjang */}
        <Tabs.Screen
          name="cart"
          options={{
            title: t('cart.title') || 'Keranjang',
            tabBarIcon: ({ color, size }) => (
              <View>
                <Ionicons name="cart-outline" size={size} color={color} />
                {cartCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: theme.error }]}>
                    <Text style={styles.badgeText}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />

        {/* Riwayat */}
        <Tabs.Screen
          name="history"
          options={{
            title: t('history.title') || 'Riwayat',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Profil */}
        <Tabs.Screen
          name="profile"
          options={{
            title: t('profile.title') || 'Profil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProductProvider>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
