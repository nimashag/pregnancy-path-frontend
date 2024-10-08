// DailyJournal.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    content: "Feeling hungry and dizzy",
    time: "08:30 AM",
    date: "20th July 2024",
    image: "https://via.placeholder.com/150", // Example image URL
  },
  {
    id: "2",
    content: "Having breakfast as recommended by the doctors",
    time: "10:00 AM",
    date: "20th July 2024",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    content: "Went on a walk with family and friends",
    time: "12:30 PM",
    date: "20th July 2024",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    content: "First parental appointment and first ultrasound of baby",
    time: "01:30 PM",
    date: "20th July 2024",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "8",
    content: "Feeling hungry and dizzy",
    time: "08:30 AM",
    date: "21st July 2024",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "9",
    content: "Having breakfast as recommended by the doctors",
    time: "10:00 AM",
    date: "21st July 2024",
    image: "https://via.placeholder.com/150",
  },
];

// Function to group data by date
const groupByDate = (entries) => {
  return entries.reduce((acc, entry) => {
    (acc[entry.date] = acc[entry.date] || []).push(entry);
    return acc;
  }, {});
};

const DailyJournal = () => {
  const groupedData = groupByDate(data);
  const renderEntry = ({
    item,
  }: {
    item: { content: string; time: string; image: string };
  }) => (
    <View style={styles.entryContainer}>
      <View style={styles.textContent}>
        <Text style={styles.entryText}>{item.content}</Text>
        <Text style={styles.entryTime}>{item.time}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.entryImage} />
      <TouchableOpacity style={styles.starIcon}>
        <FontAwesome name="star-o" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );

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
      <View className="flex-row justify-around rounded-lg shadow p-2 mb-4">
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
        data={Object.keys(groupedData)}
        keyExtractor={(item) => item}
        renderItem={({ item: date }) => (
          <View>
            <Text className="text-gray-600 mb-3 mt-2">{date}</Text>
            {groupedData[date].map((entry) => renderEntry({ item: entry }))}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={{ flexGrow: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  entryContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 25,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
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
    position: "relative", 
  },
  textContent: {
    flex: 1,
    paddingRight: 70, // Add padding for image space
  },
  entryText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: 8,
  },
  entryTime: {
    fontSize: width * 0.04,
    color: "#555",
  },
  entryImage: {
    position: "absolute", // Absolute position to move the image
    top: 16,
    right: 16,
    width: width * 0.15, // Adjust size based on screen width
    height: width * 0.15,
    borderRadius: 8,
  },
  starIcon: {
    position: "absolute",
    bottom: 5,
    right: 16,
  },
  listContainer: {
    paddingBottom: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: "#AFAFAF",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#000",
    backgroundColor: "#FFFFFF",
    flex: 1,
    fontSize: width * 0.04,
  },
  sortButton: {
    marginLeft: 8,
    backgroundColor: "#E5E5E5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});

export default DailyJournal;

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
// import moment from "moment"; // For formatting date

// const { width } = Dimensions.get("window");

// interface Memory {
//   _id: string;
//   name: string;
//   description: string;
//   time: string;
//   date: string;
//   image?: string;
//   feelings?: string;
// }

// interface MemoryResponse {
//   data: Memory[]; // API response shape
// }

// const DailyJournal: React.FC = () => {
//   const [memories, setMemories] = useState<Memory[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fetch memory data from backend
//   useEffect(() => {
//     const fetchMemories = async (): Promise<void> => {
//       try {
//         const response = await fetch('http://192.168.1.8:3000/memory', {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           const errorMessage = await response.text();
//           throw new Error(`Failed to fetch memories: ${response.status} - ${errorMessage}`);
//         }

//         const data: MemoryResponse = await response.json();
//         setMemories(data.data); // Directly setting the data array
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching memories:", (error as Error).message);
//         setLoading(false);
//       }
//     };

//     fetchMemories();
//   }, []);

//   // Grouping data by date
//   const groupByDate = (entries: Memory[]) => {
//     return entries.reduce((acc, entry) => {
//       const formattedDate = moment(entry.date).format("DD/MM/YYYY");
//       (acc[formattedDate] = acc[formattedDate] || []).push(entry);
//       return acc;
//     }, {} as { [key: string]: Memory[] });
//   };

//   const groupedData = groupByDate(memories);

//   // Filter data based on search query
//   const filteredData = Object.keys(groupedData).filter((date) =>
//     date.includes(searchQuery)
//   );

//   const renderEntry = ({ item }: { item: Memory }) => (
//     <View style={styles.entryContainer}>
//       <View style={styles.textContent}>
//         <Text style={styles.entryText}>{item.name}</Text>
//         {item.feelings && (
//           <Text style={styles.entryFeelings}>Feelings: {item.feelings}</Text>
//         )}
//         <Text style={styles.entryDescription}>{item.description}</Text>
//         <Text style={styles.entryTime}>Time: {item.time}</Text>
//       </View>
//       {item.image && (
//         <Image
//           source={{ uri: `http://192.168.1.8:3000${item.image}` }} // Ensure correct URL
//           style={styles.entryImage}
//         />
//       )}
//       <TouchableOpacity style={styles.starIcon}>
//         <FontAwesome name="star-o" size={20} color="black" />
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-100 p-4">
//       {/* Header Section */}
//       <View className="flex-row items-center justify-between mb-4">
//         <TouchableOpacity>
//           <Text className="text-xl text-purple-950 font-bold">{"<"}</Text>
//         </TouchableOpacity>
//         <Text className="text-2xl text-center text-purple-950 font-bold">
//           Pregnant Journal
//         </Text>
//         <View />
//       </View>

//       {/* Journal Type Selection */}
//       <View className="flex-row justify-around rounded-lg shadow p-2 mb-4">
//         <TouchableOpacity className="flex-1 py-2 rounded-lg bg-gray-300 ">
//           <Text className="text-center text-black font-semibold">
//             Daily Journal
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity className="flex-1 py-2 rounded-lg bg-black">
//           <Text className="text-center text-white font-semibold">
//             Memory Lane
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Date Input and Sort Button */}
//       <View className="flex-row justify-between items-center mb-4">
//         <TextInput
//           style={styles.input}
//           placeholder="DD / MM / YYYY"
//           placeholderTextColor="#AFAFAF"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           className="flex-1 p-2 bg-white rounded-lg"
//         />
//         <TouchableOpacity style={styles.sortButton}>
//           <Text className="text-black font-semibold">Sort</Text>
//         </TouchableOpacity>
//         <TouchableOpacity className="bg-white p-2 rounded-lg ml-2">
//           <Text className="text-black font-semibold">+ Add Post</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Journal Entries List */}
//       <FlatList
//         data={filteredData}
//         keyExtractor={(item) => item}
//         renderItem={({ item: date }) => (
//           <View>
//             <Text className="text-gray-600 mb-3 mt-2">{date}</Text>
//             {groupedData[date].map((entry) => renderEntry({ item: entry }))}
//           </View>
//         )}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContainer}
//         style={{ flexGrow: 1 }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   entryContainer: {
//     backgroundColor: "white",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e5e5",
//     paddingVertical: 25,
//     paddingHorizontal: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//     width: "100%",
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     position: "relative",
//   },
//   textContent: {
//     flex: 1,
//     paddingRight: 70, // Add padding for image space
//   },
//   entryText: {
//     fontSize: width * 0.045,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   entryFeelings: {
//     fontSize: width * 0.04,
//     color: "#888",
//   },
//   entryDescription: {
//     fontSize: width * 0.04,
//     color: "#555",
//     marginBottom: 4,
//   },
//   entryTime: {
//     fontSize: width * 0.04,
//     color: "#555",
//   },
//   entryImage: {
//     position: "absolute",
//     top: 16,
//     right: 16,
//     width: width * 0.15,
//     height: width * 0.15,
//     borderRadius: 8,
//   },
//   starIcon: {
//     position: "absolute",
//     bottom: 5,
//     right: 16,
//   },
//   listContainer: {
//     paddingBottom: 100,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#AFAFAF",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     color: "#000",
//     backgroundColor: "#FFFFFF",
//     flex: 1,
//     fontSize: width * 0.04,
//   },
//   sortButton: {
//     marginLeft: 8,
//     backgroundColor: "#E5E5E5",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default DailyJournal;
