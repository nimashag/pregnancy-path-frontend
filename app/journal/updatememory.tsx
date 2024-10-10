import React, { useState, useEffect } from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
    Alert,
    Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import config from "../../constants/config";
import {Memory} from "@/app/journal/IMemory";

interface JournalEntryDetailProps {
    route: {
        params: {
            entry: {
                name: string;
                description: string;
                time: string;
                date: string;
                image?: string;  // base64 image
                feelings?: string;
                emotionLevel?: number;  // Emotional intensity (1-10)
            };
        };
    };
}
const UpdateMemoryScreen: React.FC<JournalEntryDetailProps> = () => {
    const { entry } = useLocalSearchParams();
    const parsedEntry: Memory = JSON.parse(entry as string);

    const [eventName, setEventName] = useState(parsedEntry.name);
    const [eventDescription, setEventDescription] = useState(parsedEntry.description);
    const [selectedFeeling, setSelectedFeeling] = useState(parsedEntry.feelings);
    const [eventTime, setEventTime] = useState(parsedEntry.time);
    const [eventDate, setEventDate] = useState(new Date(parsedEntry.date));
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | undefined>(parsedEntry.image || "");

    const router = useRouter();

    const onTimeChange = (event: any, selectedTime: Date | undefined) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setEventTime(selectedTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }));
        }
    };

    const onDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setEventDate(selectedDate);
        }
    };

    // Function to pick an image from the gallery
    const pickImageAsync = async () => {
        let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (result.granted === false) {
            alert("Permission to access gallery is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setSelectedImage(pickerResult.assets[0].uri);
        } else {
            alert("You did not select any image.");
        }
    };

    // Convert image URI to Base64 (for mobile platforms only)
    const convertToBase64 = async (uri: string) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return `data:image/jpeg;base64,${base64}`; // Prepend the base64 string with this prefix
        } catch (error) {
            console.error("Error converting to Base64:", error);
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!eventName || !eventDescription || !selectedFeeling) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        let base64Image;

        // Check if the platform is web; if not, convert to Base64
        if (selectedImage && Platform.OS !== "web") {
            if (selectedImage.startsWith("data:image/")) {
                base64Image = selectedImage; // Use the image directly if it's already in Base64
            } else {
                base64Image = await convertToBase64(selectedImage);
                if (!base64Image) {
                    console.log("Failed to convert image to Base64");
                    return;
                }
            }
        } else {
            base64Image = selectedImage; // On web, use the selected image URI directly
        }

        try {
            const response = await fetch(`${config.backend_url}/memory/${parsedEntry._id}`, { // Use memory ID for update
                method: "PUT", // Use PUT for updating
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: base64Image || null,
                    name: eventName,
                    description: eventDescription,
                    feelings: selectedFeeling,
                    time: eventTime,
                    date: eventDate.toISOString(),
                }),
            });

            if (response.status === 200) {
                Alert.alert("Success", "Memory updated successfully!");
                router.push("/journal/dailyjournal"); // Navigate back to the journal
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update memory. Please try again.");
        }
    };

    const handleCancel = () => {
        router.push("/journal/dailyjournal");
    };

    function convertToJSDate(timeString: string) {
        // Create a new Date object representing the current day (ignores time)
        const date = new Date();

        // Split the timeString into its components (hour, minute, AM/PM)
        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        // Convert 12-hour format to 24-hour format based on AM/PM
        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        } else if (modifier === 'AM' && hours === 12) {
            hours = 0; // midnight case
        }

        // Set the time on the date object
        date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

        return date;
    }


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerText}>Update Memory</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter event name here..."
                value={eventName}
                onChangeText={setEventName}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter event description here..."
                value={eventDescription}
                onChangeText={setEventDescription}
                multiline={true}
            />

            <Text style={styles.label}>Add a Picture</Text>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImageAsync}>
                {selectedImage ? (
                    <Image source={{ uri: selectedImage }} style={styles.image} />
                ) : (
                    <Image
                        source={require("../../assets/images/addpicture.png")}
                        style={styles.image}
                    />
                )}
                <FontAwesome
                    name="camera"
                    size={24}
                    color="#18113E"
                    style={styles.icon}
                />
            </TouchableOpacity>

            <Text style={styles.label}>What are you feeling</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedFeeling}
                    onValueChange={(itemValue) => setSelectedFeeling(itemValue)}
                >
                    <Picker.Item label="Select one" value="" />
                    <Picker.Item label="Joyful & Fun" value="Joyful & Fun" />
                    <Picker.Item label="Happy & Excited" value="Happy & Excited" />
                    <Picker.Item label="Calm" value="Calm" />
                </Picker>
            </View>

            <View style={styles.timeDateContainer}>
                <View style={styles.timeContainer}>
                    <Text style={styles.label}>Enter Time</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={eventTime}
                        value={eventTime}
                        onChangeText={setEventTime}
                    />
                </View>

                <View style={styles.dateContainer}>
                    <Text style={styles.label}>Enter Date</Text>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text>{eventDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={eventDate}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 30,
        backgroundColor: "#F3F4F6",
        minHeight: "100%",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#18113E",
        marginBottom: 16,
        marginTop: 40,
    },
    label: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        borderColor: "#D1D5DB",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    descriptionInput: {
        height: 128,
    },
    imageContainer: {
        position: "relative",
        marginBottom: 16,
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 8,
    },
    icon: {
        position: "absolute",
        bottom: 10,
        right: 10,
    },
    pickerContainer: {
        borderColor: "#D1D5DB",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
    },
    timeDateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    timeContainer: {
        width: "48%",
    },
    dateContainer: {
        width: "48%",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: "#CC1616",
        borderColor: "#D1D5DB",
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        marginRight: 8,
        alignItems: "center",
    },
    submitButton: {
        backgroundColor: "#18113E",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default UpdateMemoryScreen;
