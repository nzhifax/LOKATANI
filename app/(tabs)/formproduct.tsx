import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../contexts/ThemeContext";
import { useProducts } from "../../contexts/ProductContext";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";

export default function FormProduct() {
  const { theme } = useTheme();
  const { addProduct } = useProducts();
  const router = useRouter();
  const { t } = useTranslation(); 

  const [name, setName] = useState("");
  const [farmer, setFarmer] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name || !farmer || !price || !category) {
      alert(t("fillAllFields"));
      return;
    }

    addProduct({
      id: Date.now().toString(),
      name,
      farmer: { id: "1", name: farmer },
      category,
      price: parseInt(price),
      unit,
      stock: parseInt(stock) || 0,
      image: image || "https://via.placeholder.com/300",
    });

    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={[styles.label, { color: theme.text }]}>{t("product name")}</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder={t("enter name")}
        placeholderTextColor={theme.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <Text style={[styles.label, { color: theme.text }]}>{t("product farmer")}</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder={t("enter farmer")}
        placeholderTextColor={theme.textSecondary}
        value={farmer}
        onChangeText={setFarmer}
      />

      <Text style={[styles.label, { color: theme.text }]}>{t("product category")}</Text>
      <View style={[styles.pickerContainer, { borderColor: theme.border }]}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          dropdownIconColor={theme.primary}
          style={{ color: theme.text }}
        >
          <Picker.Item label={t("select category")} value="" />
          <Picker.Item label={t("vegetables")} value="vegetables" />
          <Picker.Item label={t("grains")} value="grains" />
          <Picker.Item label={t("fruits")} value="fruits" />
        </Picker>
      </View>

      <Text style={[styles.label, { color: theme.text }]}>{t("product price")}</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder={t("enter price")}
        placeholderTextColor={theme.textSecondary}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={[styles.label, { color: theme.text }]}>{t("product stock")}</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder={t("enter stock")}
        placeholderTextColor={theme.textSecondary}
        keyboardType="numeric"
        value={stock}
        onChangeText={setStock}
      />

      <Text style={[styles.label, { color: theme.text }]}>{t("product photo")}</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={{ color: theme.textSecondary }}>{t("choose photo")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>{t("save product")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { marginTop: 12, marginBottom: 4, fontSize: 14, fontWeight: "600" },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14 },
  imagePicker: {
    height: 160,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imagePreview: { width: "100%", height: "100%" },
  button: { marginTop: 20, padding: 14, borderRadius: 10, alignItems: "center" },
  pickerContainer: { borderWidth: 1, borderRadius: 8, overflow: "hidden" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
