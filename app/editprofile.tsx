import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("male");
  const [avatar, setAvatar] = useState<string | null>(null);

  // State untuk alamat dan koordinat
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      if (user.dob) setDob(new Date(user.dob));
      if (user.gender) setGender(user.gender);
      if (user.photo) setAvatar(user.photo);
      if (user.address) setAddress(user.address);
      if (user.location)
        setLocation({ latitude: user.location.latitude, longitude: user.location.longitude });
    }
  }, [user]);

  const handleSave = () => {
    console.log("Profile Saved:", {
      name,
      email,
      phone,
      dob,
      gender,
      avatar,
      address,
      location,
    });
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // Ambil lokasi otomatis
  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Izin lokasi diperlukan untuk mendeteksi alamat otomatis.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    setLocation(coords);

    // Ambil alamat dari koordinat
    const geocode = await Location.reverseGeocodeAsync(coords);
    if (geocode[0]) {
      const { street, district, city, region } = geocode[0];
      const formatted = `${street || ""} ${district || ""}, ${city || ""}, ${region || ""}`;
      setAddress(formatted.trim());
    }
  };

  // Kalau user tap di peta
  const handleMapPress = async (e: MapPressEvent) => {
    const coords = e.nativeEvent.coordinate;
    setLocation(coords);

    const geocode = await Location.reverseGeocodeAsync(coords);
    if (geocode[0]) {
      const { street, district, city, region } = geocode[0];
      const formatted = `${street || ""} ${district || ""}, ${city || ""}, ${region || ""}`;
      setAddress(formatted.trim());
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Edit Profile</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={
            avatar
              ? { uri: avatar }
              : { uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png" }
          }
          style={[styles.avatar, { borderColor: theme.primary }]}
        />
        <TouchableOpacity
          style={[styles.changePhotoBtn, { backgroundColor: theme.surface }]}
          onPress={pickImage}
        >
          <Text style={[styles.changePhotoText, { color: theme.text }]}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.primary + "40" }]}
          placeholder="Enter your name"
          placeholderTextColor={theme.textSecondary}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.label, { color: theme.text }]}>Email</Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.primary + "40" }]}
          placeholder="Enter your email"
          placeholderTextColor={theme.textSecondary}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { color: theme.text }]}>Phone</Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.primary + "40" }]}
          placeholder="Enter phone number"
          placeholderTextColor={theme.textSecondary}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Address + Map */}
        <Text style={[styles.label, { color: theme.text }]}>Address</Text>
        <View style={styles.addressRow}>
          <TextInput
            style={[
              styles.addressInput,
              { color: theme.text, borderColor: theme.primary + "40" },
            ]}
            placeholder="Enter your address"
            placeholderTextColor={theme.textSecondary}
            value={address}
            onChangeText={setAddress}
          />
          <TouchableOpacity
            style={[styles.locateButton, { backgroundColor: theme.primary }]}
            onPress={getCurrentLocation}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>📍</Text>
          </TouchableOpacity>
        </View>

        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={handleMapPress}
          >
            <Marker coordinate={location} />
          </MapView>
        )}

        <Text style={[styles.label, { color: theme.text }]}>Date of Birth</Text>
        <TouchableOpacity
          style={[styles.dateButton, { borderColor: theme.primary + "40" }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.dateText, { color: theme.text }]}>
            {dob.toLocaleDateString("en-GB")}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || dob;
              setShowDatePicker(false);
              setDob(currentDate);
            }}
          />
        )}

        <Text style={[styles.label, { color: theme.text }]}>Gender</Text>
        <View
          style={[
            styles.pickerContainer,
            { borderColor: theme.primary + "40", backgroundColor: theme.background },
          ]}
        >
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            dropdownIconColor={theme.primary}
            style={{ color: theme.text }}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: theme.surface }]}
          onPress={handleCancel}
        >
          <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: "#fff" }]}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  avatarContainer: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 110, height: 110, borderRadius: 60, borderWidth: 2 },
  changePhotoBtn: { marginTop: 10, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 },
  changePhotoText: { fontSize: 14, fontWeight: "600" },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 25,
  },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 15,
  },
  addressRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  addressInput: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
  },
  locateButton: {
    marginLeft: 8,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateButton: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  dateText: { fontSize: 15 },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40 },
  cancelButton: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center", marginRight: 10 },
  cancelButtonText: { fontWeight: "600", fontSize: 15 },
  saveButton: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center", marginLeft: 10 },
  saveButtonText: { fontWeight: "600", fontSize: 15 },
});
