import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartItem as CartItemComponent } from '../../components/cart/CartItem';
import { Button } from '../../components/common/Button';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Cart() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert(
      t('cart.remove'),
      `${t('cart.remove')} ${productName}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: () => removeFromCart(productId),
          style: 'destructive',
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert(t('common.error'), t('cart.emptyCart'));
      return;
    }
    router.push('/checkout');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{t('cart.title')}</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={theme.textLight} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {t('cart.emptyCart')}
          </Text>
          <Button
            title={t('cart.continueShopping')}
            onPress={() => router.push('/(tabs)/home')}
            style={styles.shopButton}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={({ item }) => (
              <CartItemComponent
                item={item}
                onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                onRemove={() => handleRemoveItem(item.id, item.name)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
                {t('cart.total')}
              </Text>
              <Text style={[styles.totalAmount, { color: theme.primary }]}>
                Rp {getCartTotal().toLocaleString('id-ID')}
              </Text>
            </View>
            <Button title={t('cart.checkout')} onPress={handleCheckout} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  shopButton: {
    minWidth: 200,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});