import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await AsyncStorage.getItem('profile');
                console.log(profile)
                if (profile) {
                    const userData = JSON.parse(profile);
                    console.log( userData)
                    setUserName(userData.name || '');
                    setEmail(userData.email || '');
                    setPhone(userData.phone || '');
                }
            } catch (error) {
                console.error('Error retrieving user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const updatedProfile = {
                name: userName,
                email: email,
                phone: phone,
            };

            await AsyncStorage.setItem('profile', JSON.stringify(updatedProfile));
            Alert.alert('Success', 'Profile updated successfully!');
            router.push('/'); // Navigate back to the home page after updating
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Could not update profile. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={userName}
                onChangeText={setUserName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                keyboardType="email-address"
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                keyboardType="phone-pad"
                onChangeText={setPhone}
            />

            <TouchableOpacity onPress={handleUpdateProfile} style={styles.button}>
                <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
});

export default Profile;
