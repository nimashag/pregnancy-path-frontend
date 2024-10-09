import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { useRouter } from 'expo-router';

const vacciguide = () => {

  const navigation = useNavigation();
  const router = useRouter();

  const data = [
    {
      id: '1',
      title: 'RSV Vaccine',
      description:
        'Respiratory Syncytial Virus (RSV) can cause severe respiratory illness in newborns and young infants. The newly recommended RSV vaccine during the third trimester aims to protect the baby during the vulnerable first few months of life.',
      image: require('../../assets/images/vaccination/rsvvacci.png'), 
    },
    {
      id: '2',
      title: 'Meningococcal Vaccine',
      description:
        'The Meningococcal Vaccine protects against meningococcal disease, which can cause serious infections like meningitis and septicemia (blood poisoning).',
      image: require('../../assets/images/vaccination/meninvacci.png'),
    },
    {
      id: '3',
      title: 'Tdap Vaccine',
      description:
        'Pertussis, or whooping cough, is highly contagious for newborns, who are at high risk of severe complications. The Tdap vaccine given during pregnancy allows the mother to pass protective antibodies to the baby.',
      image: require('../../assets/images/vaccination/tdapvacci.png'),
    },
    {
      id: '4',
      title: 'Influenza Vaccine',
      description:
        'Pregnant women are at a higher risk of severe illness from the flu, which can lead to complications such as pneumonia. The flu vaccine helps protect against these risks by reducing the likelihood of severe flu-related complications.',
      image: require('../../assets/images/vaccination/influenzavacci.png'),
    },
    {
        id: '5',
        title: 'COVID-19 Vaccine',
        description: 'The COVID-19 vaccine is safe for pregnant individuals and is recommended to protect against severe illness, complications, and transmission of the virus to newborns. Vaccination can help ensure the health of both the mother and the baby.',
        image: require('../../assets/images/vaccination/covid19vacci.png'),
    },
    {
        id: '6',
        title: 'Hepatitis A Vaccine',
        description: 'The Hepatitis A vaccine is recommended for pregnant individuals at risk of exposure, such as those traveling to areas where the virus is common. It helps protect against liver infection caused by the Hepatitis A virus.',
        image: require('../../assets/images/vaccination/hepatitisavacci.png'),
    },
    {
        id: '7',
        title: 'Hepatitis B Vaccine',
        description: 'The Hepatitis B vaccine is safe during pregnancy and is recommended for those who are at risk of infection. It protects against liver disease caused by the Hepatitis B virus, which can have severe implications for both the mother and baby.',
        image: require('../../assets/images/vaccination/hepatitisbvacci.png'),
    },
    {
        id: '8',
        title: 'HPV Vaccine',
        description: 'The HPV vaccine is not recommended during pregnancy; however, it is important for women to be vaccinated before becoming pregnant to protect against human papillomavirus, which can lead to cervical cancer and other health issues.',
        image: require('../../assets/images/vaccination/hpvvacci.png'),
    },
    {
        id: '9',
        title: 'MMR Vaccine',
        description: 'The MMR vaccine, which protects against measles, mumps, and rubella, is recommended before pregnancy. It is a live vaccine, and women should ensure vaccination status prior to conceiving to avoid risks to the fetus.',
        image: require('../../assets/images/vaccination/mmrvacci.png'),
    },
    {
        id: '10',
        title: 'PCV (Pneumococcal Conjugate Vaccine)',
        description: 'The PCV is recommended for pregnant individuals at risk for pneumococcal disease. It helps protect against pneumonia, meningitis, and bloodstream infections caused by pneumococcal bacteria.',
        image: require('../../assets/images/vaccination/pcvvacci.png'),
    },
    {
        id: '11',
        title: 'Polio Vaccine',
        description: 'The Inactivated Poliovirus Vaccine (IPV) is safe during pregnancy if there is a risk of exposure. It helps protect against poliomyelitis, a serious disease that can lead to paralysis.',
        image: require('../../assets/images/vaccination/poliovacci.png'),
    },
    {
        id: '12',
        title: 'Varicella Vaccine',
        description: 'The Varicella vaccine, which protects against chickenpox, is a live vaccine and is recommended before pregnancy. Women should be vaccinated if they are not immune to prevent risks to the fetus.',
        image: require('../../assets/images/vaccination/varicellavacci.png'),
    }, 
    {
        id: '13',
        title: 'Zoster Vaccine',
        description: 'The Zoster vaccine is not recommended during pregnancy. It is important for women to be vaccinated before pregnancy to reduce the risk of shingles, which can be painful and cause complications.',
        image: require('../../assets/images/vaccination/zostervacci.png'),
    }      
  ];

  const [searchQuery, setSearchQuery] = useState(''); 
  const [filteredData, setFilteredData] = useState(data);

  const handleBackPress = () => {
    router.push('/_sitemap'); 
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = data.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
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

export default vacciguide;
