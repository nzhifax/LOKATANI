import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import { ProductCard } from "../../components/product/ProductCard";
import { ProductCategory, useProducts } from "../../contexts/ProductContext";
import { useRouter } from "expo-router";

export default function Home() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { products } = useProducts(); 
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"none" | "lowToHigh" | "highToLow" | "latest">(
    "none"
  );
  const [isSortModalVisible, setSortModalVisible] = useState(false);

  const categories: Array<{ key: ProductCategory | "all"; label: string }> = [
    { key: "all", label: t("home.allProducts") },
    { key: "vegetables", label: t("home.vegetables") },
    { key: "grains", label: t("home.grains") },
    { key: "fruits", label: t("home.fruits") },
  ];

  // Filter, Search, Sort
  const filteredProducts = useMemo(() => {
    let data = products;

    if (selectedCategory !== "all") {
      data = data.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nameId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === "lowToHigh") {
      data = [...data].sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      data = [...data].sort((a, b) => b.price - a.price);
    } else if (sortOption === "latest") {
      data = [...data].sort((a, b) => b.createdAt - a.createdAt);
    }

    return data;
  }, [products, selectedCategory, searchQuery, sortOption]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>{t("common.appName")}</Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t("home.freshFromFarm")}</Text>

      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={t("common.search")}
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories + Sort */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    selectedCategory === category.key ? theme.primary : theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.key ? "#FFFFFF" : theme.text,
                  },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sort Button */}
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[styles.sortButton, { borderColor: theme.border }]}
            onPress={() => setSortModalVisible(true)}
          >
            <Ionicons name="swap-vertical-outline" size={18} color={theme.text} />
            <Text style={[styles.sortText, { color: theme.text }]}>{t("sort")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)}>
            <ProductCard product={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 16,
          paddingTop: 8,
          marginTop: 8,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={64} color={theme.textLight} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t("home.noProducts")}
            </Text>
          </View>
        }
      />

      {/* Sort Modal */}
      <Modal visible={isSortModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t("sortBy")}</Text>
            {[
              { key: "lowToHigh", label: t("Price: Low To High") },
              { key: "highToLow", label: t("Price: High To Low") },
              { key: "latest", label: t("Latest") },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={styles.modalOption}
                onPress={() => {
                  setSortOption(option.key as any);
                  setSortModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    {
                      color: sortOption === option.key ? theme.primary : theme.text,
                      fontWeight: sortOption === option.key ? "700" : "400",
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSortModalVisible(false)}
            >
              <Text style={{ color: theme.error }}>{t("close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 14, marginLeft: 20, marginBottom: 12 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  categoriesContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 12,
    flexDirection: "row",
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: { fontSize: 14, fontWeight: "500" },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  sortText: { marginLeft: 6, fontSize: 14, fontWeight: "500" },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyText: { fontSize: 16, marginTop: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  modalOption: { paddingVertical: 12 },
  modalOptionText: { fontSize: 16 },
  closeButton: { marginTop: 20, alignItems: "center" },
});
