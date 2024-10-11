import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment"; // For formatting date
import config from "../../constants/config";
import { Memory } from "./IMemory"

const { width } = Dimensions.get("window");



interface MemoryResponse {
  data: Memory[]; // API response shape
}

const DailyJournal: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  // Fetch memory data from backend
  useEffect(() => {
    fetchMemories();
  }, []);

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

  // Navigate to JournalEntryDetail screen with selected entry
  const handleJournalEntry = (entry: Memory) => {
    // Navigate to the 'viewmemory' screen and pass the 'entry' data
    router.push({
      pathname: "/journal/viewmemory",  // Ensure the correct path
      params: { entry: JSON.stringify(entry) },  // Pass the entry data as a JSON string
    });
  };

  const toggleFavorite = async (id: string, currentStatus: boolean) => {
    try {
      // Send the update request to the backend
      const response = await fetch(`${config.backend_url}/memory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFavorite: !currentStatus, // Send the opposite of the current status
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
            `Failed to update memory: ${response.status} - ${errorMessage}`
        );
      }

      // Optimistically update local state
      setMemories((prevMemories) =>
          prevMemories.map((memory) =>
              memory._id === id ? { ...memory, isFavorite: !currentStatus } : memory
          )
      );

      // No need to do anything here as the local state is already updated
      console.log("Favorite status updated successfully");
    } catch (error) {
      console.error("Error updating favorite status:", (error as Error).message);
      // Revert the local state if the update fails
      setMemories((prevMemories) =>
          prevMemories.map((memory) =>
              memory._id === id ? { ...memory, isFavorite: currentStatus } : memory
          )
      );
    }
  };

  const renderEntry = ({ item }: { item: Memory }) => (
    <TouchableOpacity onPress={() => handleJournalEntry(item)}>
    <View style={styles.entryContainer}>
      <View style={styles.textContent}>
        <Text style={styles.entryText}>{item.name}</Text>
        <Text style={styles.entryTime}>{item.time}</Text>
      </View>
      {item.image && (
        <Image
          source={{ uri: `${item.image}` }} // Ensure correct URL
          style={styles.entryImage}
        />
      )}
      <TouchableOpacity
          style={styles.starIcon}
          onPress={() => toggleFavorite(item._id, item.isFavorite)} // Toggle favorite on press
      >
        <FontAwesome
            name={item.isFavorite ? "star" : "star-o"}
            size={20}
            color="black"
        />
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
    router.push('/main/samplehome'); 
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
        <TouchableOpacity onPress={handleAddPost} className="bg-white p-2 rounded-lg ml-2 border-2">
          <Text className="text-black font-semibold ">+ Add Post</Text>
        </TouchableOpacity>
      </View>

      {/* Journal Entries List */}
      <FlatList
        data={filteredData}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View>
            <Text className="text-gray-600 mb-3 mt-2">{date}</Text>
            {groupedData[date].map((entry) => (
                <View key={entry._id}>{renderEntry({ item: entry })}</View>
            ))}
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
    paddingRight: width * 0.30, // Add padding for image space
  },
  entryText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: 8,
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
