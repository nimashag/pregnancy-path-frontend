import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';  // Icons for time, date, and feelings
import { Chip, ProgressBar } from 'react-native-paper';  // Chips for feelings and a progress bar for emotions

const { width } = Dimensions.get("window");

interface JournalEntryDetailProps {
  route: {
    params: {
      entry: {
        name: string;
        description: string;
        time: string;
        date: string;
        image?: string;  // base64 image
        feelings?: string;
        emotionLevel?: number;  // Emotional intensity (1-10)
      };
    };
  };
}

const JournalEntryDetail: React.FC<JournalEntryDetailProps> = () => {
  const { entry } = useLocalSearchParams();
  const parsedEntry = JSON.parse(entry as string);

  const emotionsColor = parsedEntry.emotionLevel ? getEmotionColor(parsedEntry.emotionLevel) : "#d3d3d3";

  return (
      <ScrollView contentContainerStyle={styles.container}>
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
                <Text style={styles.date}>{parsedEntry.date}</Text>
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
                    {parsedEntry.feelings.split(',').map((feeling: string, index: number) => (
                        <Chip key={index} style={styles.feelingChip} textStyle={styles.feelingChipText}>
                          {feeling.trim()}
                        </Chip>
                    ))}
                  </View>
                </View>
            )}

            {parsedEntry.emotionLevel !== undefined && (
                <View style={styles.emotionLevelContainer}>
                  <Text style={styles.emotionLevelText}>Emotion Intensity:</Text>
                  <ProgressBar progress={parsedEntry.emotionLevel / 10} color={emotionsColor} style={styles.progressBar} />
                </View>
            )}
          </View>
        </View>
      </ScrollView>
  );
};

// Helper function to return color based on emotion level
const getEmotionColor = (level: number) => {
  if (level <= 3) return "#64b5f6"; // Light blue for calm
  if (level <= 6) return "#ffb74d"; // Orange for moderate emotions
  return "#e57373"; // Red for intense emotions
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: width * 0.6,
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
    marginRight: 15,
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
});

export default JournalEntryDetail;