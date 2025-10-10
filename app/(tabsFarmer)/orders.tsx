import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';

const ORDERS_KEY = '@lokatani:orders';

interface Order {
  id: string;
  buyer_name: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  created_at: string;
}

export default function PetaniOrders() {
  const { theme } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const stored = await AsyncStorage.getItem(ORDERS_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setOrders(parsed);
    } catch {
      Alert.alert('Error', 'Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const stored = await AsyncStorage.getItem(ORDERS_KEY);
      const parsed: Order[] = stored ? JSON.parse(stored) : [];

      const updated = parsed.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );

      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
      setOrders(updated);
      Alert.alert('Berhasil', 'Status pesanan diperbarui');
    } catch {
      Alert.alert('Error', 'Gagal memperbarui status pesanan');
    }
  };

  const showStatusOptions = (order: Order) => {
    const statuses = ['pending', 'processing', 'completed', 'cancelled'];
    const options = statuses
      .filter((s) => s !== order.status)
      .map((status) => ({
        text: status.charAt(0).toUpperCase() + status.slice(1),
        onPress: () => updateOrderStatus(order.id, status),
      }));

    Alert.alert(
      'Ubah Status Pesanan',
      `Status sekarang: ${order.status}`,
      [...options, { text: 'Batal', style: 'cancel' }]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'processing':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#f44336';
      default:
        return theme.textSecondary;
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={[styles.orderCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
      <View style={[styles.orderHeader, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.orderBuyer, { color: theme.text }]}>{item.buyer_name}</Text>
          <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
          onPress={() => showStatusOptions(item)}
        >
          <Text style={styles.statusText}>{item.status}</Text>
          <Ionicons name="chevron-down" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.orderItems}>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={[styles.itemName, { color: theme.textSecondary }]}>
              {orderItem.product_name} x {orderItem.quantity}
            </Text>
            <Text style={[styles.itemPrice, { color: theme.text }]}>
              Rp {(orderItem.price * orderItem.quantity).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.orderFooter, { borderTopColor: theme.border }]}>
        <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
        <Text style={[styles.totalAmount, { color: theme.primary }]}>
          Rp {item.total.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.surface, borderBottomColor: theme.border },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>Pesanan</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.text }]}>Belum ada pesanan</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Pesanan akan muncul di sini
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: { padding: 16 },
  orderCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  orderBuyer: { fontSize: 16, fontWeight: '600' },
  orderDate: { fontSize: 14, marginTop: 4 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
    textTransform: 'capitalize',
  },
  orderItems: { marginBottom: 12 },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: { fontSize: 14 },
  itemPrice: { fontSize: 14, fontWeight: '500' },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 16, fontWeight: '600' },
  totalAmount: { fontSize: 18, fontWeight: 'bold' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8 },
});
