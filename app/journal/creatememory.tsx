import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import axios from "axios";

const CreateEventScreen = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [eventTime, setEventTime] = useState(new Date());
  const [eventDate, setEventDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setEventTime(selectedTime);
    }
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  // Function to pick an image from the gallery
  const pickImageAsync = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
    
  };

  const handleSubmit = async () => {
    if (!eventName || !eventDescription || !selectedFeeling) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", eventName);
      formData.append("description", eventDescription);
      formData.append("feelings", selectedFeeling);
      formData.append("time", eventTime.toLocaleTimeString());
      formData.append("date", eventDate.toISOString());

      // Post the memory data to your backend
    //   const response = await axios.post(
    //     "http://localhost:3000/memory",
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );
    // const response = await axios.post("http://192.168.1.8:3000/memory",{
    const response = await fetch('http://192.168.1.8:3000/memory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image: selectedImage || null,
            name: eventName,
            description: eventDescription,
            feelings:selectedFeeling,
            time:eventTime.toLocaleTimeString(),
            date:eventDate.toISOString(),
        })
    });

      if (response.status === 200) {
        Alert.alert("Success", "Memory created successfully!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create memory. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Create a Memory</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event name here..."
        value={eventName}
        onChangeText={setEventName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Enter event description here..."
        value={eventDescription}
        onChangeText={setEventDescription}
        multiline={true}
      />

      <Text style={styles.label}>Add a Picture</Text>
      <TouchableOpacity style={styles.imageContainer} onPress={pickImageAsync}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <Image
            source={require("../../assets/images/addpicture.png")}
            style={styles.image}
          />
        )}
        <FontAwesome
          name="camera"
          size={24}
          color="#18113E"
          style={styles.icon}
        />
      </TouchableOpacity>

      <Text style={styles.label}>What are you feeling</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedFeeling}
          onValueChange={(itemValue) => setSelectedFeeling(itemValue)}
        >
          <Picker.Item label="Select one" value="" />
          <Picker.Item label="Joyful & Fun" value="Joyful & Fun" />
          <Picker.Item label="Happy & Excited" value="Happy & Excited" />
          <Picker.Item label="Calm" value="Calm" />
        </Picker>
      </View>

      <View style={styles.timeDateContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.label}>Enter Time</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <Text>
              {eventTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={eventTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.label}>Enter Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{eventDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F3F4F6",
    minHeight: "100%",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#18113E",
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  descriptionInput: {
    height: 128,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
    width: "100%",
    height: 160,
    backgroundColor: "#D3D3D3", // Ash color background (light gray)
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    opacity: 0.5, // Lowers the opacity to create a dimmer effect
  },
  icon: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#FFFFFF",
    padding: 6,
    borderRadius: 50,
    opacity: 0.8,
  },
  pickerContainer: {
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeContainer: {
    flex: 1,
  },
  dateContainer: {
    flex: 1,
    marginLeft: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: "#CC1616",
    borderRadius: 8,
    padding: 16,
    width: 150,
  },
  submitButton: {
    backgroundColor: "#0F620B",
    borderRadius: 8,
    padding: 16,
    width: 150,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default CreateEventScreen;