import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category?: string;
  createdAt: string;
}

const STORAGE_KEY = '@lokatani:products';

export default function PetaniProducts() {
  const { theme } = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    category: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setProducts(JSON.parse(data));
    } catch {
      Alert.alert('Error', 'Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const saveProducts = async (newProducts: Product[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
      setProducts(newProducts);
    } catch {
      Alert.alert('Error', 'Gagal menyimpan produk');
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin Diperlukan', 'Izinkan akses galeri untuk memilih gambar');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setFormData({ ...formData, image: `data:image/jpeg;base64,${result.assets[0].base64}` });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.stock || !formData.image) {
      Alert.alert('Error', 'Lengkapi semua kolom wajib dan pilih gambar');
      return;
    }

    setSubmitting(true);
    try {
      const newProduct: Product = {
        id: editingProduct ? editingProduct.id : Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: formData.image,
        category: formData.category || undefined,
        createdAt: new Date().toISOString(),
      };

      const updated = editingProduct
        ? products.map((p) => (p.id === editingProduct.id ? newProduct : p))
        : [...products, newProduct];

      await saveProducts(updated);
      Alert.alert('Sukses', editingProduct ? 'Produk diperbarui' : 'Produk ditambahkan');
      setModalVisible(false);
      resetForm();
    } catch {
      Alert.alert('Error', 'Gagal menyimpan produk');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Produk', 'Yakin ingin menghapus produk ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const updated = products.filter((p) => p.id !== id);
          await saveProducts(updated);
          Alert.alert('Sukses', 'Produk dihapus');
        },
      },
    ]);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
      category: product.category || '',
    });
    setModalVisible(true);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: '',
      category: '',
    });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={[styles.productCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.productDescription, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.productDetails}>
          <Text style={[styles.productPrice, { color: theme.primary }]}>
            Rp {item.price.toLocaleString()}
          </Text>
          <Text style={[styles.productStock, { color: theme.textSecondary }]}>
            Stock: {item.stock}
          </Text>
        </View>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color={ '#2196F3'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color={theme.error || '#f44336'} />
        </TouchableOpacity>
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
        <Text style={[styles.title, { color: theme.text }]}>Produk Saya</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={openCreateModal}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.text }]}>Belum ada produk</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Tambah produk pertama Anda
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: theme.border, backgroundColor: theme.surface },
            ]}
          >
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editingProduct ? 'Edit Produk' : 'Tambah Produk'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <TouchableOpacity style={styles.imageSelector} onPress={pickImage}>
              {formData.image ? (
                <Image source={{ uri: formData.image }} style={styles.selectedImage} />
              ) : (
                <View
                  style={[
                    styles.imagePlaceholder,
                    { backgroundColor: theme.border },
                  ]}
                >
                  <Ionicons name="camera" size={48} color={theme.textSecondary} />
                  <Text style={[styles.imagePlaceholderText, { color: theme.textSecondary }]}>
                    Pilih Gambar
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {['name', 'description', 'price', 'stock', 'category'].map((field) => (
              <TextInput
                key={field}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholderTextColor={theme.textSecondary}
                placeholder={
                  field === 'name'
                    ? 'Nama Produk *'
                    : field === 'description'
                    ? 'Deskripsi *'
                    : field === 'price'
                    ? 'Harga (Rp) *'
                    : field === 'stock'
                    ? 'Stok *'
                    : 'Kategori (Opsional)'
                }
                value={(formData as any)[field]}
                onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                keyboardType={
                  field === 'price' || field === 'stock' ? 'numeric' : 'default'
                }
                multiline={field === 'description'}
                numberOfLines={field === 'description' ? 4 : 1}
              />
            ))}

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {editingProduct ? 'Perbarui Produk' : 'Tambah Produk'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: { padding: 16 },
  productCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: { width: 80, height: 80, borderRadius: 8 },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 16, fontWeight: '600' },
  productDescription: { fontSize: 14, marginBottom: 8 },
  productDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  productPrice: { fontSize: 16, fontWeight: 'bold' },
  productStock: { fontSize: 14 },
  productActions: { justifyContent: 'center', marginLeft: 8 },
  actionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalContent: { flex: 1, padding: 20 },
  imageSelector: { width: '100%', height: 200, borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  selectedImage: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderText: { marginTop: 12, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  submitButton: {
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
