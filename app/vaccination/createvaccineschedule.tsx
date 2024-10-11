import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useRouter, useNavigation } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";
import config from "../../constants/config";

const CreateVaccinationSchedule = () => {
  const router = useRouter();
  const [vaccineName, setVaccineName] = useState("");
  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [notificationReminderTime, setNotificationReminderTime] = useState(new Date());
  const [notificationReminderDays, setNotificationReminderDays] = useState(0);
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [showScheduleTimePicker, setShowScheduleTimePicker] = useState(false);
  const [showScheduleDatePicker, setShowScheduleDatePicker] = useState(false);
  const [showNotificationReminderTimePicker, setShowNotificationReminderTimePicker] = useState(false);
  const [showNotificationReminderDatePicker, setShowNotificationReminderDatePicker] = useState(false);
  const [vaccineNameError, setVaccineNameError] = useState("");

  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({ headerShown: false });
  }, []);
  
  const onScheduleTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (event.type === 'set' && selectedTime) {
      setScheduleTime(selectedTime);
    }
    setShowScheduleTimePicker(false);
  };

  const onScheduleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (event.type === 'set' && selectedDate) {
      // Check if the selected date is in the past
      const currentDate = new Date();
      if (selectedDate < currentDate) {
        Alert.alert("Error", "Can't select a past date.");
        return; // Do not update state if date is in the past
      }
      setScheduleDate(selectedDate);
    }
    setShowScheduleDatePicker(false);
  };

  const onNotificationReminderTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (event.type === 'set' && selectedTime) {
      setNotificationReminderTime(selectedTime);
    }
    setShowNotificationReminderTimePicker(false);
  };

  const handleBackPress = () => {
    router.back(); 
  };

  const handleVaccineNameChange = (text: string) => {
    // Regular expression to allow only letters, numbers, and spaces
    const regex = /^[A-Za-z0-9\s]*$/;

    if (regex.test(text)) {
      setVaccineName(text);
      setVaccineNameError(""); 
    } else {
      setVaccineNameError("Vaccine name can only contain letters, numbers, and spaces.");
    }
  };

  const handleSubmit = async () => {
    if (!vaccineName || !scheduleDate || !scheduleTime) {
      Alert.alert("Error", "Vaccine name, schedule date, and schedule time are required.");
      return;
    }

    // Set default notes if none are provided
    const finalNotes = notes.trim() === "" ? "No special notes." : notes;

    try {
      const response = await axios.post(`${config.backend_url}/vaccination`, {
        userId: "66dc91bfa30ade59031324c4",
        vaccineName,
        scheduleTime: scheduleTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        scheduleDate: scheduleDate.toISOString(),
        status,
        notes: finalNotes,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Vaccination schedule created successfully!");
        router.back(); // Navigate back after successful submission
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create vaccination schedule. Please try again.");
    }
  };

  const handleCancel = () => {
    router.back(); // Navigate back when cancel is clicked
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100} 
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        
      <View className="flex-row items-center justify-between mb-4 mt-10">
        <TouchableOpacity onPress={handleBackPress} className="ml-4">
        <FontAwesome name="chevron-left" size={24} color="#18113E" />
        </TouchableOpacity>
        <Text className="text-2xl text-center text-indigo-950 font-bold">
          Vaccination Schedules
        </Text>
      <View />
      </View>

        <Text style={styles.label}>Vaccine Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter vaccine name here..."
          value={vaccineName}
          onChangeText={handleVaccineNameChange}
        />
        {vaccineNameError ? <Text style={styles.errorText}>{vaccineNameError}</Text> : null}

        <Text style={styles.label}>Schedule Time</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowScheduleTimePicker(true)}>
          <Text>
            {scheduleTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
        {showScheduleTimePicker && (
          <DateTimePicker
            value={scheduleTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={onScheduleTimeChange}
          />
        )}

        <Text style={styles.label}>Schedule Date</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowScheduleDatePicker(true)}>
          <Text>{scheduleDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showScheduleDatePicker && (
          <DateTimePicker
            value={scheduleDate}
            mode="date"
            display="default"
            onChange={onScheduleDateChange}
          />
        )}

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter any notes here..."
          value={notes}
          onChangeText={setNotes}
          multiline={true}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  },
  descriptionInput: {
    height: 128,
  },
  errorText: {
    color: "#CC1616",
    fontSize: 14,
    marginBottom: 8,
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

export default CreateVaccinationSchedule;
