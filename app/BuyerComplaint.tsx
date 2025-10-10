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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next'; 

interface Complaint {
  id: string;
  description: string;
  proofImage?: string;
  status: 'Pending' | 'Diterima' | 'Ditolak';
  createdAt: string;
}

const STORAGE_KEY = '@lokatani:complaints';

export default function BuyerComplaints() {
  const { theme } = useTheme();
  const { t } = useTranslation(); 
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    proofImage: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setComplaints(JSON.parse(data));
    } catch {
      Alert.alert(t('complaint.error'), t('complaint.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const saveComplaints = async (newComplaints: Complaint[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newComplaints));
      setComplaints(newComplaints);
    } catch {
      Alert.alert(t('complaint.error'), t('complaint.saveError'));
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('complaint.permissionTitle'), t('complaint.permissionDesc'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setFormData({ ...formData, proofImage: `data:image/jpeg;base64,${result.assets[0].base64}` });
    }
  };

  const handleSubmit = async () => {
    if (!formData.description) {
      Alert.alert(t('complaint.error'), t('complaint.fillDesc'));
      return;
    }

    setSubmitting(true);
    try {
      const newComplaint: Complaint = {
        id: editingComplaint ? editingComplaint.id : Date.now().toString(),
        description: formData.description,
        proofImage: formData.proofImage || undefined,
        status: editingComplaint ? editingComplaint.status : 'Pending',
        createdAt: new Date().toISOString(),
      };

      const updated = editingComplaint
        ? complaints.map((c) => (c.id === editingComplaint.id ? newComplaint : c))
        : [...complaints, newComplaint];

      await saveComplaints(updated);
      Alert.alert('✅', editingComplaint ? t('complaint.updated') : t('complaint.sent'));
      setModalVisible(false);
      resetForm();
    } catch {
      Alert.alert(t('complaint.error'), t('complaint.saveError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(t('complaint.deleteTitle'), t('complaint.deleteConfirm'), [
      { text: t('complaint.cancel'), style: 'cancel' },
      {
        text: t('complaint.delete'),
        style: 'destructive',
        onPress: async () => {
          const updated = complaints.filter((c) => c.id !== id);
          await saveComplaints(updated);
          Alert.alert('✅', t('complaint.deleted'));
        },
      },
    ]);
  };

  const openEditModal = (complaint: Complaint) => {
    setEditingComplaint(complaint);
    setFormData({
      description: complaint.description,
      proofImage: complaint.proofImage || '',
    });
    setModalVisible(true);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingComplaint(null);
    setFormData({
      description: '',
      proofImage: '',
    });
  };

  const renderComplaint = ({ item }: { item: Complaint }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      {item.proofImage && <Image source={{ uri: item.proofImage }} style={styles.image} />}
      <View style={{ flex: 1 }}>
        <Text style={[styles.desc, { color: theme.text }]} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={[styles.status, { color: theme.primary }]}>
          {t('complaint.status')}: {item.status}
        </Text>
        <Text style={[styles.date, { color: theme.textSecondary }]}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Ionicons name="create-outline" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color={theme.error || '#f44336'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>{t('complaint.formTitle')}</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={openCreateModal}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {complaints.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="chatbox-ellipses-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.text }]}>{t('complaint.empty')}</Text>
          <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
            {t('complaint.emptySub')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderComplaint}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* === Modal Form === */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.modal, { backgroundColor: theme.background }]}
        >
          <View style={[styles.modalHeader, { backgroundColor: theme.surface }]}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editingComplaint ? t('complaint.editTitle') : t('complaint.createTitle')}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={{ padding: 20 }}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {formData.proofImage ? (
                <Image source={{ uri: formData.proofImage }} style={styles.preview} />
              ) : (
                <View style={[styles.imagePlaceholder, { borderColor: theme.border }]}>
                  <Ionicons name="image-outline" size={40} color={theme.textSecondary} />
                  <Text style={{ color: theme.textSecondary }}>{t('complaint.upload')}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border },
              ]}
              placeholder={t('complaint.placeholder')}
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={5}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator color="#fff" /> : (
                <Text style={styles.submitText}>
                  {editingComplaint ? t('complaint.update') : t('complaint.submit')}
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
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 60, borderBottomWidth: 1,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  card: { flexDirection: 'row', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  desc: { fontSize: 15, fontWeight: '500' },
  status: { fontSize: 14, marginTop: 4 },
  date: { fontSize: 12, marginTop: 4 },
  actions: { justifyContent: 'space-between', alignItems: 'center', marginLeft: 8 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 20, fontWeight: '600', marginTop: 12 },
  emptySub: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 60, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  imagePicker: { alignItems: 'center', marginBottom: 16 },
  imagePlaceholder: {
    width: '100%', height: 180, borderWidth: 1, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  preview: { width: '100%', height: 200, borderRadius: 10, marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, textAlignVertical: 'top', marginBottom: 16 },
  submitButton: { paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
