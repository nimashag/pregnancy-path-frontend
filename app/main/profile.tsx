import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite/legacy";
import BackButton from "@/utils/backButtin";

// Open the SQLite database
const db = SQLite.openDatabase("user_metadata.db");

const Profile = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [pregnancyWeek, setPregnancyWeek] = useState("");
  const [weight, setWeight] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [guardianDetails, setGuardianDetails] = useState([""]); // Array for multiple guardians

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem("profile");
        const imageUri = await AsyncStorage.getItem("profileImage");

        if (profile) {
          const userData = JSON.parse(profile);
          setUserName(userData.name || "");
          setEmail(userData.email || "");
          setPregnancyWeek(userData.pregnancyWeek || "");
          setWeight(userData.weight || "");
          setDeliveryDate(userData.deliveryDate || "");
          setGuardianDetails(userData.guardianDetails || [""]);
        }

        if (imageUri) {
          setProfileImage(imageUri); // Set the image URI from AsyncStorage
        }
      } catch (error) {
        console.error("Error retrieving user profile or image:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const updatedProfile = {
        name: userName,
        email: email,
        pregnancyWeek: pregnancyWeek,
        weight: weight,
        deliveryDate: deliveryDate,
        guardianDetails: guardianDetails,
      };

      await AsyncStorage.setItem("profile", JSON.stringify(updatedProfile));

      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS personal_data (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pregnancyWeek TEXT, weight TEXT, deliveryDate TEXT, guardianDetails TEXT);"
        );
        tx.executeSql(
          "INSERT INTO personal_data (name, pregnancyWeek, weight, deliveryDate, guardianDetails) VALUES (?, ?, ?, ?, ?);",
          [
            userName,
            pregnancyWeek,
            weight,
            deliveryDate,
            JSON.stringify(guardianDetails),
          ]
        );
      });

      Alert.alert("Success", "Profile updated successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not update profile. Please try again.");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.assets[0].uri); // Set the selected image URI
      await AsyncStorage.setItem("profileImage", result.assets[0].uri);
    }
  };

  const addGuardianField = () => {
    setGuardianDetails([...guardianDetails, ""]); // Add a new guardian input
  };

  const handleGuardianChange = (text, index) => {
    const newGuardianDetails = [...guardianDetails];
    newGuardianDetails[index] = text;
    setGuardianDetails(newGuardianDetails);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View className="absolute top-6 left-4 mb-3">
        <BackButton />
      </View>
      <Text className="text-left w-full font-bold text-xl mt-11"> Profile </Text>

      {/* Profile Image */}
      <TouchableOpacity onPress={pickImage}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
            className="mt-4"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.addImageText}>Add Profile Image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Personal Information */}
      <Text style={styles.sectionHeader}>Personal Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      {/* Pregnancy Details */}
      <Text style={styles.sectionHeader}>Pregnancy Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Pregnancy Week"
        value={pregnancyWeek}
        onChangeText={setPregnancyWeek}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Delivery Date"
        value={deliveryDate}
        onChangeText={setDeliveryDate}
      />

      {/* Guardians */}
      <Text style={styles.sectionHeader}>Guardian Details</Text>
      {guardianDetails.map((guardian, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Guardian ${index + 1}`}
          value={guardian}
          onChangeText={(text) => handleGuardianChange(text, index)}
        />
      ))}
      <TouchableOpacity onPress={addGuardianField} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Another Guardian</Text>
      </TouchableOpacity>

      {/* Update Profile Button */}
      <TouchableOpacity onPress={handleUpdateProfile} style={styles.button}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007BFF",
    alignSelf: "flex-start",
  },
  profileImage: {
    width: 320, // Rectangular image
    height: 150,
    marginBottom: 20,
    borderWidth: 2,
    borderRadius: 5,
  },
  imagePlaceholder: {
    width: 320,
    height: 150,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  addImageText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default Profile;
