import {View, Text, FlatList, TouchableOpacity, TextInput, ScrollView} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {Stack} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {useHeaderHeight} from "@react-navigation/elements";
import {Picker} from "@react-native-picker/picker";
import axios from "axios";
import ClinicType from "@/types/clinicType";

const CreateClinicSchedule = () => {

    const headerHeight = useHeaderHeight();
    const [clinics, setClinics] = useState<ClinicType[]>([]);

    const [user, setUser] = useState("");
    const [clinic, setClinic] = useState<ClinicType | undefined>(undefined);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [location, setLocation] = useState("");

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                setUser('66dd6bf95be4a8cf0d58bf1f')
                const response = await axios.get('http://192.168.8.127:3000/clinic/all-clinic');
                setClinics(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchClinics();
    }, []);

    const onDateChange = (event: any, selectedDate?: Date | undefined) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const onTimeChange = (event: any, selectedTime: Date | undefined) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setTime(selectedTime);
        }
    };
    const handleAdd = async () => {
        try {
            const response= await axios.post('http://192.168.8.127:3000/clinic-schedule/create-clinic-schedule',{
                user,
                clinic,
                date,
                time,
                location
            })

            console.log('Schedule created successfully:', response.data);

            console.log(time);

        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: "Add Clinic Schedule",
                    headerTitleAlign: "center",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => {}}>
                            <View>
                                <Ionicons name="chevron-back-outline" size={24} color="black" />
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={{paddingTop: headerHeight }}>

                {/*select clinic*/}
                <View className="p-4 mx-4">
                    <Text className="font-semibold text-base pb-3">Select the Clinic</Text>
                    <View className="bg-white rounded-lg">
                        <Picker
                            selectedValue={clinic}
                            onValueChange={(itemValue) => setClinic(itemValue)}
                        >
                            {clinics.map((clinic) => (
                                <Picker.Item label={clinic.clinicTitle} value={clinic} />
                            ))}
                        </Picker>
                    </View>


                {/*select date*/}
                <View className="pt-5">
                    <Text className="font-semibold text-base pb-3">Select the Date</Text>
                    <View className="bg-white py-4 rounded-lg">
                        <TouchableOpacity
                            className="pl-3"
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>
                </View>

                {/*select time*/}
                <View className="pt-5">
                    <Text className="font-semibold text-base pb-3">Select the Time</Text>
                    <View className="bg-white py-4 rounded-lg">
                        <TouchableOpacity
                            className="pl-3"
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text>{time.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}</Text>
                        </TouchableOpacity>
                        {showTimePicker && (
                            <DateTimePicker
                                value={time}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}
                            />
                        )}
                    </View>
                </View>

                <View className="pt-5">
                    <Text className="font-semibold text-base pb-3">Location</Text>
                    <TextInput className="bg-white py-4 rounded-lg pl-2"  placeholder="Enter event name here..." value={location} onChangeText={setLocation}/>
                </View>
            </View>
            </View>
            {/*Footer*/}
            <View className="absolute bottom-0 mx-4 pb-8 flex-row">
                <TouchableOpacity
                    className="bg-green-600 items-center py-5 px-16 rounded-xl flex-grow mr-4"
                    onPress={handleAdd}
                >
                    <View className="flex-row items-center">
                        <Text className="text-white text-lg uppercase pr-1">Add</Text>
                        <Ionicons name="add-circle-outline" size={20} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-red-700 items-center p-5 px-8 rounded-xl"
                    onPress={() => {}}
                >
                    <Text className="text-white text-lg uppercase">Cancel</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
};

export default CreateClinicSchedule;