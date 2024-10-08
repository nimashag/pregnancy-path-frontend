// PregnantJournalScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Memory {
  _id: string;
  name: string;
  description: string;
  time: string;
  date?: string;
  image?: string;
}

const PregnantJournalScreen: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch memories from the backend
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch("http://192.168.1.8:3000/memory", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch memories");
        }

        const data = await response.json();
        setMemories(data.data); // Assuming the data is inside the data field
        setLoading(false);
      } catch (error) {
        console.error("Error fetching memories:", error);
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);


  // const renderItem = ({
  //   item,
  // }: {
  //   item: Memory
  // }) => (
  //   <View style={styles.entryContainer}>
  //     <View>
  //       <Text className="text-lg font-semibold">{item.name}</Text>
  //       <Text className="text-gray-500">{item.time}</Text>
  //       {item.date && <Text style={styles.dateText}>{item.date}</Text>}
  //     </View>
  //     {item.image && (
  //       <Image
  //         source={{ uri: data:image/jpeg;base64,${item.image} }} // Embedding base64 image
  //         style={styles.imageStyle}
  //       />
  //     )}
  //     <TouchableOpacity>
  //       <FontAwesome name="star-o" size={20} color="black" />
  //     </TouchableOpacity>
  //   </View>
  // );

  // if (loading) {
  //   return (
  //     <View style={styles.loaderContainer}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  const renderItem = ({ item }: { item: Memory }) => {
    // Construct the full URL to the image
    const imageUrl = item.image ? `http://192.168.1.8:3000/uploads/${item.image}` : null;
  
    return (
      <View style={styles.entryContainer}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ color: '#757575' }}>{item.time}</Text>
          {item.date && <Text style={styles.dateText}>{item.date}</Text>}
        </View>
  
        {/* Displaying image */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }} // Using the full image URL
            style={styles.imageStyle}
          />
        )}
        
        <TouchableOpacity>
          <FontAwesome name="star-o" size={20} color="black" />
        </TouchableOpacity>
      </View>
    );

    // if (loading) {
    // return (
    //   <View style={styles.loaderContainer}>
    //     <ActivityIndicator size="large" color="#0000ff" />
    //   </View>
    // );
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Header Section */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity>
          <Text className="text-xl text-purple-950 font-bold">{"<"}</Text>
        </TouchableOpacity>
        <Text className="text-2xl text-center text-purple-950 font-bold">
          Pregnant Journal
        </Text>
        <View />
      </View>

      {/* Journal Type Selection */}
      <View className="flex-row justify-around  rounded-lg shadow p-2 mb-4">
        <TouchableOpacity className="flex-1 py-2 rounded-lg bg-gray-300 ">
          <Text className="text-center text-black font-semibold">
            Daily Journal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 py-2 rounded-lg bg-black">
          <Text className="text-center text-white font-semibold">
            Memory Lane
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Input and Sort Button */}
      <View className="flex-row justify-between items-center mb-4">
          <TextInput
            style={styles.input}
            placeholder="DD / MM / YYYY"
            placeholderTextColor="#AFAFAF"
            className="flex-1 p-2 bg-white rounded-lg"
          />
          <TouchableOpacity style={styles.sortButton}>
            <Text className="text-black font-semibold">Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-2 rounded-lg ml-2">
            <Text className="text-black font-semibold">+ Add Post</Text>
          </TouchableOpacity>

      </View>

      {/* Journal Entries List */}
      <FlatList
        data={memories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={{ flexGrow: 1 }} // Allow FlatList to grow and take available space
      />
    </View>
  );
};

const styles = StyleSheet.create({
  entryContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: width - 32, // Adjusting for padding
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  listContainer: {
    paddingBottom: 100, // Space for bottom navigation or any other UI elements

  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Adjust margin as needed
    position: 'relative', // Set to relative positioning
  },
  input: {
    borderWidth: 1,
    borderColor: '#AFAFAF',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: '#FFFFFF', // Ensure the background is white
    flex: 1, // Take full width
  },
  sortButton: {
    marginLeft: 8, // Space between input and button
    backgroundColor: '#E5E5E5', // Button background color
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    color: "#757575",
  },
  dateText: {
    color: "#757575",
  },
});

export default PregnantJournalScreen;

