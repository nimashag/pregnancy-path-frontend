import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const UpdateVaccineSchedule = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [vaccineName, setVaccineName] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [notifyTime, setNotifyTime] = useState('');
  const [notifyDate, setNotifyDate] = useState('');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  const [showScheduleDatePicker, setShowScheduleDatePicker] = useState(false);
  const [showScheduleTimePicker, setShowScheduleTimePicker] = useState(false);
  const [showNotifyTimePicker, setShowNotifyTimePicker] = useState(false);
  const [selectedScheduleDate, setSelectedScheduleDate] = useState(new Date());
  const [selectedScheduleTime, setSelectedScheduleTime] = useState(new Date());
  const [selectedNotifyTime, setSelectedNotifyTime] = useState(new Date());

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`http://192.168.1.5:3000/vaccination/${id}`);
        const schedule = response.data.data;

        console.log('Fetched schedule data:', schedule);

        if (schedule) {
          setVaccineName(schedule.vaccineName || '');
          setScheduleTime(schedule.scheduleTime || '');

          // Set the scheduleDate correctly using the UTC date
          const fetchedDate = new Date(schedule.scheduleDate);
          setScheduleDate(fetchedDate.toISOString().split('T')[0]); 

          setNotifyTime(schedule.notificationReminderTime || '');
          setNotifyDate(schedule.notificationReminderDays ? schedule.notificationReminderDays.toString() : '');
          setStatus(schedule.status || '');
          setNotes(schedule.notes || '');

          if (schedule.scheduleDate) {
            setSelectedScheduleDate(fetchedDate); // Ensure this is the correct date object
          }
          if (schedule.scheduleTime) {
            setSelectedScheduleTime(new Date(`1970-01-01T${schedule.scheduleTime}`));
          }
          if (schedule.notificationReminderTime) {
            setSelectedNotifyTime(new Date(`1970-01-01T${schedule.notificationReminderTime}`));
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

  const handleUpdate = async () => {
    try {
      const payload = {
        vaccineName,
        scheduleTime,
        // Send the date as an ISO string to handle time zones properly
        scheduleDate: selectedScheduleDate.toISOString(),
        notificationReminderTime: notifyTime,
        notificationReminderDays: parseInt(notifyDate) || 0,
        status,
        notes,
      };

      const response = await axios.put(`http://192.168.1.5:3000/vaccination/${id}`, payload);

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
    setScheduleDate(currentDate.toISOString().split('T')[0]); // Set as 'YYYY-MM-DD'
  };

  const onChangeScheduleTime = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || selectedScheduleTime;
    setShowScheduleTimePicker(Platform.OS === 'ios');
    setSelectedScheduleTime(currentTime);
    setScheduleTime(currentTime.toLocaleTimeString());
  };

  const onChangeNotifyTime = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || selectedNotifyTime;
    setShowNotifyTimePicker(Platform.OS === 'ios');
    setSelectedNotifyTime(currentTime);
    setNotifyTime(currentTime.toLocaleTimeString());
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Update Schedule</Text>

        <Text style={styles.label}>Vaccine Name</Text>
        <TextInput
          style={styles.input}
          value={vaccineName}
          onChangeText={setVaccineName}
          placeholder="Enter vaccine name"
        />

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

        <Text style={styles.label}>Notify Time</Text>
        <TouchableOpacity onPress={() => setShowNotifyTimePicker(true)}>
          <TextInput
            style={styles.input}
            value={notifyTime}
            placeholder="Select notify time"
            editable={false}
          />
        </TouchableOpacity>

        {showNotifyTimePicker && (
          <DateTimePicker
            value={selectedNotifyTime}
            mode="time"
            display="default"
            onChange={onChangeNotifyTime}
          />
        )}

        <Text style={styles.label}>Notify Days</Text>
        <TextInput
          style={styles.input}
          value={notifyDate}
          onChangeText={setNotifyDate}
          placeholder="Enter notify days"
          keyboardType="numeric"
        />

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
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#252A4A',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    borderWidth: 2,
    borderColor: '#1E1E1E',
    marginRight: 10,
  },
  radioCircleSelected: {
    backgroundColor: '#1E1E1E',
  },
});

export default UpdateVaccineSchedule;
