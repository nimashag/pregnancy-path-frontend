import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const startup2: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Logo or App Title */}
      <Text style={styles.title}>PregnancyPath</Text>

      {/* Vaccination Illustration */}
      <Image
        source={require('../../assets/images/startup/start2.png')} 
        style={styles.image}
      />

      {/* Main Heading */}
      <Text style={styles.heading}>Manage Your Vaccination Plan</Text>

      {/* Description Text */}
      <Text style={styles.description}>
      Never miss an important vaccination for you. With personalized 
      reminders and detailed tracking, our app ensures you stay on top of your vaccination 
      schedule, helping to safeguard your health and your baby's development.
      </Text>

      {/* Next Page Button */}
      <TouchableOpacity style={styles.button}>
        <Link href='/startup/startup3'>
        <Text style={styles.buttonText}>Next Page</Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#EDA51B',
    fontFamily: 'cursive', 
    marginBottom: 40,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#7e7e7e',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#EDA51B',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default startup2;
