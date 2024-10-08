// PregnantJournalScreen.tsx
// import React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";

// const { width } = Dimensions.get("window");

// const data = [
//   {
//     id: "1",
//     content: "Feeling hungry and dizzy",
//     time: "08:30 AM",
//     date: "20th July 2024",
//   },
//   {
//     id: "2",
//     content: "Having breakfast as recommended by the doctors",
//     time: "10:00 AM",
//   },
//   {
//     id: "3",
//     content: "Went on a walk with family and friends",
//     time: "12:30 PM",
//   },
//   {
//     id: "4",
//     content: "First parental appointment and first ultrasound of baby",
//     time: "01:30 PM",
//   },
//   { id: "5", content: "Head back home", time: "04:00 PM" },
//   {
//     id: "6",
//     content:
//       "Having a party with the family and getting the stuff ready for it",
//     time: "07:30 PM",
//   },
//   { id: "7", content: "Going to sleep", time: "10:30 PM" },
//   {
//     id: "8",
//     content: "Feeling hungry and dizzy",
//     time: "08:30 AM",
//     date: "21st July 2024",
//   },
//   {
//     id: "9",
//     content: "Having breakfast as recommended by the doctors",
//     time: "10:00 AM",
//   },
// ];

// const PregnantJournalScreen = () => {
//   const renderItem = ({
//     item,
//   }: {
//     item: { content: string; time: string };
//   }) => (
//     <View style={styles.entryContainer}>
//       <View>
//         <Text className="text-lg font-semibold">{item.content}</Text>
//         <Text className="text-gray-500">{item.time}</Text>
//       </View>
//       <TouchableOpacity>
//         <FontAwesome name="star-o" size={20} color="black" />
//       </TouchableOpacity>
//     </View>
//   );

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
//       <View className="flex-row justify-around  rounded-lg shadow p-2 mb-4">
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
//           <TextInput
//             style={styles.input}
//             placeholder="DD / MM / YYYY"
//             placeholderTextColor="#AFAFAF"
//             className="flex-1 p-2 bg-white rounded-lg"
//           />
//           <TouchableOpacity style={styles.sortButton}>
//             <Text className="text-black font-semibold">Sort</Text>
//           </TouchableOpacity>
//           <TouchableOpacity className="bg-white p-2 rounded-lg ml-2">
//             <Text className="text-black font-semibold">+ Add Post</Text>
//           </TouchableOpacity>

//       </View>

//       {/* Journal Entries List */}
//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         ListHeaderComponent={
//           <Text className="text-gray-600 mb-3 mt-2">{data[0].date}</Text>
//         }
//         contentContainerStyle={styles.listContainer}
//         style={{ flexGrow: 1 }} // Allow FlatList to grow and take available space
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   entryContainer: {
//     backgroundColor: "white",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e5e5",
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//     width: width - 32, // Adjusting for padding
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

//   },
//   listContainer: {
//     paddingBottom: 100, // Space for bottom navigation or any other UI elements

//   },
//   datePickerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16, // Adjust margin as needed
//     position: 'relative', // Set to relative positioning
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#AFAFAF',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     color: '#000',
//     backgroundColor: '#FFFFFF', // Ensure the background is white
//     flex: 1, // Take full width
//   },
//   sortButton: {
//     marginLeft: 8, // Space between input and button
//     backgroundColor: '#E5E5E5', // Button background color
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
// });

// export default PregnantJournalScreen;

// DailyJournal.tsx
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import axios from "axios";
// import { FontAwesome } from "@expo/vector-icons";

// const { width } = Dimensions.get("window");

// const DailyJournal = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch data from backend
//   const fetchData = async () => {
//     try {
//       const response = await fetch("http://192.168.1.8:3000/memory");
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const jsonData = await response.json();
//       setData(jsonData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Fetch error:", error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   // UseEffect to fetch data on component mount
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Render each journal entry
//   const renderItem = ({
//     item,
//   }: {
//     item: { name: string; time: string; date: string };
//   }) => (
//     <View style={styles.entryContainer}>
//       <View>
//         <Text className="text-lg font-semibold">{item.name}</Text>
//         <Text className="text-gray-500">{item.time}</Text>
//         <Text className="text-gray-500">
//           {new Date(item.date).toDateString()}
//         </Text>{" "}
//         {/* Display formatted date */}
//       </View>
//       <TouchableOpacity>
//         <FontAwesome name="star-o" size={20} color="black" />
//       </TouchableOpacity>
//     </View>
//   );

//   // Display loading indicator while fetching data
//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   // Handle error state
//   if (error) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <Text>Error fetching data. Please try again later.</Text>
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
//       <View className="flex-row justify-around  rounded-lg shadow p-2 mb-4">
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
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item) => item._id} // Assuming the _id is the unique identifier in MongoDB
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContainer}
//         style={{ flexGrow: 1 }} // Allow FlatList to grow and take available space
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   entryContainer: {
//     backgroundColor: "white",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e5e5",
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//     width: width - 32, // Adjusting for padding
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
//   },
//   listContainer: {
//     paddingBottom: 100, // Space for bottom navigation or any other UI elements
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#AFAFAF",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     color: "#000",
//     backgroundColor: "#FFFFFF", // Ensure the background is white
//     flex: 1, // Take full width
//   },
//   sortButton: {
//     marginLeft: 8, // Space between input and button
//     backgroundColor: "#E5E5E5", // Button background color
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
// });

// export default DailyJournal;
