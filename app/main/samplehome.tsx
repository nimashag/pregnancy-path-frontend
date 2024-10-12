import React, { useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Link, useRouter } from 'expo-router';

const samplehome = () => {
  
    const router = useRouter();

    const handleVacciNavigation = () => {
      // Navigate to Vaccination Screen
      router.push('/vaccination/vaccimain');
    };

    const handleJournalNavigation = () => {
        // Navigate to Journal Screen
        router.push('/journal/dailyjournal');
    };

    const handleTrackerNavigation = () => {
        // Navigate to Tracker Screen
        router.push('/tracker/HealthTracker');
    };

    const handleGuideNavigation = () => {
        // Navigate to Pregnancy Guide Screen
        router.push('/tracker/HabitTracker');
    };
    const handleGMoodNavigation = () => {
        // Navigate to Pregnancy Guide Screen
        router.push('/moodTracker/Moods');
    };

    const handleProfileNavigation = () => {
      // Navigate to Profile Screen
      router.push('/main/profile'); // Update this to the correct path for your profile screen
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.userName}>user</Text>
      </View>
      <View style={styles.iconContainer}>
        <Link href='/notification/NotificationPage' >
        <Image source={require('../../assets/images/home/notificationimg.png')} style={styles.notificationIcon} />
        </Link>
        <TouchableOpacity onPress={handleProfileNavigation}>
        <Image  source={require('../../assets/images/home/userhomeimg.png')} style={styles.profileIcon} />
        </TouchableOpacity>
        </View>
        
    </View>


      {/* Baby Status */}
      <View>
        <Text style={styles.statusTitle}>Baby Status</Text>
        <Text style={styles.statusDate}>12 October 2024, 12th Week</Text>
        <View style={styles.babyStatus}>
          <Image source={require('../../assets/images/home/babyhomeimg.png')} style={styles.babyImage} />
          <View style={styles.babyInfo}>
            <Text style={styles.babyDays}>50 Days Pregnant</Text>
            <Text style={styles.daysBeforeDelivery}>254 Days Before Delivery</Text>
          </View>
        </View>
      </View>

      {/* Mom Status */}
      <View>
      <Text style={styles.subHeader}>Mom Status</Text>
        <View style={styles.momStatus}>
          <View style={styles.statusItem}>
            <Image source={require('../../assets/images/home/scaleimg.png')} style={styles.icon} />
            <Text>72kg</Text>
          </View>
          <View style={styles.statusItem}>
            <Image source={require('../../assets/images/home/babyimg.png')} style={styles.icon} />
            <Text>Cycle Day 5</Text>
          </View>
          <View style={styles.statusItem}>
            <Image source={require('../../assets/images/home/moodimg.png')} style={styles.icon} />
            <Text>Happy</Text>
          </View>
        </View>
      </View>

      {/* Vaccination section */}
      <Text style={styles.subHeader}>Vaccination Details</Text>
      <TouchableOpacity style={{ marginBottom: 20 }}>
                <ImageBackground
                    source={require('../../assets/images/home/vaccished.png')}
                    style={{
                        height: 120,
                        borderRadius: 15,
                        overflow: 'hidden',
                        justifyContent: 'flex-end',
                        padding: 16,
                    }}
                    resizeMode="cover"
                >
                    <Text style={{ color: '#ffffff', fontSize: 14, width: '60%', marginBottom: 8}}>
                    Access all essential information about your vaccinations to stay on top of your health.
                    </Text>
                    <TouchableOpacity onPress={handleVacciNavigation} style={{ backgroundColor: '#F88C8C', padding: 8, borderRadius: 5 ,  width: '40%'}}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Access</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </TouchableOpacity>

        {/* Journal section */}
        <Text style={styles.subHeader}>Journal & Tracker</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                {/* Card 1 */}
                <TouchableOpacity onPress={handleJournalNavigation} style={{ flex: 1, marginRight: 10 }}>
                    <ImageBackground
                        source={require('../../assets/images/journalimg.png')}
                        style={{
                            height: 200,
                            borderRadius: 15,
                            overflow: 'hidden',
                            justifyContent: 'flex-end',
                            padding: 16,
                        }}
                        resizeMode="cover"
                    >   
                        <View style={{ flex: 1,  alignItems: 'center' }}>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 , }}>
                          Save Your
                        </Text>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 , }}>
                          Memories
                        </Text>
                        <TouchableOpacity style={{ backgroundColor: '#000000', padding: 8, width: '100%', marginTop: 10, borderRadius: 5 }}>
                          <Link href='/journal/dailyjournal' style={{ width: '100%' }}> 
                            <Text style={{ color: '#fff', fontWeight: 'bold' , textAlign: 'center' }}>Journal</Text>
                          </Link>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                </TouchableOpacity>

                {/* Card 2 */}
                <TouchableOpacity onPress={handleTrackerNavigation} style={{ flex: 1, marginLeft: 10 }}>
                    <ImageBackground
                        source={require('../../assets/images/trackerimg.png')}
                        style={{
                            height: 200,
                            borderRadius: 15,
                            overflow: 'hidden',
                            justifyContent: 'flex-end',
                            padding: 16,
                        }}
                        resizeMode="cover"
                    >
                        <View style={{ flex: 1,  alignItems: 'center' }}>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 , }}>
                        Track Your 
                        </Text>
                        <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 , }}>
                        Daily Health
                        </Text>
                        <TouchableOpacity style={{ backgroundColor: '#5C0D0D', padding: 8, width: '100%', marginTop: 10, borderRadius: 5 }}>
                          <Link href='/' style={{ width: '100%' }}> 
                            <Text style={{ color: '#fff', fontWeight: 'bold' , textAlign: 'center' }}>Tracker</Text>
                          </Link>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                </TouchableOpacity>
            </View>

        {/* Clinic Section */}
        <Text style={styles.subHeader}>Clinical Information</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                {/* Card 1 */}
                <TouchableOpacity onPress={() => router.push('/clinic/ClinicSchedule')} style={{ flex: 1, marginRight: 10 }}>
                    <ImageBackground
                        source={require('../../assets/images/home/clinic1.png')}
                        style={{
                            height: 200,
                            borderRadius: 15,
                            overflow: 'hidden',
                            justifyContent: 'flex-end',
                            padding: 16,
                        }}
                        resizeMode="cover"
                    >
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
                        Clinic Schedule
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>

                {/* Card 2 */}
                <TouchableOpacity onPress={() => router.push('/clinic/ClinicGuide')} style={{ flex: 1, marginLeft: 10 }}>
                    <ImageBackground
                        source={require('../../assets/images/home/clinic2.png')}
                        style={{
                            height: 200,
                            borderRadius: 15,
                            overflow: 'hidden',
                            justifyContent: 'flex-end',
                            padding: 16,
                        }}
                        resizeMode="cover"
                    >
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
                        Clinic Guide
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>

                {/* Card 3  */}
                <TouchableOpacity onPress={handleTrackerNavigation} style={{ flex: 1, marginLeft: 10 }}>
                    <ImageBackground
                        source={require('../../assets/images/home/clinic3.png')}
                        style={{
                            height: 200,
                            borderRadius: 15,
                            overflow: 'hidden',
                            justifyContent: 'flex-end',
                            padding: 16,
                        }}
                        resizeMode="cover"
                    >
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
                        Contact Assistant
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>


      {/* Yatama Kaaalla */}
      {/* Full Width Card */}
      <Text style={styles.subHeader}>Other Services</Text>
      <TouchableOpacity onPress={handleGuideNavigation} style={{ marginBottom: 20 }}>
                <ImageBackground
                    source={require('../../assets/images/emergency1.png')}
                    style={{
                        height: 120,
                        borderRadius: 15,
                        overflow: 'hidden',
                        justifyContent: 'flex-end',
                        padding: 16,
                    }}
                    resizeMode="cover"
                >
                    <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>
                      Habit tracker
                    </Text>
                    <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 10 }}>
                        Dtrack any habit you want
                    </Text>
                    <TouchableOpacity style={{ backgroundColor: '#1C476F', padding: 8, borderRadius: 5 , width: '40%'}}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>Check Now</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGMoodNavigation} style={{ marginBottom: 20 }}>
                <ImageBackground
                    source={require('../../assets/images/blog1.png')}
                    style={{
                        height: 120,
                        borderRadius: 15,
                        overflow: 'hidden',
                        justifyContent: 'flex-end',
                        padding: 16,
                    }}
                    resizeMode="cover"
                >
                    <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>
                        Mood Tracker
                    </Text>
                    <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 10 }}>
                        Have Track on your mood swing.
                    </Text>
                    <TouchableOpacity style={{ backgroundColor: '#641E1F', padding: 8, borderRadius: 5 , width: '40%'}}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' , textAlign: 'center'}}>Check Now</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',  
    alignItems: 'center', 
    padding: 10,  
    marginBottom: 20
  },
  textContainer: {
    flexDirection: 'column',  
  },
  welcomeText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  notificationIcon: {
    width: 24, 
    height: 24,
    marginRight: 10, 
  },
  profileIcon: {
    width: 50,  
    height: 50,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 15,
    color: '#000000',
  },
  statusSection: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusDate: {
    color: '#888',
    marginBottom: 10,
  },
  babyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  babyImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
    marginTop:10,
    borderRadius: 30
  },
  babyInfo: {
    marginLeft: 20,
  },
  babyDays: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  daysBeforeDelivery: {
    color: '#888',
  },
  momStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
  ctaButton: {
    backgroundColor: '#ff7f50',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  ctaText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  additionalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  sectionItem: {
    flex: 1,
    marginHorizontal: 10,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  clinicalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  clinicalItem: {
    flex: 1,
    marginHorizontal: 10,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  footerButton: {
    margin: 10,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 10,
  },
});

export default samplehome;
