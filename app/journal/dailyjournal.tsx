import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/Ionicons'; 
import moment from "moment"; // For formatting date
import config from "../../constants/config";

const { width } = Dimensions.get("window");

interface Memory {
  _id: string;
  name: string;
  description: string;
  time: string;
  date: string;
  image?: string;
  feelings?: string;
}

interface MemoryResponse {
  data: Memory[]; // API response shape
}

const DailyJournal: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const navigation = useNavigation();

  // Fetch memory data from backend
  useEffect(() => {
    const fetchMemories = async (): Promise<void> => {
      try {
        const response = await fetch(`${config.backend_url}/memory?userId=66dd6bf95be4a8cf0d58bf1f`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);
        console.log(response);

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(
            `Failed to fetch memories: ${response.status} - ${errorMessage}`
          );
        }

        const data: MemoryResponse = await response.json();
        setMemories(data.data); // Directly setting the data array
        setLoading(false);
      } catch (error) {
        console.error("Error fetching memories:", (error as Error).message);
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  // Grouping data by date
  const groupByDate = (entries: Memory[]) => {
    return entries.reduce((acc, entry) => {
      const formattedDate = moment(entry.date).format("DD/MM/YYYY");
      (acc[formattedDate] = acc[formattedDate] || []).push(entry);
      return acc;
    }, {} as { [key: string]: Memory[] });
  };

  const groupedData = groupByDate(memories);

  // Filter data based on search query
  const filteredData = Object.keys(groupedData).filter((date) =>
    date.includes(searchQuery)
  );

  // Delete function
  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`${config.backend_url}/memory/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Failed to delete entry: ${response.status} - ${errorMessage}`
        );
      }

      // Update the state to remove the deleted entry
      setMemories((prevMemories) =>
        prevMemories.filter((entry) => entry._id !== id)
      );
    } catch (error) {
      console.error("Error deleting entry:", (error as Error).message);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => deleteEntry(id) },
    ]);
  };

  // Navigate to JournalEntryDetail screen with selected entry
  const handleJournalEntry = (entry: Memory) => {
    // Navigate to the 'viewmemory' screen and pass the 'entry' data
    router.push({
      pathname: "/journal/viewmemory",  // Ensure the correct path
      params: { entry: JSON.stringify(entry) },  // Pass the entry data as a JSON string
    });
  };

  const renderEntry = ({ item }: { item: Memory }) => (
    <TouchableOpacity onPress={() => handleJournalEntry(item)}>
    <View style={styles.entryContainer}>
      <View style={styles.textContent}>
        <Text style={styles.entryText}>{item.name}</Text>
        {/* {item.feelings && (
          <Text style={styles.entryFeelings}>Feelings: {item.feelings}</Text>
        )}
        <Text style={styles.entryDescription}>{item.description}</Text> */}
        <Text style={styles.entryTime}>{item.time}</Text>
      </View>
      {item.image && (
        <Image
          source={{ uri: `${item.image}` }} // Ensure correct URL
          style={styles.entryImage}
        />
      )}
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        <FontAwesome name="trash" size={20} color="red" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.starIcon}>
        <FontAwesome name="star-o" size={20} color="black" />
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  const handleAddPost = () => {
    router.push("/journal/creatememory");
  };

  const handleBackPress = () => {
    router.push('/_sitemap'); 
  };

  const handlefavourites = () => {
    router.push("/journal/favourites");
  };

  return (
    <View className="flex-1 bg-gray-100 p-4 ">
      {/* Header Section */}
      <View className="flex-row items-center justify-between mb-4 mt-8">
        <TouchableOpacity onPress={handleBackPress} className="ml-2">
        <FontAwesome name="chevron-left" size={24} color="#18113E" />
        </TouchableOpacity>
        <Text className="text-2xl text-center text-indigo-950 font-bold">
          Pregnant Journal
        </Text>
        <View />
      </View>

      {/* Journal Type Selection */}
      <View className="flex-row justify-around rounded-lg shadow p-2 mb-4">
        <TouchableOpacity className="flex-1 py-3  bg-black rounded-l-lg ">
          <Text className="text-center text-white font-semibold">
            Daily Journal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlefavourites} className="flex-1 py-3 rounded-r-lg bg-gray-300">
          <Text className="text-center text-black font-semibold">
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
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1  bg-white rounded-lg"
        />
        {/* <TouchableOpacity style={styles.sortButton}>
          <Text className="text-black font-semibold">Sort</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleAddPost} className="bg-white p-2 rounded-lg ml-2 border-2">
          <Text className="text-black font-semibold ">+ Add Post</Text>
        </TouchableOpacity>
      </View>

      {/* Journal Entries List */}
      <FlatList
        data={filteredData}
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
    paddingVertical: 35,
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
  entryFeelings: {
    fontSize: width * 0.04,
    color: "#888",
  },
  entryDescription: {
    fontSize: width * 0.04,
    color: "#555",
    marginBottom: 4,
  },
  entryTime: {
    fontSize: width * 0.04,
    color: "#555",
    top: 30,
  },
  entryImage: {
    position: "absolute",
    top: 16,
    right: 16,
    width: width * 0.25,
    height: width * 0.15,
    borderRadius: 8,
  },
  starIcon: {
    position: "absolute",
    bottom: 5,
    right: 16,
  },
  deleteButton: {
    position: "absolute",
    bottom: 5,
    right: 60,
  },
  listContainer: {
    paddingBottom: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: "#AFAFAF",
    borderRadius: 8,
    paddingHorizontal: 20,
    color: "#000",
    backgroundColor: "#FFFFFF",
    flex: 1,
    fontSize: width * 0.04,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DailyJournal;
