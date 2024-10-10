import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import { Href, Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import axios from "axios";
import clinicScheduleType from "@/types/clinicScheduleType";
import moment from "moment/moment";

const ViewClinicSchedule = () => {
  const headerHeight = useHeaderHeight();
  const [schedule, setSchedule] = useState<clinicScheduleType | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  //const id = "67060dc91a93bdfab50ea80e";

  useEffect(() => {
    const getSchedule = async () => {
      try {
        const response = await axios.get(
          `http://192.168.8.127:3000/clinic-schedule/get-one-clinic-schedule/${id}`
        );
        setSchedule(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSchedule();
  }, []);

  const imageMap = {
    "ParentalCheck.jpg": require("../../../assets/images/Clinic/ParentalCheck.jpg"),
    "Ultrasound&Imaging.jpg": require("../../../assets/images/Clinic/Ultrasound&Imaging.jpg"),
    "NutritionandWellnessCounseling.jpg": require("../../../assets/images/Clinic/NutritionandWellnessCounseling.jpg"),
    "ChildbirthPreparationClasses.jpg": require("../../../assets/images/Clinic/ChildbirthPreparationClasses.jpg"),
  };

  const handleDelete = async () => {
  try {
    const response = await axios.delete(
      `http://192.168.8.127:3000/clinic-schedule/delete-clinic-schedule/${id}`
    );

    if (response) {
      Alert.alert("Success", "Schedule deleted successfully");
      router.push("/clinic/ClinicSchedule");
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <View>
                <Ionicons name="chevron-back-outline" size={24} color="black" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white border h-52 px-5 justify-center items-center rounded-lg">
              <Text className="font-semibold text-base text-center py-5">
                Are you sure you want to delete
              </Text>
              <View className="flex-row space-x-4">
                <TouchableOpacity className="bg-red-600 py-2.5 w-28 rounded-lg items-center justify-center" onPress={handleDelete}> 
                  <Text className="text-white font-semibold">Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity className="border py-2.5 w-28 rounded-lg items-center justify-center" onPress={() => setModalVisible(!modalVisible)}>
                  <Text className="font-semibold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View>
        <ScrollView>
          {/* Check if schedule and schedule.clinic exist */}
          {schedule && schedule.clinic && (
            <View>
              {imageMap[schedule.clinic.clinicImage] ? (
                <Image
                  source={imageMap[schedule.clinic.clinicImage]}
                  className="w-full h-80 rounded-lg mx-auto"
                />
              ) : (
                <Text>Image not found</Text>
              )}
              <Text className="font-bold text-2xl p-3 mb-2">
                {schedule.clinic.clinicTitle}
              </Text>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-row justify-between p-2 mx-5">
                  <View className="flex-row bg-white py-2.5 w-44 items-center justify-center gap-2 rounded-lg ">
                    <View className="bg-pink-200 py-2.5 px-2.5 rounded-lg">
                      <Ionicons
                        name="calendar-outline"
                        size={24}
                        color="black"
                      />
                    </View>
                    <Text className="font-semibold text-base">
                      {moment(schedule.date).format("YYYY-MM-DD")}
                    </Text>
                  </View>
                  <View className="flex-row bg-white py-2.5 w-44 items-center justify-center gap-2 rounded-lg ">
                    <View className="bg-pink-200 py-2.5 px-2.5 rounded-lg">
                      <Ionicons name="time-outline" size={24} color="black" />
                    </View>
                    <Text className="font-semibold text-base">
                      {schedule.time}
                    </Text>
                  </View>
                </View>
                <View className="flex-row bg-white py-2.5 items-center justify-center gap-2 rounded-lg mt-3 mx-6 ">
                  <View className="bg-pink-200 py-2.5 px-2.5 rounded-lg">
                    <Ionicons name="location-outline" size={24} color="black" />
                  </View>
                  <Text className="font-semibold text-base">
                    {schedule.location}
                  </Text>
                </View>

                <Text className="ml-6 my-4 font-semibold text-xl">
                  Description
                </Text>
                <View className="bg-white rounded-lg p-4 mx-6">
                  <Text className="font-medium text-base">
                    {schedule.clinic.clinicDescription}
                  </Text>
                </View>

                <Text className="ml-6 my-4 font-semibold text-xl">
                  How To Prepare For Your Clinic
                </Text>
                <View className="bg-white rounded-lg p-4 mx-6 mb-3">
                  {schedule.clinic.preparationInfo.map((item) => (
                    <View className="flex-row items-center gap-2">
                      <Ionicons
                        name="radio-button-on-outline"
                        size={24}
                        color="black"
                      />
                      <Text className="font-medium text-base">{item}</Text>
                    </View>
                  ))}
                </View>
                <View>
                  <Link
                    href={`/clinic/UpdateClinicSchedule/${schedule._id}`}
                    asChild
                  >
                    <TouchableOpacity className="py-3 bg-yellow-400 mx-5 mb-3 items-center justify-center rounded-lg">
                      <Text className="text-base">Update</Text>
                    </TouchableOpacity>
                  </Link>
                  <TouchableOpacity
                    className="py-3 bg-red-600 mx-5 mb-3 items-center justify-center rounded-lg"
                    onPress={() => setModalVisible(true)}
                  >
                    <Text className="text-base">Delete</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ViewClinicSchedule;
