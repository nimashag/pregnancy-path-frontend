import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as SQLite from 'expo-sqlite/legacy'; // Ensure you're using the correct import for SQLite
import BackButton from '@/utils/backButtin';

const db = SQLite.openDatabase('moods.db'); // Open or create the SQLite database

const Mood = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddMoodModal, setShowAddMoodModal] = useState(false);
  const [newMood, setNewMood] = useState({ emoji: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Create table if not exists
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS mood (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          emoji TEXT,
          description TEXT,
          date TEXT
        );`,
        [],
        () => console.log('Mood table created successfully'),
        (tx, error) => console.error('Error creating mood table:', error)
      );
    }, null, refreshMoodHistory);
  }, []);

  // Fetch mood history from SQLite
  const refreshMoodHistory = () => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM mood ORDER BY date DESC", [], (_, { rows }) => {
        setMoodHistory(rows._array);
      });
    });
  };

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
    if (!newMood.emoji || !newMood.description) {
      alert('Please fill in both emoji and description.'); // Alert if fields are empty
      return;
    }

    setIsLoading(true);
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO mood (emoji, description, date) VALUES (?, ?, ?)",
        [newMood.emoji, newMood.description, format(new Date(), 'yyyy-MM-dd')],
        (_, { insertId }) => {
          setMoodHistory([...moodHistory, { ...newMood, id: insertId, date: format(new Date(), 'yyyy-MM-dd') }]);
          setNewMood({ emoji: '', description: '' }); // Resetting the state after adding
          setShowAddMoodModal(false);
          console.log('Mood added:', { ...newMood, id: insertId, date: format(new Date(), 'yyyy-MM-dd') });
        },
        (tx, error) => {
          console.error('Error inserting mood:', error);
          alert('Failed to add mood. Please try again.'); // Notify user of error
        }
      );
    }, null, () => setIsLoading(false));
  };

  // Edit/Update Mood
  const handleEditMood = () => {
    if (!selectedMood.emoji || !selectedMood.description) {
      alert('Please fill in both emoji and description.'); // Alert if fields are empty
      return;
    }

    setIsLoading(true);
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE mood SET emoji = ?, description = ? WHERE id = ?",
        [selectedMood.emoji, selectedMood.description, selectedMood.id],
        () => {
          setMoodHistory(moodHistory.map((m) => (m.id === selectedMood.id ? selectedMood : m)));
          setSelectedMood(null);
          setShowModal(false);
        },
        (tx, error) => {
          console.error('Error updating mood:', error);
          alert('Failed to update mood. Please try again.');
        }
      );
    }, null, () => setIsLoading(false));
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
      <BackButton />
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

      {/* Mood Analytics Section */}
      <View className="mt-6 p-4 bg-white rounded-lg shadow">
        <Text className="text-xl font-bold">Mood Analytics</Text>
        <Text>Total Moods: {analytics.totalMoods}</Text>
        <Text>Positive Mood Percentage: {analytics.positivePercentage}%</Text>
        <Text>Negative Moods: {analytics.negativeMoods}</Text>
      </View>

      {/* Add Mood Button */}
      <TouchableOpacity
        className="mt-4 p-4 bg-blue-500 rounded-lg shadow"
        onPress={() => setShowAddMoodModal(true)}
      >
        <Text className="text-white text-lg text-center">Add Mood</Text>
      </TouchableOpacity>

      {/* Mood Details Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg w-80 p-5">
            <Text className="text-2xl font-bold mb-2">Mood Details</Text>
            {selectedMood && (
              <>
                <Text className="text-3xl mb-4">{selectedMood.emoji}</Text>
                <Text className="text-lg">{selectedMood.description}</Text>
                <TouchableOpacity className="mt-4 p-2 bg-red-500 rounded" onPress={() => handleDeleteMood(selectedMood.id)}>
                  <Text className="text-white text-center">Delete Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity className="mt-4 p-2 bg-yellow-500 rounded" onPress={() => {
                  setNewMood({ emoji: selectedMood.emoji, description: selectedMood.description });
                  setShowModal(false);
                  setShowAddMoodModal(true);
                }}>
                  <Text className="text-white text-center">Edit Mood</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity className="mt-4 p-2 bg-gray-300 rounded" onPress={() => setShowModal(false)}>
              <Text className="text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Mood Modal */}
      <Modal
        visible={showAddMoodModal}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg w-80 p-5">
            <Text className="text-2xl font-bold mb-4">Add Mood</Text>
            <TextInput
              value={newMood.emoji}
              onChangeText={(text) => setNewMood({ ...newMood, emoji: text })}
              placeholder="😊"
              className="border-b border-gray-400 p-2 mb-4"
              style={{ fontSize: 30, textAlign: 'center' }}
            />
            <TextInput
              value={newMood.description}
              onChangeText={(text) => setNewMood({ ...newMood, description: text })}
              placeholder="Describe your mood..."
              className="border-b border-gray-400 p-2 mb-4"
            />
            <TouchableOpacity className="mt-4 p-2 bg-blue-500 rounded" onPress={handleAddMood}>
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center">Add Mood</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity className="mt-4 p-2 bg-gray-300 rounded" onPress={() => setShowAddMoodModal(false)}>
              <Text className="text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Mood;
