import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { checkAuth } from "@/utils/checkAuth";
import { Image } from "react-native";

export default function Index() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authenticate = async () => {
            const token = await checkAuth(); // Wait for token
            if (token) {
                router.replace("/main/home"); // Navigate if token exists
            }
            setIsLoading(false); // Hide loading once authentication check is done
        };
        authenticate();
    }, []);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Image
                    source={require('../assets/gif/loader.gif')}
                    style={{ width: 100, height: 100 }}
                />
            </View>
        );
    }

    const handleLoginRoute = () => {
        router.push("/_sitemap");
    };

    const handleSignupRoute = () => {
        router.push("/_sitemap");
    };

    return (
        <ImageBackground
            source={require('../assets/images/main.png')}
            resizeMode="cover"
            className="flex-1 justify-center"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }} className="p-0">
                <View className="flex-1 justify-end bg-[#ffffffb4] bg-opacity-90 max-h-[350px] rounded-tl-[40px] rounded-tr-[40px] items-center space-y-4 px-8 py-10 shadow-lg">
                    {/* Welcome Text Section */}
                    <View className="items-center">
                        <Text style={{ lineHeight: 20 }} className="text-gray-700 text-xl font-semibold">Welcome to</Text>
                        <Text style={{ lineHeight: 34 }} className="text-gray-900 text-3xl font-bold">PregnancyPath</Text>
                        <Text style={{ lineHeight: 22 }} className="text-gray-600 text-center text-base px-6 mt-2">
                            Fill your pregnancy with knowledge and healthcare guidance.
                        </Text>
                    </View>

                    {/* Login and Signup Buttons */}
                    <TouchableOpacity
                        onPress={handleLoginRoute}
                        className="mt-4 bg-[#D4A373] py-3 w-full max-w-[320px] rounded-full shadow-md"
                    >
                        <Text className="text-center text-lg text-white font-semibold">Sign in with Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSignupRoute}
                        className="mt-2 bg-transparent border border-gray-700 py-3 w-full max-w-[320px] rounded-full"
                    >
                        <Text className="text-center text-lg text-gray-700 font-semibold">Create an Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}
