import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { useRouter, useNavigation } from 'expo-router';
import config from "../../constants/config";
import { FontAwesome } from "@expo/vector-icons";

interface Reminder {
  _id: string;
  vaccineName: string;
  scheduleTime: string;
  scheduleDate: string;
  status: string;
  notes: string;
}

const ViewVaccinesSchedule = () => {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const { setOptions } = useNavigation();
  useEffect(() => {
    setOptions({ headerShown: false });
  }, []);

  // Fetch reminders function
  const fetchReminders = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${config.backend_url}/vaccination`);
      const fetchedReminders = response.data.data;

      // Sort reminders by scheduleDate in ascending order
      const sortedReminders = fetchedReminders.sort((a: Reminder, b: Reminder) => {
        return new Date(a.scheduleDate).getTime() - new Date(b.scheduleDate).getTime();
      });

      setReminders(sortedReminders); // Set the sorted reminders
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setError('Failed to fetch reminders. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleBackPress = () => {
    router.back(); 
  };

  useEffect(() => {
    fetchReminders(); // Fetch reminders on component mount
  }, []);

  const handleUpdate = (id: string) => {
    router.push(`/vaccination/updatevaccineschedule/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${config.backend_url}/vaccination/${id}`);
      setReminders(reminders.filter(reminder => reminder._id !== id));
      Alert.alert('Success', 'Reminder deleted successfully.');
    } catch (err) {
      console.error('Error deleting reminder:', err);
      Alert.alert('Error', 'Failed to delete reminder. Please try again.');
    }
  };

  const handleAddNewSchedule = () => {
    router.push('/vaccination/createvaccineschedule'); 
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={styles.reminderCard}>
      <Text style={styles.textTitle}>Vaccine Name: <Text style={styles.textValue}>{item.vaccineName}</Text></Text>
      <Text style={styles.textTitle}>Schedule Time: <Text style={styles.textValue}>{item.scheduleTime}</Text></Text>
      <Text style={styles.textTitle}>Schedule Date: <Text style={styles.textValue}>{new Date(item.scheduleDate).toLocaleDateString()}</Text></Text>
      <Text style={styles.textTitle}>Status: <Text style={styles.textValue}>{item.status}</Text></Text>
      <Text style={styles.textTitle}>Notes: <Text style={styles.textValue}>{item.notes}</Text></Text>

      {/* Update and Delete Buttons with Images */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleUpdate(item._id)}>
          <Image 
            source={require('../../assets/images/buttons/updatebtn.png')} 
            style={styles.imageButton} 
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleDelete(item._id)}>
          <Image 
            source={require('../../assets/images/buttons/deletebtn.png')} 
            style={styles.imageButton}
            resizeMode="contain"
          />
        </TouchableOpacity>
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

  // Handle empty data response
  return (
    <ScrollView>
      <View className="flex-row items-center justify-between mb-4 mt-10">
        <TouchableOpacity onPress={handleBackPress} className="ml-4">
        <FontAwesome name="chevron-left" size={24} color="#18113E" />
        </TouchableOpacity>
        <Text className="text-2xl text-center text-indigo-950 font-bold">
          Vaccination Schedules
        </Text>
      <View />
      </View>

      {/* Display the total count of reminders */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>Total Schedules: {reminders.length}</Text>
      </View>

      <View>
        {/*Button Container */}
        <View style={styles.buttonContainer2}>
          {/* Add New Schedule Button */}
          <TouchableOpacity style={styles.fullWidthButton} onPress={handleAddNewSchedule}>
            <Text style={styles.fullWidthButtonText}>+ Add New Schedule</Text>
          </TouchableOpacity>
          {/* Refresh Button */}
          <TouchableOpacity style={styles.fullWidthButton2} onPress={fetchReminders}>
            <Text style={styles.fullWidthButtonText}>Refresh Tab</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
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
    paddingBottom: 20, 
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
  buttonContainer2: {
    flexDirection: 'row', 
    justifyContent: 'center',
    padding: 20,
    gap: 10
  },
  countContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fullWidthButton: {
    backgroundColor: '#FF979E', 
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '50%', 
  },
  fullWidthButton2: {
    backgroundColor: '#0E4C80', 
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '40%', 
  },
  fullWidthButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center', 
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
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginBottom: 5,
  },
  imageButton: {
    width: 90, 
    height: 60, 
  },
  button: { 
    marginHorizontal: 8,
  },
});

export default ViewVaccinesSchedule;
