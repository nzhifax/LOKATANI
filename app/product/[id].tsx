import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import { dummyProducts } from '../../data/products';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const product = dummyProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Product not found</Text>
      </SafeAreaView>
    );
  }

  const isIndonesian = i18n.language === 'id';
  const productName = isIndonesian ? product.nameId : product.name;
  const productDescription = isIndonesian ? product.descriptionId : product.description;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert(
      t('common.success'),
      t('product.addedToCart'),
      [
        { text: t('cart.continueShopping'), onPress: () => router.back() },
        { text: t('cart.cart'), onPress: () => router.push('/(tabs)/cart') },
      ]
    );
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.surface }]}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={[styles.name, { color: theme.text }]}>{productName}</Text>
            <Text style={[styles.price, { color: theme.primary }]}>
              Rp {product.price.toLocaleString('id-ID')}
              <Text style={[styles.unit, { color: theme.textSecondary }]}>/{product.unit}</Text>
            </Text>
          </View>

          <View style={[styles.stockSection, { backgroundColor: theme.surface }]}>
            <View style={styles.stockRow}>
              <Ionicons name="checkmark-circle" size={20} color={product.stock > 0 ? theme.success : theme.error} />
              <Text style={[styles.stockText, { color: theme.text }]}>
                {t('product.stock')}: {product.stock} {product.unit}
              </Text>
            </View>
          </View>

          <View style={[styles.farmerSection, { backgroundColor: theme.surface }]}>
            <Ionicons name="person" size={24} color={theme.primary} />
            <View style={styles.farmerInfo}>
              <Text style={[styles.farmerName, { color: theme.text }]}>{product.farmer.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.location, { color: theme.textSecondary }]}>
                  {product.farmer.location}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('product.description')}
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {productDescription}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View style={styles.quantitySection}>
          <Text style={[styles.quantityLabel, { color: theme.text }]}>
            {t('cart.quantity')}
          </Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              onPress={handleDecrease}
              disabled={quantity <= 1}
            >
              <Ionicons name="remove" size={20} color={quantity <= 1 ? theme.textLight : theme.text} />
            </TouchableOpacity>
            <Text style={[styles.quantity, { color: theme.text }]}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              onPress={handleIncrease}
              disabled={quantity >= product.stock}
            >
              <Ionicons name="add" size={20} color={quantity >= product.stock ? theme.textLight : theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title={t('product.addToCart')}
            onPress={handleAddToCart}
            variant="outline"
            style={styles.addButton}
            disabled={product.stock === 0}
          />
          <Button
            title={t('product.buyNow')}
            onPress={handleBuyNow}
            style={styles.buyButton}
            disabled={product.stock === 0}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5E7EB',
  },
  content: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 16,
    fontWeight: '400',
  },
  stockSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  farmerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  farmerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flex: 1,
  },
  buyButton: {
    flex: 1,
  },
});