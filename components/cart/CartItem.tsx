import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartItem as CartItemType } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  
  const isIndonesian = i18n.language === 'id';
  const productName = isIndonesian ? item.nameId : item.name;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      onUpdateQuantity(item.quantity + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {productName}
          </Text>
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="trash-outline" size={20} color={theme.error} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.farmer, { color: theme.textSecondary }]}>
          {item.farmer.name}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.price, { color: theme.primary }]}>
            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
          </Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              onPress={handleDecrease}
              disabled={item.quantity <= 1}
            >
              <Ionicons name="remove" size={16} color={item.quantity <= 1 ? theme.textLight : theme.text} />
            </TouchableOpacity>
            <Text style={[styles.quantity, { color: theme.text }]}>{item.quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              onPress={handleIncrease}
              disabled={item.quantity >= item.stock}
            >
              <Ionicons name="add" size={16} color={item.quantity >= item.stock ? theme.textLight : theme.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  farmer: {
    fontSize: 12,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
});