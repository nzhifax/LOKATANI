import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/common/Button';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

type PaymentMethod = 'bank' | 'gopay' | 'ovo' | 'dana' | null;

export default function Payment() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const subtotal = getCartTotal();
  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

  const orderNumber = `ORD-${Date.now()}`;

  const paymentMethods = [
    { id: 'bank' as PaymentMethod, name: t('payment.bankTransfer'), icon: 'card-outline' },
    { id: 'gopay' as PaymentMethod, name: 'GoPay', icon: 'wallet-outline' },
    { id: 'ovo' as PaymentMethod, name: 'OVO', icon: 'wallet-outline' },
    { id: 'dana' as PaymentMethod, name: 'DANA', icon: 'wallet-outline' },
  ];

  const handlePayment = () => {
    if (!selectedMethod) {
      Alert.alert(t('common.error'), t('payment.selectMethod'));
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing (Mock Midtrans)
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
      clearCart();
    }, 2500);
  };

  if (paymentComplete) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: theme.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={80} color={theme.success} />
          </View>
          <Text style={[styles.successTitle, { color: theme.text }]}>
            {t('payment.success')}
          </Text>
          <Text style={[styles.thankYou, { color: theme.textSecondary }]}>
            {t('payment.thankYou')}
          </Text>
          <View style={[styles.orderCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.orderLabel, { color: theme.textSecondary }]}>
              {t('payment.orderNumber')}
            </Text>
            <Text style={[styles.orderValue, { color: theme.primary }]}>
              {orderNumber}
            </Text>
          </View>
          <Button
            title={t('payment.backToHome')}
            onPress={() => router.replace('/(tabs)/home')}
            style={styles.homeButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (processing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.processingText, { color: theme.text }]}>
            {t('payment.processing')}
          </Text>
          <Text style={[styles.processingSubtext, { color: theme.textSecondary }]}>
            Please wait...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{t('payment.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('payment.selectMethod')}
        </Text>

        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: selectedMethod === method.id ? theme.primary : theme.border,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: theme.primary + '20' },
                  ]}
                >
                  <Ionicons name={method.icon as any} size={24} color={theme.primary} />
                </View>
                <Text style={[styles.methodName, { color: theme.text }]}>
                  {method.name}
                </Text>
              </View>
              {selectedMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>
            {t('checkout.orderSummary')}
          </Text>
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
          title={`${t('checkout.proceedToPayment')} - Rp ${total.toLocaleString('id-ID')}`}
          onPress={handlePayment}
          disabled={!selectedMethod}
        />
      </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  methodsContainer: {
    marginBottom: 24,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
  },
  processingSubtext: {
    fontSize: 16,
    marginTop: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  thankYou: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  orderCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  orderLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  orderValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  homeButton: {
    minWidth: 200,
  },
});