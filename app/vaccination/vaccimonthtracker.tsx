import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import axios from 'axios';
import { Link } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useNavigation } from 'expo-router';
import config from "../../constants/config";

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
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // Default 0: show all
  
  const router = useRouter();
  const handleBackPress = () => {
    router.back(); 
  };

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await axios.get(`${config.backend_url}/vaccine`); // Replace with your actual API
        const data: Vaccine[] = response.data.data;

        console.log('Fetched Vaccine Data:', data);

        // Organizing data by month
        const organizedData: MonthData[] = Array.from({ length: 9 }, (_, index) => {
          const currentMonthNumber = index + 1;
          const vaccinesForThisMonth = data.filter(vaccine => 
            Array.isArray(vaccine.vaccineMonth) && vaccine.vaccineMonth.includes(currentMonthNumber)
          );

          return {
            month: `Month - ${currentMonthNumber}`,
            monthNumber: currentMonthNumber,
            vaccines: vaccinesForThisMonth,
          };
        });

        setVaccineData(organizedData);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };

    fetchVaccines();
  }, []);

  // Filtered vaccine data based on selected month
  const filteredVaccines = selectedMonth > 0
    ? vaccineData.filter(data => data.monthNumber === selectedMonth)
    : vaccineData;

  return (
    <ScrollView style={styles.container}>

      <View className="flex-row items-center justify-between mb-4 mt-10">
        <TouchableOpacity onPress={handleBackPress} className="ml-4">
        <FontAwesome name="chevron-left" size={24} color="#18113E" />
        </TouchableOpacity>
        <Text className="text-2xl text-center text-indigo-950 font-bold">
          Vaccine Tracker
        </Text>
      <View />
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Vaccinations</Text>
        <Text style={styles.cardDescription}>
          Taking these vaccinations are recommended for the patient by the doctors and other experts
        </Text>
        <Image 
          source={require('../../assets/images/vaccination/vaccimaina.png')} 
          style={styles.image} 
        />
      </View>



      {/* Month Buttons */}
      <Text style={styles.vaccineText}>Select Month</Text>
      <Text style={styles.vaccineText}></Text>
      <View style={styles.buttonContainer}>
        {[...Array(9).keys()].map(month => (
          <TouchableOpacity
            key={month + 1}
            style={[
              styles.monthButton,
              selectedMonth === month + 1 ? styles.activeButton : styles.inactiveButton
            ]}
            onPress={() => setSelectedMonth(month + 1)}
          >
            <Text style={styles.buttonText}>{month + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vaccines List */}
      {filteredVaccines.map(item => (
        <View key={item.monthNumber} style={styles.monthContainer}>
          <Text style={styles.monthTitle}>{item.month}</Text>
          {item.vaccines.length > 0 ? (
            item.vaccines.map(vaccine => (
              <View key={vaccine._id} style={styles.vaccineContainer}>
                <Text style={styles.vaccineText}>{vaccine.vaccineName}</Text>
                <Text style={styles.vaccineText2}>{vaccine.vaccineStatus} Vaccine</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noVaccinesText}>No vaccines available for this month</Text>
          )}
        </View>
      ))}

      {/* Monthly Vaccination Details */}
      <Text style={styles.subHeader}>Set Reminder</Text>
      <TouchableOpacity  style={{ marginBottom: 20 }}>
                <ImageBackground
                    source={require('../../assets/images/vaccination/vaccimonthimg.png')}
                    style={{
                        height: 120,
                        borderRadius: 15,
                        overflow: 'hidden',
                        justifyContent: 'flex-end',
                        padding: 16,
                    }}
                    resizeMode="cover"
                >
                    <Text style={{ color: '#000000', fontSize: 14, marginBottom: 10 , width: '70%'}}>
                    Set an reminder for the dates and time of the schedule the clinic assistant gave!
                    </Text>
                    <TouchableOpacity style={{ backgroundColor: '#0E6EC5', padding: 8, width: '30%', borderRadius: 5 }}>
                    <Link href="/vaccination/createvaccineschedule" style={{ width: '100%' }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' , textAlign: 'center' }}>Create</Text>
                    </Link>
                    </TouchableOpacity>
                    
                </ImageBackground>
            </TouchableOpacity>

    </ScrollView>
  );
};

export default VaccinationSchedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#F14321',
  },
  inactiveButton: {
    backgroundColor: '#1E1E1E',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  monthContainer: {
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 15,
    color: '#000000',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
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
    fontWeight: 'bold',
    color: '#333',
  },
  vaccineText2: {
    fontSize: 12,
    color: '#333',
  },
  noVaccinesText: {
    color: '#999',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
});
