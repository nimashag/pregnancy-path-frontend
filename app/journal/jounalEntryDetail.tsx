// JournalEntryDetail.tsx
import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

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
      };
    };
  };
}

const JournalEntryDetail: React.FC<JournalEntryDetailProps> = ({ route }) => {
  const { entry } = route.params; // Accessing the entry

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{entry.name}</Text>
      <Text style={styles.date}>{entry.date}</Text>
      <Text style={styles.time}>{entry.time}</Text>
      {entry.image && (
        <Image
          source={{ uri: `${entry.image}` }} // Ensure correct base64 format
          style={styles.image}
        />
      )}
      <Text style={styles.description}>{entry.description}</Text>
      {entry.feelings && (
        <Text style={styles.feelings}>Feelings: {entry.feelings}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    fontSize: width * 0.05,
    color: "#888",
    marginBottom: 5,
  },
  time: {
    fontSize: width * 0.05,
    color: "#888",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: width * 0.045,
    marginBottom: 10,
  },
  feelings: {
    fontSize: width * 0.045,
    fontStyle: "italic",
  },
});

export default JournalEntryDetail;
