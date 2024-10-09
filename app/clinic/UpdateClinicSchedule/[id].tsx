import {View, Text, FlatList, TouchableOpacity, TextInput, ScrollView} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {useHeaderHeight} from "@react-navigation/elements";
import {Picker} from "@react-native-picker/picker";
import axios from "axios";
import ClinicType from "@/types/clinicType";
import moment from 'moment';
import clinicScheduleType from "@/types/clinicScheduleType";

const UpdateClinicSchedule = () => {

    const headerHeight = useHeaderHeight();
    const [clinics, setClinics] = useState<ClinicType[]>([]);
    const { id } = useLocalSearchParams();
  const router = useRouter();

    const [clinic, setClinic] = useState<ClinicType | undefined>(undefined);
    const [previousDate, setPreviousDate] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState(new Date());
    const [dbTime, setDbTime] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [location, setLocation] = useState("");
    //const id = "67060dc91a93bdfab50ea80e"

    useEffect(() => {
        const getSchedule = async () => {
            try {
                const response = await axios.get('http://192.168.8.127:3000/clinic/all-clinic');
                setClinics(response.data);

                console.log(id);
                const schedule: clinicScheduleType = await axios.get(`http://192.168.8.127:3000/clinic-schedule/get-one-clinic-schedule/${id}`)
                setClinic(schedule.data.clinic);
                setPreviousDate(schedule.data.date);
                setDbTime(schedule.data.time);
                setLocation(schedule.data.location);
                console.log(clinic?.clinicTitle)


            } catch (error) {
                console.error(error);
            }
        };
        getSchedule();
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
            const formatted = moment(selectedTime).format('HH.mm'); // Format time
            setDbTime(formatted);
        }
    };

    const handleUpdate = async () => {
        try {
            const response= await axios.put(`http://192.168.8.127:3000/clinic-schedule/update-clinic-schedule/${id}`,{
                clinic,
                date,
                time: dbTime,
                location
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: "Update Clinic Schedule",
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
                                <Text>{date === null ? previousDate : date.toDateString()}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date || new Date()}
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
                                <Text>{dbTime}</Text>
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
                        <TextInput className="bg-white py-4 rounded-lg pl-2" value={location} onChangeText={setLocation}/>
                    </View>
                </View>
            </View>
            {/*Footer*/}
            <View className="absolute bottom-0 mx-4 pb-8 flex-row">
                <TouchableOpacity
                    className="bg-yellow-400 items-center py-5 px-16 rounded-xl flex-grow mr-4"
                    onPress={handleUpdate}
                >
                    <View className="flex-row items-center">
                        <Text className="text-white text-lg uppercase pr-1">update</Text>
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

export default UpdateClinicSchedule;
