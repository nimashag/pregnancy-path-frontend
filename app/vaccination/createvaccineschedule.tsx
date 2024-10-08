import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useRouter } from 'expo-router';

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

  const onScheduleTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowScheduleTimePicker(false);
    if (selectedTime) {
      setScheduleTime(selectedTime);
    }
  };

  const onScheduleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowScheduleDatePicker(false);
    if (selectedDate) {
      setScheduleDate(selectedDate);
    }
  };

  const onNotificationReminderTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowNotificationReminderTimePicker(false);
    if (selectedTime) {
      setNotificationReminderTime(selectedTime);
    }
  };

  const handleSubmit = async () => {
    if (!vaccineName || !notificationReminderDays) {
      Alert.alert("Error", "Vaccine name and notification days are required.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.1.5:3000/vaccination", {
        userId: "66dc91bfa30ade59031324c4", // aththa users wa dapuwama meka remove karanna pettiyolaaaaaaaaaaaa
        vaccineName,
        scheduleTime: scheduleTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        scheduleDate: scheduleDate.toISOString(),
        notificationReminderTime: notificationReminderTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        notificationReminderDays,
        status,
        notes,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Vaccination schedule created successfully!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create vaccination schedule. Please try again.");
    }
  };

  const handleBackPress = () => {
    router.push('/_sitemap'); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      <Text style={styles.headerText}>Create Vaccination Schedule</Text>

      <Text style={styles.label}>Vaccine Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter vaccine name here..."
        value={vaccineName}
        onChangeText={setVaccineName}
      />

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

      <Text style={styles.label}>Notification Reminder Time</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowNotificationReminderTimePicker(true)}>
        <Text>
          {notificationReminderTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
      {showNotificationReminderTimePicker && (
        <DateTimePicker
          value={notificationReminderTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onNotificationReminderTimeChange}
        />
      )}

      <Text style={styles.label}>Notification Reminder Days</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter days before schedule..."
        keyboardType="numeric"
        value={notificationReminderDays.toString()}
        onChangeText={(value) => setNotificationReminderDays(Number(value))}
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Enter any notes here..."
        value={notes}
        onChangeText={setNotes}
        multiline={true}
      />

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
  },
  descriptionInput: {
    height: 128,
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
  backButton: {
    marginRight: 10,
  },
});

export default CreateVaccinationSchedule;
