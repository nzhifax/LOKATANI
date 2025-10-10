import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

interface MapPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (coords: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
}

export default function MapPickerModal({
  visible,
  onClose,
  onLocationSelect,
}: MapPickerModalProps) {
  const { theme } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [fetchingAddress, setFetchingAddress] = useState(false);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Izin lokasi diperlukan untuk menggunakan fitur ini.");
        setLoading(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      setLocation(current);
      const coords = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };
      setSelectedCoords(coords);
      await fetchAddress(coords.latitude, coords.longitude);
      setLoading(false);
    })();
  }, [visible]);

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      setFetchingAddress(true);
      const result = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (result.length > 0) {
        const { street, city, region, subregion, country } = result[0];
        const formatted = [street, subregion, city, region, country]
          .filter(Boolean)
          .join(", ");
        setAddress(formatted || "Alamat tidak ditemukan");
      } else {
        setAddress("Alamat tidak ditemukan");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Gagal memuat alamat");
    } finally {
      setFetchingAddress(false);
    }
  };

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedCoords({ latitude, longitude });
    await fetchAddress(latitude, longitude);
  };

  const handleConfirm = () => {
    if (selectedCoords) {
      onLocationSelect({
        latitude: selectedCoords.latitude,
        longitude: selectedCoords.longitude,
        address,
      });
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Pilih Lokasi Anda</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.text }]}>Memuat peta...</Text>
            </View>
          ) : (
            <>
              <View style={styles.mapContainer}>
                {location && (
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    onPress={handleMapPress}
                  >
                    {selectedCoords && <Marker coordinate={selectedCoords} />}
                  </MapView>
                )}
              </View>

              {selectedCoords && (
                <View style={styles.coordsContainer}>
                  <Text style={[styles.coordText, { color: theme.textSecondary }]}>
                    Latitude: {selectedCoords.latitude.toFixed(6)}
                  </Text>
                  <Text style={[styles.coordText, { color: theme.textSecondary }]}>
                    Longitude: {selectedCoords.longitude.toFixed(6)}
                  </Text>

                  {fetchingAddress ? (
                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                      Mengambil alamat...
                    </Text>
                  ) : (
                    <Text style={[styles.addressText, { color: theme.text }]}>
                      📍 {address}
                    </Text>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleConfirm}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Gunakan Lokasi Ini</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  card: {
    height: Dimensions.get("window").height * 0.68,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  mapContainer: {
    borderRadius: 12,
    overflow: "hidden",
    height: Dimensions.get("window").height * 0.35,
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  coordsContainer: {
    marginBottom: 12,
  },
  coordText: {
    fontSize: 14,
  },
  addressText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 15,
  },
});
