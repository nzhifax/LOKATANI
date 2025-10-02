import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Product } from '../../data/products';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { i18n } = useTranslation();
  
  const isIndonesian = i18n.language === 'id';
  const productName = isIndonesian ? product.nameId : product.name;

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {productName}
        </Text>
        <Text style={[styles.farmer, { color: theme.textSecondary }]} numberOfLines={1}>
          <Ionicons name="person-outline" size={12} /> {product.farmer.name}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.price, { color: theme.primary }]}>
            Rp {product.price.toLocaleString('id-ID')}
            <Text style={[styles.unit, { color: theme.textSecondary }]}>/{product.unit}</Text>
          </Text>
          {product.stock > 0 ? (
            <View style={[styles.stockBadge, { backgroundColor: theme.success + '20' }]}>
              <Text style={[styles.stockText, { color: theme.success }]}>
                {product.stock}
              </Text>
            </View>
          ) : (
            <View style={[styles.stockBadge, { backgroundColor: theme.error + '20' }]}>
              <Text style={[styles.stockText, { color: theme.error }]}>0</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#E5E7EB',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
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
    fontSize: 18,
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    fontWeight: '400',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
});