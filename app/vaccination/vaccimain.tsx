import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView,ImageBackground } from 'react-native';

const vaccimain = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Monthly Vaccination Details */}
      <Text style={styles.subHeader}>Monthly Vaccination Details</Text>
      <TouchableOpacity  style={{ marginBottom: 20 }}>
                <ImageBackground
                    source={require('../../assets/images/vaccination/vaccitrackernavi.png')}
                    style={{
                        height: 120,
                        borderRadius: 15,
                        overflow: 'hidden',
                        justifyContent: 'flex-end',
                        padding: 16,
                    }}
                    resizeMode="cover"
                >
                    <Text style={{ color: '#000000', fontSize: 14, marginBottom: 10, width: '68%' }}>
                    Get information about what vaccinations you have to get monthly and keep track.
                    </Text>
                    <TouchableOpacity style={{ backgroundColor: '#F88C8C', padding: 8, width: '30%', borderRadius: 5 }}>
                    <Link href="/vaccination/vaccimonthtracker" style={{ width: '100%' }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' , textAlign: 'center' }}>Tracker</Text>
                    </Link>
                    </TouchableOpacity>
                    
                </ImageBackground>
            </TouchableOpacity>

      {/* Vaccination Scheduling */}
      <Text style={styles.subHeader}>Vaccination Scheduling</Text>
      <Text></Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                {/* Card 1 */}
                <TouchableOpacity  style={{ flex: 1, marginRight: 10 }}>
                    <ImageBackground
                        source={require('../../assets/images/vaccination/vaccicard1.png')}
                        style={{
                            height: 200,
                            borderRadius: 15,
                            overflow: 'hidden',
                            justifyContent: 'flex-start',
                            padding: 16,
                        }}
                        resizeMode="cover"
                    >
                      <View style={{ flex: 1,  alignItems: 'center' }}>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 , }}>
                        Reserved
                        </Text>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 , }}>
                        Schedules
                        </Text>
                        <TouchableOpacity style={{ backgroundColor: '#0F3062', padding: 8, width: '100%', marginTop: 10, borderRadius: 5 }}>
                          <Link href='/vaccination/viewvaccineschedule' style={{ width: '100%' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' , textAlign: 'center' }}>View</Text>
                          </Link>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                </TouchableOpacity>

                {/* Card 2 */}
                <TouchableOpacity  style={{ flex: 1, marginLeft: 10 }}>
                    <ImageBackground
                        source={require('../../assets/images/vaccination/vaccicard2.png')}
                        style={{
                            height: 200,
                            borderRadius: 15,
                            overflow: 'hidden',
                            justifyContent: 'flex-start',
                            padding: 16,
                        }}
                        resizeMode="cover"
                    >
                      <View style={{ flex: 1,  alignItems: 'center' }}>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>
                        Add New
                        </Text>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>
                        Schedule
                        </Text>
                        <TouchableOpacity style={{ backgroundColor: '#5C0D0D', padding: 8, width: '100%', marginTop: 10, borderRadius: 5 }}>
                          <Link href="/vaccination/createvaccineschedule" style={{ width: '100%' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Create</Text>
                          </Link>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                </TouchableOpacity>
            </View>

      {/* What To Know About Vaccines */}
      <Text style={styles.subHeader}>What To Know About Vaccines</Text>
      <Text></Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                {/* Card 1 */}
                <TouchableOpacity  style={{ flex: 1, marginRight: 10 }}>
                    <ImageBackground
                        source={require('../../assets/images/vaccination/vaccicard3.png')}
                        style={{
                            height: 200,
                            borderRadius: 15,
                            overflow: 'hidden',
                            justifyContent: 'flex-start',
                            padding: 16,
                        }}
                        resizeMode="cover"
                    >
                      <View style={{ flex: 1,  alignItems: 'center' }}>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>
                        Vaccination
                        </Text>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>
                        Guide
                        </Text>
                        <TouchableOpacity style={{ backgroundColor: '#6D0A11', padding: 8, marginTop: 10, width: '100%', borderRadius: 5 }}>
                          <Link href="/vaccination/vacciguide" style={{ width: '100%' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' , textAlign: 'center'}}>Guide</Text>
                          </Link>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                </TouchableOpacity>

                {/* Card 2 */}
                <TouchableOpacity  style={{ flex: 1, marginLeft: 10 }}>
                    <ImageBackground
                        source={require('../../assets/images/vaccination/vaccicard6.png')}
                        style={{
                            height: 200,
                            borderRadius: 15,
                            overflow: 'hidden',
                            justifyContent: 'flex-start',
                            padding: 16,
                        }}
                        resizeMode="cover"
                    >
                      <View style={{ flex: 1,  alignItems: 'center' }}>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>
                        Vaccination
                        </Text>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>
                        Log
                        </Text>
                        <TouchableOpacity style={{ backgroundColor: '#000', padding: 8, width: '100%', marginTop: 10, borderRadius: 5 }}>
                          <Link href="/vaccination/vaccilog" style={{ width: '100%' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Log</Text>
                           </Link>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#282828',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 15,
    color: '#000000',
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#E76F51',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default vaccimain;
