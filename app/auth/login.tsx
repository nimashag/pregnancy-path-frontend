import { useState } from "react";
import { useRouter } from "expo-router";
import { ImageBackground, TextInput, TouchableOpacity, Text, View, ScrollView, Alert } from "react-native";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }
        try {
            const response = await fetch('http://192.168.43.33:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            const profile = JSON.stringify(data);
            await AsyncStorage.setItem('profile', profile);
            router.replace("/main/samplehome");
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Error", "An error occurred while logging in. Please try again.");
        }
    };

    const handleSignupRoute = () => {
        router.push("/auth/signup");
    };

    const handleBack = () => {
        router.back(); // Go back to the previous page
    };

    return (
        <ImageBackground
            source={require('../../assets/images/main.png')} // Background image
            resizeMode="cover"
            className="flex-1 justify-center"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end", padding: 16 }}>
                <TouchableOpacity
                    onPress={handleBack}
                    className="absolute top-12 left-4 bg-transparent p-2 rounded-full shadow-md"
                >
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>

                <View className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8">
                    <Text className="text-2xl font-bold text-center text-gray-800 mb-4">Login</Text>
                    
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
                        onPress={handleLogin}
                        className="bg-[#D4A373] py-3 rounded-full mb-4"
                    >
                        <Text className="text-center text-lg text-white font-semibold">Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSignupRoute}>
                        <Text className="text-center text-gray-600">
                            Don't have an account?{" "}
                            <Text className="text-blue-600 font-semibold">Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}
