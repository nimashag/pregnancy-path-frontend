import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

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

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await axios.get('http://192.168.1.5:3000/vaccine'); //meka wenas karanna amathaka karanna epa pettiyo
        const data: Vaccine[] = response.data.data;

        // Organizing data by month
        const organizedData: MonthData[] = Array.from({ length: 9 }, (_, index) => ({
          month: `Month - ${index + 1}`,
          vaccines: data.filter(vaccine => vaccine.vaccineMonth.includes(index + 1)),
        }));

        setVaccineData(organizedData);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };

    fetchVaccines();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {vaccineData.map((item, index) => (
        <View key={index} style={styles.monthContainer}>
          <Text style={styles.monthTitle}>{item.month}</Text>
          {item.vaccines.map((vaccine, idx) => (
            <View key={idx} style={styles.vaccineContainer}>
              <Text style={styles.vaccineText}>{vaccine.vaccineName}</Text>
            </View>
          ))}
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
  vaccineText: {
    fontSize: 16,
    color: '#333',
  },
});

export default VaccinationLog;
