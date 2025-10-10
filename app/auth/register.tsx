import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, MapPressEvent } from "react-native-maps";

import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"farmer" | "buyer">("farmer");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  //  State peta
  const [region, setRegion] = useState({
    latitude: -6.2,
    longitude: 106.816666,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);

  //  Ambil lokasi otomatis
  const handleGetCurrentAddress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Izin lokasi diperlukan untuk mengambil alamat.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const addr = `${geocode[0].street || ""}, ${geocode[0].city || ""}, ${
          geocode[0].region || ""
        }`;
        setAddress(addr.trim());
        setMarker({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        Alert.alert("Gagal", "Alamat tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error ambil lokasi:", error);
      Alert.alert("Error", "Gagal mengambil lokasi.");
    }
  };

  // Saat user tekan di peta
  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    setRegion({ ...region, latitude, longitude });

    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const addr = `${geocode[0].street || ""}, ${geocode[0].city || ""}, ${
          geocode[0].region || ""
        }`;
        setAddress(addr.trim());
      }
    } catch (error) {
      console.error("Gagal ubah lokasi:", error);
    }
  };

  // Fungsi daftar
  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert(t("common.error"), t("auth.fillAllFields"));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t("common.error"), t("auth.passwordMismatch"));
      return;
    }

    try {
      setLoading(true);
      const result = await register({
        fullName,
        email,
        password,
        phone,
        userType,
        address,
      });

      setLoading(false);

      if (result.success) {
        Alert.alert(t("common.success"), t("auth.registerSuccess"));
        router.replace("/auth/login");
      } else {
        Alert.alert(t("common.error"), result.message || "Registrasi gagal.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Register error:", error);
      Alert.alert("Error", "Terjadi kesalahan saat registrasi.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.primary }]}>{t("common.appName")}</Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>{t("auth.createAccount")}</Text>
          </View>

          <View style={styles.form}>
            <Input
              label={t("auth.fullName")}
              placeholder={t("auth.fullName")}
              value={fullName}
              onChangeText={setFullName}
              icon="person-outline"
            />

            <Input
              label={t("auth.email")}
              placeholder={t("auth.email")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />

            <Input
              label={t("auth.phone")}
              placeholder={t("auth.phone")}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon="call-outline"
            />

            <Input
              label={t("auth.password")}
              placeholder={t("auth.password")}
              value={password}
              onChangeText={setPassword}
              isPassword
              icon="lock-closed-outline"
            />

            <Input
              label={t("auth.confirmPassword")}
              placeholder={t("auth.confirmPassword")}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              icon="lock-closed-outline"
            />

            {/* Address + Peta */}
            <View style={styles.addressRow}>
              <Input
                label={t("auth.address")}
                placeholder="Ambil alamat dari GPS"
                value={address}
                onChangeText={setAddress}
                icon="location-outline"
                style={{ flex: 1 }}
              />
              <TouchableOpacity
                style={[styles.mapButton, { backgroundColor: theme.primary }]}
                onPress={handleGetCurrentAddress}
              >
                <Ionicons name="navigate-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Map*/}
            <View style={[styles.mapCard, { backgroundColor: theme.surface }]}>
              <MapView
                style={styles.map}
                region={region}
                onPress={handleMapPress}
              >
                {marker && <Marker coordinate={marker} />}
              </MapView>
              <Text style={[styles.mapHint, { color: theme.textSecondary }]}>
                Tekan peta untuk memilih lokasi manual
              </Text>
            </View>

            {/* Pilih Role */}
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  { backgroundColor: userType === "farmer" ? theme.primary : theme.surface },
                ]}
                onPress={() => setUserType("farmer")}
              >
                <Ionicons
                  name="leaf-outline"
                  size={20}
                  color={userType === "farmer" ? "#fff" : theme.text}
                />
                <Text
                  style={[
                    styles.roleText,
                    { color: userType === "farmer" ? "#fff" : theme.text },
                  ]}
                >
                  {t("auth.farmer")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  { backgroundColor: userType === "buyer" ? theme.primary : theme.surface },
                ]}
                onPress={() => setUserType("buyer")}
              >
                <Ionicons
                  name="cart-outline"
                  size={20}
                  color={userType === "buyer" ? "#fff" : theme.text}
                />
                <Text
                  style={[
                    styles.roleText,
                    { color: userType === "buyer" ? "#fff" : theme.text },
                  ]}
                >
                  {t("auth.buyer")}
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title={t("auth.register")}
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              {t("auth.alreadyHaveAccount")}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text style={[styles.link, { color: theme.primary }]}>
                {" "}{t("auth.login")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: "center" },
  header: { marginBottom: 32, alignItems: "center" },
  title: { fontSize: 36, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 18 },
  form: { marginBottom: 24 },
  addressRow: { flexDirection: "row", alignItems: "center" },
  mapButton: {
    marginLeft: 8,
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mapCard: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  map: {
    width: "100%",
    height: 180,
  },
  mapHint: {
    padding: 8,
    fontSize: 12,
    textAlign: "center",
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    marginBottom: 24,
  },
  roleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  roleText: { fontSize: 16, fontWeight: "600" },
  registerButton: { marginTop: 12 },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  footerText: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: "600" },
});
