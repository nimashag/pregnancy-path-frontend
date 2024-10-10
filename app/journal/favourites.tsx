import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, Image, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { useRouter } from "expo-router";
import { Memory } from "./IMemory";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Styling components using NativeWind
const StyledText = styled(Text);

const JournalScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null); // Correct type
  const [currentIndex, setCurrentIndex] = useState(0);
  const [journalEntries, setJournalEntries] = useState<Memory[]>([]); // State to hold journal entries
  const [loading, setLoading] = useState(true); // State for loading status
  const router = useRouter();

  // Function to fetch favorite memories from API
  const fetchFavoriteMemories = async () => {
    try {
      const userId = '66dd6bf95be4a8cf0d58bf1f'; // Replace with dynamic userId if needed
      const response = await fetch(`http://localhost:3000/memory?userId=${userId}&isFavorite=true`);
      const data = await response.json();
      setJournalEntries(data.data); // Assuming the response structure matches your example
    } catch (error) {
      console.error("Failed to fetch memories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the next scroll position
      let nextIndex = currentIndex + 1;
      if (nextIndex >= journalEntries.length) {
        nextIndex = 0; // Loop back to the top
      }
      setCurrentIndex(nextIndex);

      // Calculate the Y position to scroll to (height of each journal entry)
      const position = nextIndex * (SCREEN_HEIGHT * 0.7); // Adjust height if necessary

      scrollViewRef.current?.scrollTo({
        y: position,
        animated: true,
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex, journalEntries]);

  // Fetch memories when the component mounts
  useEffect(() => {
    fetchFavoriteMemories();
  }, []);

  const handleEntryPress = (entry: Memory) => {
    // Navigate to the 'viewmemory' screen and pass the 'entry' data
    router.push({
      pathname: "/journal/viewmemory", // Ensure the correct path
      params: { entry: JSON.stringify(entry) }, // Pass the entry data as a JSON string
    });
  };

  const handleBackPress = () => {
    router.push('/_sitemap');
  };

  const handledailyjournal = () => {
    router.push("/journal/dailyjournal");
  };

  if (loading) {
    return (
        <View className="flex-1 justify-center items-center bg-gray-100">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
  }

  return (
      <View className="flex-1 bg-gray-100 p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8 mt-8">
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
          <TouchableOpacity onPress={handledailyjournal} className="flex-1 py-3 bg-gray-300 rounded-l-lg ">
            <Text className="text-center text-black font-semibold">
              Daily Journal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 py-3 rounded-r-lg bg-black">
            <Text className="text-center text-white font-semibold">
              Memory Lane
            </Text>
          </TouchableOpacity>
        </View>

        {/* Journal Entries (Auto Scroll View) */}
        <Animated.ScrollView
            ref={scrollViewRef} // Correct reference here
            className="p-1"
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            pagingEnabled // Enables snapping to each entry like a carousel
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
            )}
        >
          {journalEntries.map((entry: Memory) => (
              <TouchableOpacity
                  key={entry._id} // Use _id from the API response
                  className="mb-4 bg-white rounded-lg shadow-md border-2"
                  onPress={() => handleEntryPress(entry)} // Navigate on press
              >
                {entry.image ? (
                    <Image
                        source={{ uri: entry.image }}
                        className="w-full h-48 rounded-t-lg"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-48 bg-gray-300 rounded-t-lg justify-center items-center">
                      <Text>No Image Available</Text>
                    </View>
                )}
                <View className="p-4">
                  <StyledText className="font-bold text-lg">{entry.name}</StyledText>
                  <View className="flex-row justify-between items-center mt-2">
                    <StyledText className="text-gray-500">
                      {new Date(entry.date).toLocaleDateString()} {entry.time} {/* Format date properly */}
                    </StyledText>
                    <FontAwesome name="star" size={24} color={entry.isFavorite ? 'gold' : 'gray'} />
                  </View>
                  <StyledText className={`mt-2 font-medium`}>
                    • {entry.feelings}
                  </StyledText>
                </View>
              </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      </View>
  );
};

export default JournalScreen;
