import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export default function MapPicker() {
  const [region, setRegion] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { theme } = useTheme();

  // ====== AMBIL LOKASI SAAT INI ======
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location is required!");
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = current.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setMarker({ latitude, longitude });
      getAddress(latitude, longitude);
      setLoading(false);
    })();
  }, []);

  // ====== AMBIL ALAMAT DARI KOORDINAT ======
  const getAddress = async (lat: number, lon: number) => {
    const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    if (geocode && geocode.length > 0) {
      const g = geocode[0];
      const readable = `${g.name || ""}, ${g.street || ""}, ${g.city || g.region || ""}`;
      setAddress(readable);
    }
  };

  const handleSelect = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    getAddress(latitude, longitude);
  };

  const handleConfirm = () => {
    router.back(); 
    router.setParams({ address, lat: marker.latitude, lon: marker.longitude });
  };

  if (loading || !region)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={region}
        onPress={handleSelect}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <View style={[styles.addressContainer, { backgroundColor: theme.surface }]}>
        <Text style={[styles.addressText, { color: theme.text }]} numberOfLines={2}>
          {address || "Pilih lokasi di peta"}
        </Text>
        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: theme.primary }]}
          onPress={handleConfirm}
        >
          <Ionicons name="checkmark" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  addressContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  addressText: { fontSize: 15, flex: 1 },
  confirmButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
