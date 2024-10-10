import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { useRouter } from "expo-router";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample Data for journal entries
const journalEntries = [
  {
    id: 1,
    image: 'https://yourimageurl.com/walk.jpg',
    title: 'Went on a walk with family and friends',
    date: '20th July 2024',
    time: '12:30 PM',
    tag: 'Joyful & fun',
    tagColor: 'text-orange-600',
    favorite: true,
  },
  {
    id: 2,
    image: 'https://yourimageurl.com/ultrasound.jpg',
    title: 'First parental appointment and first ultrasound of baby',
    date: '20th July 2024',
    time: '01:30 PM',
    tag: 'Happy & Excited',
    tagColor: 'text-blue-500',
    favorite: true,
  },
  {
    id: 3,
    image: 'https://yourimageurl.com/birthday.jpg',
    title: 'Celebrated my husband’s birthday',
    date: '25th July 2024',
    time: '08:30 PM',
    tag: 'Happy & fun',
    tagColor: 'text-purple-500',
    favorite: false,
  },
  {
    id: 4,
    image: 'https://yourimageurl.com/museum.jpg',
    title: 'Going to the Art Museum',
    date: '25th July 2024',
    time: '08:30 PM',
    tag: 'Calm',
    tagColor: 'text-indigo-500',
    favorite: false,
  },
];

// Styling components using NativeWind
const StyledText = styled(Text);

const JournalScreen = () => {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null); // Correct type

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to handle entry press
  const handleEntryPress = (entryId: number) => {
    // navigation.navigate('JournalEntryDetail', { entryId });
  };

  const router = useRouter();

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
  }, [currentIndex]);


  const handleBackPress = () => {
    router.push('/_sitemap'); 
  };

  const handledailyjournal = () => {
    router.push("/journal/dailyjournal");
  };

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
        <TouchableOpacity onPress={handledailyjournal} className="flex-1 py-3  bg-gray-300  rounded-l-lg ">
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
        {journalEntries.map((entry, index) => (
          <TouchableOpacity
            key={entry.id}
            className="mb-4 bg-white rounded-lg shadow-md border-2"
            onPress={() => handleEntryPress(entry.id)}
          >
            <Image
              source={{ uri: entry.image }}
              className="w-full h-48 rounded-t-lg"
              resizeMode="cover"
            />
            <View className="p-4">
              <StyledText className="font-bold text-lg">{entry.title}</StyledText>
              <View className="flex-row justify-between items-center mt-2">
                <StyledText className="text-gray-500">
                  {entry.date} {entry.time}
                </StyledText>
                <FontAwesome name="star" size={24} color={entry.favorite ? 'gold' : 'gray'} />
              </View>
              <StyledText className={`mt-2 font-medium ${entry.tagColor}`}>
                • {entry.tag}
              </StyledText>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default JournalScreen;
