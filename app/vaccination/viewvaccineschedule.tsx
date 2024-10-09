// viewvaccineschedule.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface Reminder {
  _id: string;
  vaccineName: string;
  scheduleTime: string;
  scheduleDate: string;
  notificationReminderTime: string;
  notificationReminderDays: number;
  status: string;
  notes: string;
}

const ViewVaccinesSchedule = () => {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get('http://192.168.1.5:3000/vaccination'); 
        setReminders(response.data.data); 
      } catch (err) {
        console.error('Error fetching reminders:', err);
        setError('Failed to fetch reminders. Please try again later.');
      } finally {
        setLoading(false); 
      }
    };

    fetchReminders();
  }, []);

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={styles.reminderCard}>
      <Text style={styles.textTitle}>Vaccine Name: <Text style={styles.textValue}>{item.vaccineName}</Text></Text>
      <Text style={styles.textTitle}>Schedule Time: <Text style={styles.textValue}>{item.scheduleTime}</Text></Text>
      <Text style={styles.textTitle}>Schedule Date: <Text style={styles.textValue}>{new Date(item.scheduleDate).toLocaleDateString()}</Text></Text>
      <Text style={styles.textTitle}>Notify Time: <Text style={styles.textValue}>{item.notificationReminderTime}</Text></Text>
      <Text style={styles.textTitle}>Notify Days: <Text style={styles.textValue}>{item.notificationReminderDays}</Text></Text>
      <Text style={styles.textTitle}>Status: <Text style={styles.textValue}>{item.status}</Text></Text>
      <Text style={styles.textTitle}>Notes: <Text style={styles.textValue}>{item.notes}</Text></Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    Alert.alert('Error', error);
    return <View style={styles.errorContainer}><Text>{error}</Text></View>;
  }

  const handleBackPress = () => {
    router.push('/_sitemap'); 
  };

  // Handle empty data response
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      {reminders.length === 0 ? (
        <Text style={styles.emptyText}>No vaccination reminders available.</Text>
      ) : (
        <FlatList
          data={reminders}
          renderItem={renderReminder}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  textTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  textValue: {
    fontWeight: '400',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    marginRight: 10,
  },
});

export default ViewVaccinesSchedule;
