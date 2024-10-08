// PregnantJournalScreen.tsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";

// const { width } = Dimensions.get("window");

// interface Memory {
//   _id: string;
//   name: string;
//   description: string;
//   time: string;
//   date?: string;
//   image?: string;
// }

// const PregnantJournalScreen: React.FC = () => {
//   const [memories, setMemories] = useState<Memory[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Fetch memories from the backend
//   useEffect(() => {
//     const fetchMemories = async () => {
//       try {
//         const response = await fetch("http://192.168.1.8:3000/memory", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch memories");
//         }

//         const data = await response.json();
//         setMemories(data.data); // Assuming the data is inside the data field
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching memories:", error);
//         setLoading(false);
//       }
//     };

//     fetchMemories();
//   }, []);


//   // const renderItem = ({
//   //   item,
//   // }: {
//   //   item: Memory
//   // }) => (
//   //   <View style={styles.entryContainer}>
//   //     <View>
//   //       <Text className="text-lg font-semibold">{item.name}</Text>
//   //       <Text className="text-gray-500">{item.time}</Text>
//   //       {item.date && <Text style={styles.dateText}>{item.date}</Text>}
//   //     </View>
//   //     {item.image && (
//   //       <Image
//   //         source={{ uri: data:image/jpeg;base64,${item.image} }} // Embedding base64 image
//   //         style={styles.imageStyle}
//   //       />
//   //     )}
//   //     <TouchableOpacity>
//   //       <FontAwesome name="star-o" size={20} color="black" />
//   //     </TouchableOpacity>
//   //   </View>
//   // );

//   // if (loading) {
//   //   return (
//   //     <View style={styles.loaderContainer}>
//   //       <ActivityIndicator size="large" color="#0000ff" />
//   //     </View>
//   //   );
//   // }

//   const renderItem = ({ item }: { item: Memory }) => {
//     // Construct the full URL to the image
//     const imageUrl = item.image ? `http://192.168.1.8:3000/uploads/${item.image}` : null;
  
//     return (
//       <View style={styles.entryContainer}>
//         <View>
//           <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
//           <Text style={{ color: '#757575' }}>{item.time}</Text>
//           {item.date && <Text style={styles.dateText}>{item.date}</Text>}
//         </View>
  
//         {/* Displaying image */}
//         {imageUrl && (
//           <Image
//             source={{ uri: imageUrl }} // Using the full image URL
//             style={styles.imageStyle}
//           />
//         )}
        
//         <TouchableOpacity>
//           <FontAwesome name="star-o" size={20} color="black" />
//         </TouchableOpacity>
//       </View>
//     );

//     // if (loading) {
//     // return (
//     //   <View style={styles.loaderContainer}>
//     //     <ActivityIndicator size="large" color="#0000ff" />
//     //   </View>
//     // );
//   };

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
//         data={memories}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
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
//   imageStyle: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     marginLeft: 8,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   timeText: {
//     color: "#757575",
//   },
//   dateText: {
//     color: "#757575",
//   },
// });

// export default PregnantJournalScreen;




// import React, { useEffect, useState } from "react";
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
// import { FontAwesome } from "@expo/vector-icons";

// const { width } = Dimensions.get("window");

// const DailyJournal = () => {
//   const [data, setData] = useState([]); // State for journal data
//   const [loading, setLoading] = useState(true); // State for loading
//   const [error, setError] = useState(null); // State for error handling

//   // Fetch journal entries from the backend
//   const fetchJournalEntries = async () => {
//     try {
//       const response = await fetch("http://192.168.1.8:3000/memory"); // Replace with your actual API endpoint
//       if (!response.ok) {
//         throw new Error("Failed to fetch journal entries");
//       }
//       const jsonData = await response.json();
//       setData(jsonData); // Set the fetched data
//       setLoading(false); // Stop loading once data is fetched
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   // Fetch data when the component mounts
//   useEffect(() => {
//     fetchJournalEntries();
//   }, []);

//   const renderItem = ({
//     item,
//   }: {
//     item: { content: string; time: string };
//   }) => (
//     <View style={styles.entryContainer}>
//       <View>
//         <Text className="text-lg font-semibold">{item.name}</Text>
//         <Text className="text-gray-500">{item.time}</Text>
//       </View>
//       <TouchableOpacity>
//         <FontAwesome name="star-o" size={20} color="black" />
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <Text>Error: {error}</Text>
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
//         keyExtractor={(item) => item._id} // Use MongoDB _id as key
//         showsVerticalScrollIndicator={false}
//         ListHeaderComponent={
//           <Text className="text-gray-600 mb-3 mt-2">
//             {data.length > 0 ? data[0].date : ""}
//           </Text>
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
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16, // Adjust margin as needed
//     position: "relative", // Set to relative positioning
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
    width: width - 32,
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
    paddingRight: 70, // Add padding for image space
  },
  entryText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  entryTime: {
    fontSize: 14,
    color: "#555",
  },
  entryImage: {
    position: "absolute", // Absolute position to move the image
    top: 16,
    right: 16,
    width: 50,
    height: 50,
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
