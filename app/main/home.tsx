import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                {/* Card 1 */}
                <TouchableOpacity onPress={handleJournalNavigation} style={{ flex: 1, marginRight: 10 }}>
                    <ImageBackground
                        source={require('../../assets/images/main.png')}
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
                        source={require('../../assets/images/tracker.png')}
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

            {/* Full Width Card */}
            <TouchableOpacity onPress={handleGuideNavigation} style={{ marginBottom: 20 }}>
                <ImageBackground
                    source={require('../../assets/images/emergency.png')}
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

            <TouchableOpacity onPress={handleGuideNavigation} style={{ marginBottom: 20 }}>
                <ImageBackground
                    source={require('../../assets/images/blog.png')}
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
}
