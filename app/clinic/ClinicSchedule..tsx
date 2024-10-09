import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ListRenderItem,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import clinicScheduleType from "../../types/clinicScheduleType";
import { format } from "date-fns";

const CreateClinicSchedule = () => {
  const [schedules, setSchedules] = useState<clinicScheduleType[]>([]);
  const headerHeight = useHeaderHeight();

  const imageMap = {
    "ParentalCheck.jpg": require("../../assets/images/Clinic/ParentalCheck.jpg"),
    "Ultrasound&Imaging.jpg": require("../../assets/images/Clinic/Ultrasound&Imaging.jpg"),
    "NutritionandWellnessCounseling.jpg": require("../../assets/images/Clinic/NutritionandWellnessCounseling.jpg"),
    "ChildbirthPreparationClasses.jpg": require("../../assets/images/Clinic/ChildbirthPreparationClasses.jpg"),
  };

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const id = "66dd6bf95be4a8cf0d58bf1f";
        const response = await axios.get(
          `http://192.168.8.127:3000/clinic-schedule/upcoming-clinic-schedule/${id}`
        );
        setSchedules(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClinics();
  }, []);

  const renderItems: ListRenderItem<clinicScheduleType> = ({ item, index }) => {
    return (
      <Link href={`/clinic/ViewClinicSchedule/${item._id}`} asChild>
        <TouchableOpacity>
          <View className="bg-white m-6 p-3 rounded-lg">
            <Text className="text-base font-semibold">
              Schedule {index + 1} - {item.clinic.clinicTitle}
            </Text>
            <View>
              <View className="flex-row items-center">
                {imageMap[item.clinic.clinicImage] ? (
                  <Image
                    source={imageMap[item.clinic.clinicImage]} // Access the mapped image
                    className="w-36 h-36 rounded-lg mx-auto"
                  />
                ) : (
                  <Text>Image not found</Text>
                )}
                <View className="w-36 h-36">
                  <Text className="font-semibold text-gray-400 text-base">
                    Date
                  </Text>
                  <Text>{format(new Date(item.date), "PPPP")}</Text>
                  <Text className="font-semibold text-gray-400 text-base">
                    Time
                  </Text>
                  <Text>{item.time}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "Clinic Schedule",
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

      <View className="" style={{ paddingTop: headerHeight }}>
        <Text className="font-semibold text-base p-3 pl-6">
          Preferred Clinic
        </Text>
        <View className="bg-white rounded-lg mx-6 py-5">
          <Text className="pl-3 font-semibold text-base">
            Choices Pregnancy Center
          </Text>
        </View>
      </View>
      <Text className="font-bold text-base py-4 pl-6 ">
        Clinic Appointments for this month
      </Text>

      <ScrollView style={{ flex: 1 }}>
        <FlatList
          data={schedules}
          renderItem={renderItems}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      {/*Footer*/}
      <View className="absolute bottom-0 px-4 p-8 flex-row bg-white">
        <TouchableOpacity className="bg-green-600 items-center py-5 px-16 rounded-xl flex-grow mr-4">
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
