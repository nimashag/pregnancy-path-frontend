import { useState } from "react";
import { useRouter } from "expo-router";
import { ImageBackground, TextInput, TouchableOpacity, Text, View, ScrollView, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Import icon library
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        // Validate input fields
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch('http://192.168.43.33:3000/api/auth/signup', { // Replace with your actual endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            console.log('shakaboooom',data)

            const profile = JSON.stringify(data)

            await AsyncStorage.setItem('profile', profile);

            // Navigate to the login page
            router.replace("/auth/login");
        } catch (error) {
            console.error("Signup error:", error);
            Alert.alert("Error", "An error occurred while signing up. Please try again.");
        }
    };

    const handleLoginRoute = () => {
        router.push("/auth/login");
    };

    const handleBack = () => {
        router.back(); // Navigate back to the previous page
    };

    return (
        <ImageBackground
            source={require('../../assets/images/main.png')} // Background image
            resizeMode="cover"
            className="flex-1 justify-center"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end", padding: 16 }}>
                {/* Back Button */}
                <TouchableOpacity onPress={handleBack} className="absolute top-10 left-4 p-2 rounded-full">
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>

                <View className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 mt-20">
                    <Text className="text-2xl font-bold text-center text-gray-800 mb-4">Sign Up</Text>
                    
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Name"
                        className="border border-gray-300 rounded-lg p-3 mb-4"
                    />

                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        className="border border-gray-300 rounded-lg p-3 mb-4"
                        keyboardType="email-address"
                    />
                    
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        className="border border-gray-300 rounded-lg p-3 mb-4"
                        secureTextEntry
                    />

                    <TouchableOpacity
                        onPress={handleSignup}
                        className="bg-[#D4A373] py-3 rounded-full mb-4"
                    >
                        <Text className="text-center text-lg text-white font-semibold">Sign Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLoginRoute}>
                        <Text className="text-center text-gray-600">
                            Already have an account?{" "}
                            <Text className="text-blue-600 font-semibold">Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}
