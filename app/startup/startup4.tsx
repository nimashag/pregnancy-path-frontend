import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const startup4: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Logo or App Title */}
      <Text style={styles.title}>PregnancyPath</Text>

      {/* Vaccination Illustration */}
      <Image
        source={require('../../assets/images/startup/start4.png')} 
        style={styles.image}
      />

      {/* Main Heading */}
      <Text style={styles.heading}>Build Healthy Habits</Text>

      {/* Description Text */}
      <Text style={styles.description}>
      Stay healthy throughout your pregnancy by tracking essential daily habits. 
      From hydration to exercise and mindfulness, our habit tracker 
      helps you create and maintain routines that support a balanced and healthier pregnancy.
      </Text>

      {/* Next Page Button */}
      <TouchableOpacity style={styles.button}>
        <Link href='/main/samplehome'>
        <Text style={styles.buttonText}>Get Started</Text>
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
    color: '#36448B',
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
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 100,
    marginBottom: 10,
    backgroundColor: '#36448B',
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

export default startup4;
