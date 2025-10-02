import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Checkout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');

  const subtotal = getCartTotal();
  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

  const handleProceed = () => {
    if (!address || !city || !postalCode || !phoneNumber) {
      Alert.alert(t('common.error'), t('auth.fillAllFields'));
      return;
    }

    // Navigate to payment screen
    router.push('/payment');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{t('checkout.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('checkout.shippingAddress')}
            </Text>
            <Input
              label={t('checkout.address')}
              placeholder={t('checkout.address')}
              value={address}
              onChangeText={setAddress}
              icon="home-outline"
              multiline
            />
            <Input
              label={t('checkout.city')}
              placeholder={t('checkout.city')}
              value={city}
              onChangeText={setCity}
              icon="location-outline"
            />
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label={t('checkout.postalCode')}
                  placeholder={t('checkout.postalCode')}
                  value={postalCode}
                  onChangeText={setPostalCode}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label={t('checkout.phoneNumber')}
                  placeholder={t('checkout.phoneNumber')}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('checkout.orderSummary')}
            </Text>
            {cart.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                  {item.name} × {item.quantity}
                </Text>
                <Text style={[styles.itemPrice, { color: theme.textSecondary }]}>
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                {t('cart.subtotal')}
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                Rp {subtotal.toLocaleString('id-ID')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                {t('checkout.deliveryFee')}
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                Rp {deliveryFee.toLocaleString('id-ID')}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>
                {t('checkout.totalPayment')}
              </Text>
              <Text style={[styles.totalValue, { color: theme.primary }]}>
                Rp {total.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <Button
            title={t('checkout.proceedToPayment')}
            onPress={handleProceed}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 15,
    flex: 1,
    marginRight: 12,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '500',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
});