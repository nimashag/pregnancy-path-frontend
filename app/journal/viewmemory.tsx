import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; // Icons for time, date, and feelings
import { Chip } from "react-native-paper"; // Chips for feelings and a progress bar for emotions
import config from "../../constants/config";
import { Memory } from "@/app/journal/IMemory";

const { width } = Dimensions.get("window");

interface JournalEntryDetailProps {
  route: {
    params: {
      entry: {
        name: string;
        description: string;
        time: string;
        date: string;
        image?: string; // base64 image
        feelings?: string;
        emotionLevel?: number; // Emotional intensity (1-10)
      };
    };
  };
}

const JournalEntryDetail: React.FC<JournalEntryDetailProps> = () => {
  const { entry } = useLocalSearchParams();
  const parsedEntry: Memory = JSON.parse(entry as string);
  const router = useRouter();

  // Function to delete the entry
  const deleteEntry = async (entryId: string) => {
    try {
      const response = await fetch(`${config.backend_url}/memory/${entryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Failed to delete entry: ${response.status} - ${errorMessage}`
        );
      }

      // Optionally navigate back or show a success message
      Alert.alert("Success", "Entry deleted successfully", [
        {
          text: "OK",
          onPress: () => {
            router.push("/journal/dailyjournal"); // Navigate back to daily journal
          },
        },
      ]);
    } catch (error) {
      console.error("Error deleting entry:", (error as Error).message);
    }
  };

  const confirmDelete = (entryId: string) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => deleteEntry(entryId) },
    ]);
  };

  // Function to format the date to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEdit = () => {
    router.push({
      pathname: "/journal/updatememory",
      params: { entry }, // Pass the memory object to the update screen
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header section with title */}
      
      <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <FontAwesome name="chevron-left" size={24} color="#18113E" />
      </TouchableOpacity>
        <Text style={styles.headerTitle}>Memory Details</Text>
      </View>

      <View style={styles.card}>
        {parsedEntry.image && (
          <Image
            source={{ uri: `${parsedEntry.image}` }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{parsedEntry.name}</Text>

          <View style={styles.metadata}>
            <View style={styles.metaItem}>
              <MaterialIcons name="date-range" size={20} color="#6a7fdb" />
              <Text style={styles.date}>{formatDate(parsedEntry.date)}</Text>
            </View>
            <View style={styles.metaItem}>
              <FontAwesome name="clock-o" size={20} color="#6a7fdb" />
              <Text style={styles.time}>{parsedEntry.time}</Text>
            </View>
          </View>

          <Text style={styles.description}>{parsedEntry.description}</Text>

          {parsedEntry.feelings && (
            <View style={styles.feelingsContainer}>
              <Text style={styles.feelingsTitle}>Feelings:</Text>
              <View style={styles.chipsContainer}>
                {parsedEntry.feelings
                  .split(",")
                  .map((feeling: string, index: number) => (
                    <Chip
                      key={index}
                      style={styles.feelingChip}
                      textStyle={styles.feelingChipText}
                    >
                      {feeling.trim()}
                    </Chip>
                  ))}
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <FontAwesome name="edit" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => confirmDelete(parsedEntry._id as string)}
          style={styles.deleteButton}
        >
          <FontAwesome name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row", // Align back button and title in a row
    alignItems: "center", // Align items vertically in the center
    justifyContent: "center", // Center the title horizontally
    marginBottom: 20,
    position: "relative", // For back button to stay on the left
  },
  backButton: {
    position: "absolute", // Keep the back button aligned to the left
    left: 0, // Align it at the start of the header
    padding: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0c4a6e",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    // overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: width * 0.9,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  metadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 17,
    marginLeft: 8,
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  time: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    marginBottom: 10,
  },
  feelingsContainer: {
    marginTop: 15,
  },
  feelingsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  feelingChip: {
    backgroundColor: "#e0f7fa",
    marginRight: 8,
    marginBottom: 8,
  },
  feelingChipText: {
    color: "#00796b",
  },
  emotionLevelContainer: {
    marginTop: 20,
  },
  emotionLevelText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  deleteButton: {
    position: "absolute",
    right: 20,
    bottom: 24,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
  },
  editButton: {
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    right: 60,
    bottom: 23,
    backgroundColor: "white",
  },
});

export default JournalEntryDetail;
