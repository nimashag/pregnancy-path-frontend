import {View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, ListRenderItem, Image} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import ClinicType from '../../types/clinicType';
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {useHeaderHeight} from "@react-navigation/elements";
import config from "@/constants/config";


const CreateClinicSchedule = () => {
    const [clinics, setClinics] = useState<ClinicType[]>([]);
    const [search, setSearch] = useState<string | null>(null);
    const [filteredClinics, setFilteredClinics] = useState<ClinicType[]>([]);
    const [loading, setLoading] = useState(true);
    const headerHeight = useHeaderHeight();
    const router = useRouter();

    const imageMap = {
        'ParentalCheck.jpg' :  require('../../assets/images/Clinic/ParentalCheck.jpg'),
        'Ultrasound&Imaging.jpg' : require('../../assets/images/Clinic/Ultrasound&Imaging.jpg'),
        'NutritionandWellnessCounseling.jpg' : require('../../assets/images/Clinic/NutritionandWellnessCounseling.jpg'),
        'ChildbirthPreparationClasses.jpg' : require('../../assets/images/Clinic/ChildbirthPreparationClasses.jpg'),
    }

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await axios.get(`${config.backend_url}/clinic/all-clinic`);
                setClinics(response.data);
                

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchClinics();
    }, []);


    useEffect(() => {
        try {
            if (search === null) {
                setFilteredClinics(clinics);
            } else {
                const filtered = clinics.filter(clinic =>
                    clinic.clinicTitle.toLowerCase().includes(search.toLowerCase())
                );
                setFilteredClinics(filtered);
            }
        } catch (error) {
            console.log(error);
        }
    },[clinics, search]);

    const renderItems: ListRenderItem<ClinicType> = ({item}) => {
        return (
            <TouchableOpacity>
                <View className="bg-white m-6 p-3 rounded-lg">
                    <Text className="text-xl font-semibold pb-3 p-2">{item.clinicTitle}</Text>
                    {imageMap[item.clinicImage] ? (
                        <Image
                            source={imageMap[item.clinicImage]}  // Access the mapped image
                            className="w-80 h-36 rounded-lg mx-auto"
                        />
                    ) : (
                        <Text>Image not found</Text>
                    )}
                    <Text className="font-light text-sm p-2" >Description</Text>
                    <Text className="font-semibold p-2">{item.clinicDescription}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: "Clinic Guide",
                    headerTitleAlign: "center",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => {router.back();}}>
                            <View>
                                <Ionicons name="chevron-back-outline" size={24} color="black" />
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />


            {/* search */}
            <View className="flex-row justify-between mx-4 py-4" style={{paddingTop: headerHeight }}>
                <TouchableOpacity onPress={() => router.push('/clinic/ClinicNotifications')}>
                    <Ionicons name="notifications" size={36} color="black"/>
                </TouchableOpacity>
                <View className="flex-row border items-center rounded-3xl w-56 justify-between px-6">
                    <TextInput placeholder="Search" value={search} onChangeText={setSearch}/>
                    <Ionicons name="search" size={28} color="black" />
                </View>
            </View>

            <ScrollView>
                <FlatList data={filteredClinics} renderItem={renderItems} showsVerticalScrollIndicator={false} />
            </ScrollView>

        </View>
    );
};

export default CreateClinicSchedule;
