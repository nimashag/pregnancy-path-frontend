import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, ScrollView, Image, Modal, Button } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

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

const NotificationPage = () => {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'1day' | '1week' | '1month'>('1day');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchReminders = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchReminders();
  }, []);

  const filterReminders = () => {
    const now = new Date();
    return reminders.filter((reminder) => {
      const scheduleDate = new Date(reminder.scheduleDate);
      const timeDifference = scheduleDate.getTime() - now.getTime();

      switch (filter) {
        case '1day':
          return timeDifference > 0 && timeDifference <= 86400000; // Within 1 day
        case '1week':
          return timeDifference > 0 && timeDifference <= 604800000; // Within 1 week
        case '1month':
          return timeDifference > 0 && timeDifference <= 2592000000; // Within 1 month
        default:
          return true;
      }
    });
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={styles.reminderCard}>  
      <Image 
        source={require('../../assets/images/vaccination/vaccinoti.png')}
        style={styles.reminderImage} 
      />
      
      <View style={styles.reminderDetails}>
        <Text style={styles.textTitle}>Vaccine Name: <Text style={styles.textValue}>{item.vaccineName}</Text></Text>
        <Text style={styles.textTitle}>Schedule Time: <Text style={styles.textValue}>{item.scheduleTime}</Text></Text>
        <Text style={styles.textTitle}>Schedule Date: <Text style={styles.textValue}>{new Date(item.scheduleDate).toLocaleDateString()}</Text></Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    Alert.alert('Error', error);
    return <View style={styles.errorContainer}><Text>{error}</Text></View>;
  }

  const filteredReminders = filterReminders();

  return (
    <ScrollView>
      <View>
        <Text style={styles.cardTitle}>Notification Panel</Text>
        
        {/* Filter Container */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Filter By: </Text>
          <View style={styles.filterButton}>
            <Button 
              title={`Within ${filter === '1day' ? '1 Day' : filter === '1week' ? '1 Week' : '1 Month'}`} 
              onPress={() => setModalVisible(true)} 
            />
          </View>
        </View>

        {/* Modal for filtering */}
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalView}>
            <Text style={styles.pickerLabel1}>Select Time Frame:</Text>
            <Picker
              selectedValue={filter}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setFilter(itemValue);
                setModalVisible(false);
              }}
            >
              <Picker.Item label="Within 1 Day" value="1day" />
              <Picker.Item label="Within 1 Week" value="1week" />
              <Picker.Item label="Within 1 Month" value="1month" />
            </Picker>
            <Button title="" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      </View>
      <View style={styles.container}>
        {filteredReminders.length === 0 ? (
          <Text style={styles.emptyText}>No vaccination notifications available.</Text>
        ) : (
          <FlatList
            data={filteredReminders}
            renderItem={renderReminder}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center', 
  },
  reminderImage: {
    width: 60,
    height: 60,
    marginRight: 15, 
  },
  reminderDetails: {
    flex: 1,
    margin: 10
  },
  textTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textValue: {
    fontSize: 16,
    fontWeight: '400',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#000',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  pickerLabel: {
    fontSize: 18,
    marginTop: 5,
    marginLeft: 10,
  },
  filterButton: {
    flex: 1,
    marginTop: 5,
    marginRight: 10,
    alignItems: 'flex-end', 
  },
  pickerLabel1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
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
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
    color: '#777',
  },
});

export default NotificationPage;
