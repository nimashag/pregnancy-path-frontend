import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

const NotificationPage = () => {
  const { scheduleId } = useLocalSearchParams(); // Get scheduleId from route params
  const [vaccinationSchedules, setVaccinationSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('1day'); // Default filter

  // Fetch vaccination schedules
  const fetchVaccinationSchedules = async () => {
    try {
      const response = await axios.get(`http://192.168.1.5:3000/vaccination/${scheduleId}`); // meka wenas karanna pettiyos
      setVaccinationSchedules([response.data]); // Assuming response.data is a single schedule object
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vaccination schedules:", error);
      setLoading(false);
    }
  };

  const getFilteredSchedules = () => {
    const now = new Date();
    let upcomingSchedules = vaccinationSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.scheduleDate);
      const timeDifference = scheduleDate - now;

      switch (filter) {
        case '1day':
          return timeDifference > 0 && timeDifference <= 86400000; // 1 day in milliseconds
        case '1week':
          return timeDifference > 0 && timeDifference <= 604800000; // 1 week in milliseconds
        case '1month':
          return timeDifference > 0 && timeDifference <= 2592000000; // 1 month in milliseconds
        default:
          return false;
      }
    });
    setFilteredSchedules(upcomingSchedules);
  };

  useEffect(() => {
    fetchVaccinationSchedules();
  }, [scheduleId]); // Re-fetch if scheduleId changes

  useEffect(() => {
    if (vaccinationSchedules.length > 0) {
      getFilteredSchedules();
    }
  }, [filter, vaccinationSchedules]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Vaccination Schedules</Text>
      <View style={styles.buttonContainer}>
        <Button title="Within 1 Day" onPress={() => setFilter('1day')} />
        <Button title="Within 1 Week" onPress={() => setFilter('1week')} />
        <Button title="Within 1 Month" onPress={() => setFilter('1month')} />
      </View>
      <FlatList
        data={filteredSchedules}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text>{item.vaccineName}</Text>
            <Text>{new Date(item.scheduleDate).toLocaleString()}</Text>
            <Text>{item.notes}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  scheduleItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default NotificationPage;
