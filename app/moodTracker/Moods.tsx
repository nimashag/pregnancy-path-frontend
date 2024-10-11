import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as SQLite from 'expo-sqlite/legacy'; // Ensure you're using the correct import for SQLite

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
      setSelectedMood({ ...mood });
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

  // Delete Mood
  const handleDeleteMood = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM mood WHERE id = ?",
        [id],
        () => {
          setMoodHistory(moodHistory.filter((mood) => mood.id !== id));
          setShowModal(false);
        },
        (tx, error) => {
          console.error('Error deleting mood:', error);
          alert('Failed to delete mood. Please try again.');
        }
      );
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
            <Text className="text-2xl"> </Text>
          </View>
        ))}
      </View>

      {/* Mood Summary and Actions */}
      <View className="mt-4">
        <Text className="text-xl font-bold">Current Mood</Text>
        <Text className="text-lg">{currentMood ? currentMood.emoji : 'No mood recorded'}</Text>
        <Text className="text-lg">Description: {currentMood ? currentMood.description : 'N/A'}</Text>
        <Text className="text-lg">Total Moods: {analytics.totalMoods}</Text>
        <Text className="text-lg">Positive Mood Percentage: {analytics.positivePercentage}%</Text>
      </View>

      {/* Add Mood Button */}
      <TouchableOpacity
        onPress={() => setShowAddMoodModal(true)}
        className="mt-4 p-2 bg-blue-500 rounded-lg"
      >
        <Text className="text-white text-center">Add Mood</Text>
      </TouchableOpacity>

      {/* Edit Mood Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-4 w-80">
            <Text className="text-xl font-bold">Edit Mood</Text>
            <TextInput
              value={selectedMood?.emoji}
              onChangeText={(text) => setSelectedMood({ ...selectedMood, emoji: text })}
              placeholder="Emoji"
              className="border border-gray-300 p-2 rounded"
            />
            <TextInput
              value={selectedMood?.description}
              onChangeText={(text) => setSelectedMood({ ...selectedMood, description: text })}
              placeholder="Description"
              className="border border-gray-300 p-2 rounded mt-2"
            />
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity onPress={handleEditMood} className="bg-green-500 p-2 rounded">
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteMood(selectedMood.id)} className="bg-red-500 p-2 rounded">
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setShowModal(false)} className="mt-4">
              <Text className="text-blue-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Mood Modal */}
      <Modal visible={showAddMoodModal} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-4 w-80">
            <Text className="text-xl font-bold">Add Mood</Text>
            <TextInput
              value={newMood.emoji}
              onChangeText={(text) => setNewMood({ ...newMood, emoji: text })}
              placeholder="Emoji"
              className="border border-gray-300 p-2 rounded"
            />
            <TextInput
              value={newMood.description}
              onChangeText={(text) => setNewMood({ ...newMood, description: text })}
              placeholder="Description"
              className="border border-gray-300 p-2 rounded mt-2"
            />
            <TouchableOpacity onPress={handleAddMood} className="bg-blue-500 p-2 rounded mt-4">
              <Text className="text-white">Add Mood</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAddMoodModal(false)} className="mt-4">
              <Text className="text-blue-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Indicator */}
      {isLoading && (
        <ActivityIndicator size="large" color="#000" className="absolute top-1/2 left-1/2" />
      )}
    </ScrollView>
  );
};

export default Mood;
