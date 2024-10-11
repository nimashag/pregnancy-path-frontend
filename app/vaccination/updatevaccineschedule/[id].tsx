import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import config from "../../../constants/config";
import { FontAwesome } from "@expo/vector-icons";

const UpdateVaccineSchedule = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [vaccineName, setVaccineName] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  const [showScheduleDatePicker, setShowScheduleDatePicker] = useState(false);
  const [showScheduleTimePicker, setShowScheduleTimePicker] = useState(false);
  const [selectedScheduleDate, setSelectedScheduleDate] = useState(new Date());
  const [selectedScheduleTime, setSelectedScheduleTime] = useState(new Date());

  const [isVaccineNameInvalid, setIsVaccineNameInvalid] = useState(false);

  const { setOptions } = useNavigation();
  useEffect(() => {
    setOptions({ headerShown: false });
  }, []);

  const handleBackPress = () => {
    router.back();
  };

  // Fetching schedule data from backend
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`${config.backend_url}/vaccination/${id}`);
        const schedule = response.data.data;

        if (schedule) {
          setVaccineName(schedule.vaccineName || '');
          setScheduleTime(schedule.scheduleTime || '');

          const fetchedDate = new Date(schedule.scheduleDate);
          setScheduleDate(fetchedDate.toISOString().split('T')[0]);

          setStatus(schedule.status || '');
          setNotes(schedule.notes || '');

          if (schedule.scheduleDate) {
            setSelectedScheduleDate(fetchedDate);
          }
          if (schedule.scheduleTime) {
            setSelectedScheduleTime(new Date(`1970-01-01T${schedule.scheduleTime}`));
          }
        } else {
          Alert.alert('Error', 'Schedule not found.');
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
        Alert.alert('Error', 'There was an issue fetching the schedule. Please try again.');
      }
    };

    fetchSchedule();
  }, [id]);

  // Remove special characters in real-time
  const handleVaccineNameChange = (text: string) => {
    const sanitizedText = text.replace(/[^a-zA-Z0-9 ]/g, '');
    setVaccineName(sanitizedText);

    // If text contains invalid characters, show validation message
    setIsVaccineNameInvalid(text !== sanitizedText);
  };

  const handleUpdate = async () => {
    if (!vaccineName) {
      Alert.alert('Error', 'Vaccine Name cannot be empty.');
      return;
    }

    try {
      const payload = {
        vaccineName,
        scheduleTime,
        scheduleDate: selectedScheduleDate.toISOString(),
        status,
        notes: notes || 'No special notes.',
      };

      const response = await axios.put(`${config.backend_url}/vaccination/${id}`, payload);

      if (response.status === 200) {
        Alert.alert('Success', 'Schedule updated successfully');
        router.back();
      } else {
        Alert.alert('Error', 'Failed to update the schedule');
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      Alert.alert('Error', 'There was an issue updating the schedule. Please try again.');
    }
  };

  const onChangeScheduleDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || selectedScheduleDate;
    setShowScheduleDatePicker(Platform.OS === 'ios');
    setSelectedScheduleDate(currentDate);
    setScheduleDate(currentDate.toISOString().split('T')[0]);
  };

  const onChangeScheduleTime = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || selectedScheduleTime;
    setShowScheduleTimePicker(Platform.OS === 'ios');
    setSelectedScheduleTime(currentTime);
    setScheduleTime(currentTime.toLocaleTimeString());
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View className="flex-row items-center justify-between mb-7 mt-10">
          <TouchableOpacity onPress={handleBackPress} className="ml-4">
            <FontAwesome name="chevron-left" size={24} color="#18113E" />
          </TouchableOpacity>
          <Text className="text-2xl text-center text-indigo-950 font-bold">
            Update Schedule
          </Text>
          <View />
        </View>

        <Text style={styles.label}>Vaccine Name</Text>
        <TextInput
          style={[styles.input, isVaccineNameInvalid && styles.inputError]}
          value={vaccineName}
          onChangeText={handleVaccineNameChange}
          placeholder="Enter vaccine name"
        />
        {isVaccineNameInvalid && (
          <Text style={styles.errorText}>
            Vaccine Name should only contain letters, numbers, and spaces.
          </Text>
        )}

        <Text style={styles.label}>Schedule Date</Text>
        <TouchableOpacity onPress={() => setShowScheduleDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={scheduleDate}
            placeholder="Select schedule date"
            editable={false}
          />
        </TouchableOpacity>

        {showScheduleDatePicker && (
          <DateTimePicker
            value={selectedScheduleDate}
            mode="date"
            display="default"
            onChange={onChangeScheduleDate}
          />
        )}

        <Text style={styles.label}>Schedule Time</Text>
        <TouchableOpacity onPress={() => setShowScheduleTimePicker(true)}>
          <TextInput
            style={styles.input}
            value={scheduleTime}
            placeholder="Select schedule time"
            editable={false}
          />
        </TouchableOpacity>

        {showScheduleTimePicker && (
          <DateTimePicker
            value={selectedScheduleTime}
            mode="time"
            display="default"
            onChange={onChangeScheduleTime}
          />
        )}

        <Text style={styles.label}>Status</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity onPress={() => setStatus('pending')}>
            <View style={styles.radioButton}>
              <View style={[styles.radioCircle, status === 'pending' && styles.radioCircleSelected]} />
              <Text>Pending</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStatus('completed')}>
            <View style={styles.radioButton}>
              <View style={[styles.radioCircle, status === 'completed' && styles.radioCircleSelected]} />
              <Text>Completed</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStatus('missed')}>
            <View style={styles.radioButton}>
              <View style={[styles.radioCircle, status === 'missed' && styles.radioCircleSelected]} />
              <Text>Missed</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter notes"
          multiline
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleBackPress}>
            <Text style={styles.buttonText}>✖ Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdate}>
            <Text style={styles.buttonText}>✔ Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  label: {
    fontSize: 16,
    color: '#1E1E1E',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  inputError: {
    borderColor: '#FF6347', // Red border for invalid input
  },
  textArea: {
    height: 80,
  },
  errorText: {
    color: '#FF6347',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    marginRight: 10,
  },
  radioCircleSelected: {
    backgroundColor: '#1E1E1E',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default UpdateVaccineSchedule;
