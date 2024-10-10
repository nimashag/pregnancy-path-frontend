import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { useRouter } from 'expo-router';
import axios from 'axios'; 
import config from "../../constants/config";

// Define a TypeScript interface for your vaccine data
interface Vaccine {
  id: string;
  vaccineName: string;
  vaccineDescription: string;
  vaccineImage: string; 
}

const Vacciguide = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [data, setData] = useState<Vaccine[]>([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [filteredData, setFilteredData] = useState<Vaccine[]>([]); 

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://192.168.1.5:3000/vaccine`); //meka maru karapan
      setData(response.data.data); 
      setFilteredData(response.data.data); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  const handleBackPress = () => {
    router.push('/_sitemap'); 
  };

  const renderItem = ({ item }: { item: Vaccine }) => ( 
    <View style={styles.card}>
      <Text style={styles.title}>{item.vaccineName}</Text>
      <Image source={{ uri: item.vaccineImage }} style={styles.image} /> 
      <Text style={styles.description}>{item.vaccineDescription}</Text>
    </View>
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = data.filter(item => 
      item.vaccineName.toLowerCase().includes(query.toLowerCase()) ||
      item.vaccineDescription.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered); 
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput 
          placeholder="Search" 
          style={styles.searchBar} 
          value={searchQuery}
          onChangeText={handleSearch} 
        />
      </View>
      <FlatList
        data={filteredData} 
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 90,
    paddingLeft: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default Vacciguide;
