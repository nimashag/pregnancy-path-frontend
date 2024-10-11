import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const startup3: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Logo or App Title */}
      <Text style={styles.title}>PregnancyPath</Text>

      {/* Vaccination Illustration */}
      <Image
        source={require('../../assets/images/startup/start3.png')} 
        style={styles.image}
      />

      {/* Main Heading */}
      <Text style={styles.heading}>Organize Your Clinic Visits</Text>

      {/* Description Text */}
      <Text style={styles.description}>
      Keep all your clinic appointments in one place. Whether it's 
      regular checkups or specialist visits, you can easily organize, schedule,
       and receive reminders so that you're always prepared and never miss an important date.
      </Text>

      {/* Next Page Button */}
      <TouchableOpacity style={styles.button}>
        <Link href='/startup/startup4'>
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
    color: '#FE725C',
    fontFamily: 'cursive', 
    marginTop: 40,
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
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: '#FE725C',
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

export default startup3;
