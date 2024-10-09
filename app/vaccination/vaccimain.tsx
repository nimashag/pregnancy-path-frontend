import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker'; 
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
  monthNumber: number;
  vaccines: Vaccine[];
};

const VaccinationSchedule = () => {
  const [vaccineData, setVaccineData] = useState<MonthData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(0); 

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await axios.get('http://192.168.1.5:3000/vaccine'); // Replace with your actual API
        const data: Vaccine[] = response.data.data;

        console.log('Fetched Vaccine Data:', data);

        // Organizing data by month
        const organizedData: MonthData[] = Array.from({ length: 9 }, (_, index) => ({
          month: `Month - ${index + 1}`,
          monthNumber: index + 1,
          vaccines: data.filter(vaccine => {
            console.log(`Checking vaccine ${vaccine.vaccineName} for month ${index + 1}`);
            
            // Check if vaccine.vaccineMonth is an array and includes the current month number
            if (Array.isArray(vaccine.vaccineMonth)) {
              const isIncluded = vaccine.vaccineMonth.includes(index + 1);
              console.log(`Is vaccine included? ${isIncluded}`);
              return isIncluded;
            } else {
              console.log('vaccine.vaccineMonth is not an array');
              return false;
            }
          }),
        }));

        console.log('Organized Data by Month:', organizedData);

        setVaccineData(organizedData);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };

    fetchVaccines();
  }, []);

  // Filtered vaccine data based on selected month
  const filteredVaccines = selectedMonth > 0
    ? vaccineData.filter(data => {
        console.log(`Filtering data for month ${selectedMonth}`);
        return data.monthNumber === selectedMonth;
      })
    : vaccineData;

  console.log('Selected Month:', selectedMonth);
  console.log('Filtered Vaccines:', filteredVaccines);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={28} color="#3A3A3A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vaccination Schedule</Text>
        
        {/* Picker for selecting the month */}
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        >
          <Picker.Item label="All Months" value={0} />
          {vaccineData.map((item) => (
            <Picker.Item key={item.monthNumber} label={item.month} value={item.monthNumber} />
          ))}
        </Picker>
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>4th Month</Text>
        <Text style={styles.cardDescription}>
          Taking these vaccinations are recommended for the patient by the doctors and other experts
        </Text>
        <Image 
          source={require('../../assets/images/vaccination/vaccimaina.png')} 
          style={styles.image} 
        />
      </View>

      {/* Vaccines List */}
      {filteredVaccines.length > 0 ? (
        filteredVaccines.map((item) => (
          <View key={item.monthNumber} style={styles.monthContainer}>
            <Text style={styles.monthTitle}>{item.month}</Text>
            {item.vaccines.length > 0 ? (
              item.vaccines.map((vaccine) => (
                <View key={vaccine._id} style={styles.vaccineContainer}>
                  <Text style={styles.vaccineText}>{vaccine.vaccineName}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noVaccinesText}>No vaccines available for this month</Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noVaccinesText}>No vaccines available.</Text>
      )}
      
      {/* Example of additional cards (you can adjust this as per your need) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <TouchableOpacity style={{ flex: 1, marginRight: 10 }}>
          <ImageBackground
            source={require('../../assets/images/vaccination/vaccimain1a.png')}
            style={{
              height: 50,
              borderRadius: 15,
              overflow: 'hidden',
              justifyContent: 'flex-end',
              padding: 16,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, marginLeft: 10 }}>
          <ImageBackground
            source={require('../../assets/images/vaccination/vaccimain2a.png')}
            style={{
              height: 50,
              borderRadius: 15,
              overflow: 'hidden',
              justifyContent: 'flex-end',
              padding: 16,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* Another row of cards */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <TouchableOpacity style={{ flex: 1, marginRight: 10 }}>
          <ImageBackground
            source={require('../../assets/images/vaccination/vaccimain3a.png')}
            style={{
              height: 50,
              borderRadius: 15,
              overflow: 'hidden',
              justifyContent: 'flex-end',
              padding: 16,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, marginLeft: 10 }}>
          <ImageBackground
            source={require('../../assets/images/vaccination/vaccimain4a.png')}
            style={{
              height: 50,
              borderRadius: 15,
              overflow: 'hidden',
              justifyContent: 'flex-end',
              padding: 16,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default VaccinationSchedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 20,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A3A3A',
  },
  picker: {
    width: 150,
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    height: 40, // Adjust height as needed
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  noVaccinesText: {
    color: '#999',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
});
