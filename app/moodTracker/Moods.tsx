import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'; // Axios for making API calls
import { moods } from '@/db/mood';

const Mood = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddMoodModal, setShowAddMoodModal] = useState(false);
  const [newMood, setNewMood] = useState({ emoji: '', description: '', date: '' });
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submissions

  // Fetch mood history from server
  useEffect(() => {
    axios.get('/api/mood')
      .then(response => {
        //setMoodHistory(response.data);
        setMoodHistory(moods);
      })
      .catch(error => {
        console.error('Error fetching mood history:', error);
      });
  }, []);

  // Get current mood (last entry in moodHistory)
  const currentMood = moodHistory[moodHistory.length - 1];

  // Generate dates for the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Navigation Handlers for months
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getMoodForDate = (day) => {
    const mood = moodHistory.find((m) => format(new Date(m.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    return mood ? mood.emoji : '🟦'; // Default emoji if no mood for that day
  };

  const openMoodDetails = (day) => {
    const mood = moodHistory.find((m) => format(new Date(m.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    if (mood) {
      setSelectedMood(mood);
      setShowModal(true);
    }
  };

  // Add Mood
  const handleAddMood = () => {
    setIsLoading(true);
    axios.post('/api/mood/add', newMood)
      .then(response => {
        setMoodHistory([...moodHistory, response.data]);
        setNewMood({ emoji: '', description: '', date: '' });
        setShowAddMoodModal(false);
      })
      .catch(error => {
        console.error('Error adding mood:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Edit/Update Mood
  const handleEditMood = () => {
    setIsLoading(true);
    axios.put(`/api/mood/update/${selectedMood._id}`, selectedMood)
      .then(() => {
        setMoodHistory(moodHistory.map((m) => (m._id === selectedMood._id ? selectedMood : m)));
        setSelectedMood(null);
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error updating mood:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Get screen dimensions for responsive sizing
  const { width } = Dimensions.get('window');
  const dayTileWidth = width / 7 - 13; // Adjusted tile width

  // Helper function to calculate mood analytics
  const getMoodAnalytics = () => {
    const totalMoods = moodHistory.length;
    const positiveMoods = moodHistory.filter(mood => ['😊', '😍', '🥳', '😇', '🤩'].includes(mood.emoji)).length;
    const negativeMoods = totalMoods - positiveMoods;

    return {
      totalMoods,
      positivePercentage: totalMoods > 0 ? Math.round((positiveMoods / totalMoods) * 100) : 0,
      negativeMoods,
    };
  };

  const analytics = getMoodAnalytics();

  return (
    <ScrollView className="flex-1 p-4 pt-11 bg-gray-50">
      {/* Month Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={handlePreviousMonth} className="p-2 bg-gray-300 rounded-full">
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</Text>
        <TouchableOpacity onPress={handleNextMonth} className="p-2 bg-gray-300 rounded-full">
          <Icon name="arrow-right" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Weekday Headers */}
      <View className="flex-row justify-between mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <Text key={index} className="text-md font-bold text-center" style={{ width: dayTileWidth }}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View className="flex-wrap flex-row justify-evenly">
        {/* Blank spaces for days before the first day of the month */}
        {[...Array(getDay(startOfMonth(currentDate)))].map((_, index) => (
          <View key={index} style={{ width: dayTileWidth, height: 70 }} className="justify-center items-center">
            <Text className="text-2xl"> </Text>
          </View>
        ))}

        {/* Display days of the current month */}
        {daysInMonth.map((day) => (
          <TouchableOpacity
            key={day.toString()}
            style={{ width: dayTileWidth, height: 70 }}
            className="justify-center items-center bg-white rounded-lg m-1 shadow"
            onPress={() => openMoodDetails(day)}
          >
            <Text className="text-xl">{getMoodForDate(day)}</Text>
            <Text className="text-sm mt-2">{format(day, 'd')}</Text>
          </TouchableOpacity>
        ))}

        {/* Fill blank spaces after the last day of the month */}
        {[...Array(6 - getDay(endOfMonth(currentDate)))].map((_, index) => (
          <View key={index} style={{ width: dayTileWidth, height: 70 }} className="justify-center items-center">
            <Text className="text-xl text-gray-400">-</Text>
          </View>
        ))}
      </View>

      {/* Current Mood Section */}
      <View className="my-4 p-4 bg-blue-100 rounded-lg shadow-lg">
        <Text className="text-lg font-bold">Current Mood</Text>
        <Text className="text-6xl">{currentMood?.emoji || '🙂'}</Text>
        <Text className="text-lg mt-2">{currentMood?.description || 'Add your mood!'}</Text>
      </View>

      {/* Expanded Analytics Section */}
      <View className="p-4 bg-green-100 rounded-lg shadow-lg mb-6">
        <Text className="text-lg font-bold mb-2">Mood Analytics</Text>
        <View className="flex-wrap flex-row justify-around">
          <View className="flex-column items-center">
            <Text className="text-md font-bold">{analytics.totalMoods}</Text>
            <Text className="text-md">Total Moods</Text>
          </View>
          <View className="flex-column items-center">
            <Text className="text-md font-bold">{analytics.positivePercentage}%</Text>
            <Text className="text-md">Positive Moods</Text>
          </View>
          <View className="flex-column items-center">
            <Text className="text-md font-bold">{analytics.negativeMoods}</Text>
            <Text className="text-md">Negative Moods</Text>
          </View>
        </View>
      </View>

      {/* Add Mood Modal */}
      <Modal visible={showAddMoodModal} animationType="slide">
        <View className="flex-1 justify-center items-center bg-white p-6">
          <Text className="text-lg font-bold mb-4">Add Today's Mood</Text>
          <TextInput
            className="border p-2 w-full mb-2"
            placeholder="Emoji"
            value={newMood.emoji}
            onChangeText={(text) => setNewMood({ ...newMood, emoji: text })}
          />
          <TextInput
            className="border p-2 w-full mb-2"
            placeholder="Description"
            value={newMood.description}
            onChangeText={(text) => setNewMood({ ...newMood, description: text })}
          />
          <TouchableOpacity
            onPress={handleAddMood}
            className="bg-green-500 p-2 rounded-lg w-full text-center mt-2"
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Add Mood</Text>}
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Mood Details Modal */}
      <Modal visible={showModal} animationType="slide">
        <View className="flex-1 justify-center items-center bg-white p-6">
          <Text className="text-lg font-bold mb-4">Mood Details</Text>
          <Text className="text-6xl mb-4">{selectedMood?.emoji}</Text>
          <TextInput
            className="border p-2 w-full mb-2"
            placeholder="Description"
            value={selectedMood?.description}
            onChangeText={(text) => setSelectedMood({ ...selectedMood, description: text })}
          />
          <TouchableOpacity
            onPress={handleEditMood}
            className="bg-blue-500 p-2 rounded-lg w-full text-center mt-2"
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Save Changes</Text>}
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Mood;
