import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const samplehome = () => {
    const router = useRouter();

    const handleJournalNavigation = () => {
        // Navigate to Journal Screen
        router.push('/_sitemap');
    };

    const handleTrackerNavigation = () => {
        // Navigate to Tracker Screen
        router.push('/_sitemap');
    };

    const handleGuideNavigation = () => {
        // Navigate to Pregnancy Guide Screen
        router.push('/_sitemap');
    };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.userName}>Jennifer</Text>
        <Image source={require('../../assets/images/home/notificationimg.png')} style={styles.notificationIcon} />
        <Image source={require('../../assets/images/home/userhomeimg.png')} style={styles.profileIcon} />
      </View>

      {/* Baby Status */}
      <View style={styles.statusSection}>
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
      <View style={styles.statusSection}>
        <Text style={styles.statusTitle}>Mom Status</Text>
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

      {/* Full Width Card */}
      <TouchableOpacity onPress={handleGuideNavigation} style={{ marginBottom: 20 }}>
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
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
                        Schedule Your Vaccination
                    </Text>
                    <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 10 }}>
                        Schedule dates for your vaccinations
                    </Text>
                    <TouchableOpacity style={{ backgroundColor: '#8B0000', padding: 8, borderRadius: 5 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Schedule</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </TouchableOpacity>

        {/* Additional sections */}
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
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
                            Save Your Memories With Us
                        </Text>
                        <TouchableOpacity style={{ backgroundColor: '#000', padding: 8, marginTop: 10, borderRadius: 5 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Journal</Text>
                        </TouchableOpacity>
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
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
                            Track Your Daily Habits
                        </Text>
                        <TouchableOpacity style={{ backgroundColor: '#8B0000', padding: 8, marginTop: 10, borderRadius: 5 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Tracker</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </TouchableOpacity>
            </View>

        {/* Clinic Section */}
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
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
                        Clinic Schedule
                        </Text>
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
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
                        Clinic Guide
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>

                {/* Card 3  */}
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
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
                        Contact Assistant
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>


      {/* Yatama Kaaalla */}
      {/* Full Width Card */}
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
                      Parental Appoinments
                    </Text>
                    <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 10 }}>
                      Easily manage your appointments and stay on top of your care.
                    </Text>
                    <TouchableOpacity style={{ backgroundColor: '#8B0000', padding: 8, borderRadius: 5 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Check Now</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGuideNavigation} style={{ marginBottom: 20 }}>
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
                        Pregnancy Guide
                    </Text>
                    <Text style={{ color: '#ffffff', fontSize: 14, marginBottom: 10 }}>
                        Navigate your pregnancy with ease using our comprehensive guide.
                    </Text>
                    <TouchableOpacity style={{ backgroundColor: '#8B0000', padding: 8, borderRadius: 5 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Check Now</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#888',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileIcon: {
    width: 40,
    height: 40,
  },
  notificationIcon: {
    width: 25,
    height: 25,
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
    width: 100,
    height: 100,
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
