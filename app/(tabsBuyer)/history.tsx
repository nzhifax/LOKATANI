import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../contexts/ThemeContext';

export default function History() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [history, setHistory] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchHistory = async () => {
        try {
          const stored = await AsyncStorage.getItem('@lokatani:history');
          if (stored) {
            setHistory(JSON.parse(stored));
          } else {
            setHistory([]);
          }
        } catch (error) {
          console.error('Gagal mengambil data riwayat:', error);
        }
      };
      fetchHistory();
    }, [])
  );

  const clearHistory = async () => {
    await AsyncStorage.removeItem('@lokatani:history');
    setHistory([]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{t('history.title') || 'Riwayat Transaksi'}</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={80} color={theme.textLight} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {t('history.empty') || 'Belum ada transaksi'}
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={history}
            renderItem={({ item }) => (
              <View style={[styles.itemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.itemTitle, { color: theme.text }]}>{item.date}</Text>
                {item.items.map((cartItem: any) => (
                  <Text key={cartItem.id} style={[styles.itemText, { color: theme.textSecondary }]}>
                    {cartItem.name} × {cartItem.quantity} — Rp {cartItem.price.toLocaleString('id-ID')}
                  </Text>
                ))}
                <Text style={[styles.total, { color: theme.primary }]}>
                  Total: Rp {item.total.toLocaleString('id-ID')}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
            <Button title={t('history.clear') || 'Hapus Riwayat'} onPress={clearHistory} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: 'bold' },
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
  list: { paddingHorizontal: 20, paddingBottom: 16 },
  itemCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  itemText: { fontSize: 14, marginVertical: 2 },
  total: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  footer: { padding: 20, borderTopWidth: 1 },
});
