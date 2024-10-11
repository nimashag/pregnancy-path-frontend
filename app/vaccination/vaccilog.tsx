import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import axios from 'axios';
import config from "../../constants/config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from 'expo-router';

type Vaccine = {
  _id: string;
  vaccineName: string;
  vaccineDescription: string;
  vaccineImage: string;
  vaccineMonth: number[];
  vaccineStatus: string;
};

type MonthData = {
  month: string;
  vaccines: Vaccine[];
};

const VaccinationLog = () => {
  const [vaccineData, setVaccineData] = useState<MonthData[]>([]);
  const [takenVaccines, setTakenVaccines] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();
  
  const handleBackPress = () => {
    router.back(); 
  };

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await axios.get(`${config.backend_url}/vaccine`); //meka wenas karanna amathaka karanna epa pettiyo
        const data: Vaccine[] = response.data.data;

        // Organizing data by month
        const organizedData: MonthData[] = Array.from({ length: 9 }, (_, index) => ({
          month: `Month - ${index + 1}`,
          vaccines: data.filter(vaccine => vaccine.vaccineMonth.includes(index + 1)),
        }));

        setVaccineData(organizedData);
        await loadTakenVaccines(); // Load the saved vaccine status
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };

    fetchVaccines();
  }, []);

  const loadTakenVaccines = async () => {
    try {
      const storedData = await AsyncStorage.getItem('takenVaccines');
      if (storedData) {
        setTakenVaccines(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading taken vaccines:', error);
    }
  };

  const handleSwitchChange = async (vaccineId: string, monthIndex: number) => {
    const key = `${vaccineId}-${monthIndex}`; // Create a unique key for each vaccine and month
    const updatedTakenVaccines = {
      ...takenVaccines,
      [key]: !takenVaccines[key], // Toggle the taken status
    };
    setTakenVaccines(updatedTakenVaccines);
    await AsyncStorage.setItem('takenVaccines', JSON.stringify(updatedTakenVaccines)); // Save to local storage
  };

  return (
    <ScrollView style={styles.container}>

      <View className="flex-row items-center justify-between mb-4 mt-5">
        <TouchableOpacity onPress={handleBackPress} className="ml-1">
        <FontAwesome name="chevron-left" size={24} color="#18113E" />
        </TouchableOpacity>
        <Text className="text-2xl text-center text-indigo-950 font-bold">
          Vaccination Log
        </Text>
        <View />
      </View>

      {vaccineData.map((item, index) => (
        <View key={index} style={styles.monthContainer}>
          <Text style={styles.monthTitle}>{item.month}</Text>
          {item.vaccines.map((vaccine) => {
            const key = `${vaccine._id}-${index}`; 
            return (
              <View key={vaccine._id} style={styles.vaccineContainer}>
                <View style={styles.checkboxContainer}>
                  <Switch
                    value={takenVaccines[key] || false}
                    onValueChange={() => handleSwitchChange(vaccine._id, index)}
                  />
                  <Text style={styles.vaccineText}>{vaccine.vaccineName}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  monthContainer: {
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  vaccineContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaccineText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
});

export default VaccinationLog;
