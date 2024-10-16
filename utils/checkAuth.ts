import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkAuth = async () => {
    try {
        const token = await AsyncStorage.getItem('profile');
        return token;
    } catch (error) {
        console.error("Error reading token:", error);
        return null;
    }
};
