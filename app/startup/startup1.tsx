import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const startup1: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Logo or App Title */}
      <Text style={styles.title}>PregnancyPath</Text>

      {/* Vaccination Illustration */}
      <Image
        source={require('../../assets/images/startup/start1.png')} 
        style={styles.image}
      />

      {/* Main Heading */}
      <Text style={styles.heading}>Your Personal Pregnancy Journal</Text>

      {/* Description Text */}
      <Text style={styles.description}>
      Capture every precious moment of your pregnancy journey. 
      From daily feelings and milestones to photos and memories, 
      our journal lets you document your experience, creating a 
      lasting keepsake of this special time.
      </Text>

      {/* Next Page Button */}
      <TouchableOpacity style={styles.button}>
        <Link href='/startup/startup2'>
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
    color: '#B968C7',
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
    backgroundColor: '#B968C7',
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

export default startup1;
