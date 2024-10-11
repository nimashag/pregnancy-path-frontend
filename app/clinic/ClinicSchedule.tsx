import {
  View,
  Text,
  FlatList,
  TouchableOpacity,  
  ScrollView,
  ListRenderItem,
  Image,
  Linking
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import clinicScheduleType from "../../types/clinicScheduleType";
import { format } from "date-fns";
import config from "../../constants/config"

const CreateClinicSchedule = () => {
  const [schedules, setSchedules] = useState<clinicScheduleType[]>([]);
  const headerHeight = useHeaderHeight();
  const router = useRouter();

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
          `${config.backend_url}/clinic-schedule/upcoming-clinic-schedule/${id}`
        );
        setSchedules(response.data);

        

        response.data.forEach(async(item: clinicScheduleType) => {

          const date = new Date(item.date);
          const today = new Date();

          date.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          if(date < today){
            
            const response =await axios.delete(
              `${config.backend_url}/clinic-schedule/delete-clinic-schedule/${item._id}`

            );

            if(response) {
              console.log("deleted : ",response);
            }

          }
         
        })

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


  const openDialer = () => {
    Linking.openURL('tel:+112');
  };

  const openClinicGuide = () => {
    router.push('/clinic/ClinicGuide');
  };
  
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "Clinic Schedule",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/_sitemap");
              }}
            >
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

      <ScrollView className="">
        <FlatList
          data={schedules}
          renderItem={renderItems}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      {/*Footer*/}
      <View className= "p-3 space-y-1">
        
        <TouchableOpacity className="bg-clinic-guide items-center py-3 w-full rounded-xl" onPress={openClinicGuide}>
          <View className="flex-row items-center space-x-4">
            <Image
              className="w-10 h-10"
              source={require("../../assets/images/Clinic/clinicGuide.png")}
            />
            <View className="">
              <Text className="text-black font-light text-lg">Clinic Guide</Text>
              <Text className="text-gray-500">How to prepare for your vaccinations</Text>
            </View>
            <Ionicons name="chevron-forward-circle-outline" size={40} color="black" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-clinic-assistant items-center py-3 w-full rounded-xl" onPress={openDialer}>
        <View className="flex-row items-center space-x-4">
            <Image
              className="w-10 h-10"
              source={require("../../assets/images/Clinic/clinicAssistant.png")}
            />
            <View className="">
              <Text className="text-black font-light text-lg">Contact Clinic Assistant</Text>
              <Text className="text-gray-500">Contact assistant to shcedule dates</Text>
            </View>
            <Ionicons name="chevron-forward-circle-outline" size={40} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateClinicSchedule;
