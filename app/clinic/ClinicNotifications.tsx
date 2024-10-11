import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ListRenderItem,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, Stack } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import clinicScheduleType from "@/types/clinicScheduleType";
import axios from "axios";
import config from "@/constants/config";

const ClinicNotifications = () => {
  const headerHeight = useHeaderHeight();
  const [todaySchedules, setTodaySchedules] = useState<clinicScheduleType[]>(
    []
  );
  const [tomorrowSchedules, setTomorrowSchedules] = useState<
    clinicScheduleType[]
  >([]);

  useEffect(() => {
    try {
      const setSchedules = async () => {
        const id = "66dd6bf95be4a8cf0d58bf1f";
        const response = await axios.get(
          `${config.backend_url}/clinic-schedule/upcoming-clinic-schedule/${id}`
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todaySchedulesTemp: clinicScheduleType[] = [];
        const tomorrowSchedulesTemp: clinicScheduleType[] = [];

        response.data.forEach((item: clinicScheduleType) => {
          const scheduleDate = new Date(item.date);
          scheduleDate.setHours(0, 0, 0, 0);

          if (scheduleDate.getTime() === today.getTime()) {
            todaySchedulesTemp.push(item);
            console.log(todaySchedulesTemp);
          } else if (scheduleDate.getTime() === tomorrow.getTime()) {
            tomorrowSchedulesTemp.push(item);
            console.log(tomorrowSchedulesTemp);
          }
        });

        setTodaySchedules(todaySchedulesTemp);
        setTomorrowSchedules(tomorrowSchedulesTemp);
      };

      setSchedules();
    } catch (error) {
      console.log(error);
    }
  }, []);


  const viewSchedule = (id: string) => {
    try {
        router.push(`/clinic/ViewClinicSchedule/${id}`);
    } catch (error) {
        console.log(error);
    }
    
  }

  const renderTodayItems: ListRenderItem<clinicScheduleType> = ({
    item,
    index,
  }) => {
    return (
      <TouchableOpacity
        className="flex-row bg-pink-200 p-4 items-center justify-between rounded-lg mx-5 mt-10"
        key={index}
        onPress={() => viewSchedule(item._id)}
      >
        <Image
          className="w-10 h-10"
          source={require("../../assets/images/Clinic/clinicNotification.png")}
        />

        <View className="justify-center">
          <Text className="font-light text-base text-center">
            {item.clinic.clinicTitle}
          </Text>
          <View className="pt-3 items-center space-y-3">
            <View className="flex-row items-center space-x-0.5">
              <Ionicons name="time-outline" size={24} color="black" />
              <Text className="font-light text-base">{item.time}</Text>
            </View>
            <View className="flex-row items-center space-x-0.5">
              <Ionicons name="location-outline" size={24} color="black" />
              <Text className="font-light text-base">{item.location}</Text>
            </View>
          </View>
        </View>

        <Ionicons
          name="chevron-forward-circle-outline"
          size={40}
          color="black"
        />
      </TouchableOpacity>
    );
  };

  const renderTomorrowItems: ListRenderItem<clinicScheduleType> = ({
    item,
    index,
  }) => {
    return (
        
      <TouchableOpacity
        className="flex-row bg-blue-200 p-4 items-center justify-between rounded-lg mx-5 mt-10"
        key={index}
        onPress={() => viewSchedule(item._id)}
      >
        <Image
          className="w-10 h-10"
          source={require("../../assets/images/Clinic/clinicNotification.png")}
        />

        <View className="justify-center">
          <Text className="font-light text-base text-center">
            {item.clinic.clinicTitle}
          </Text>
          <View className="pt-3 items-center space-y-3">
            <View className="flex-row items-center space-x-0.5">
              <Ionicons name="time-outline" size={24} color="black" />
              <Text className="font-light text-base">{item.time}</Text>
            </View>
            <View className="flex-row items-center space-x-0.5">
              <Ionicons name="location-outline" size={24} color="black" />
              <Text className="font-light text-base">{item.location}</Text>
            </View>
          </View>
        </View>

        <Ionicons
          name="chevron-forward-circle-outline"
          size={40}
          color="black"
        />
      </TouchableOpacity>
      
    );
  };

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "Clinic Notifications",
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

      <View style={{ paddingTop: headerHeight }}>
        <ScrollView className="my-4">
          <Text className="font-bold text-xl ml-4">Today</Text>
          <View>
            <ScrollView className="mt-4">
              <FlatList
                data={todaySchedules}
                renderItem={renderTodayItems}
                showsVerticalScrollIndicator={false}
              />
            </ScrollView>
          </View>

          <Text
            className="font-bold text-xl ml-4"
            style={{ paddingTop: headerHeight }}
          >
            Tomorrow
          </Text>
          <View>
            <ScrollView>
              <FlatList
                data={tomorrowSchedules}
                renderItem={renderTomorrowItems}
                showsVerticalScrollIndicator={false}
              />
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ClinicNotifications;
