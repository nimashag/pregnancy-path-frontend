import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, TextInput, ScrollView } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';

const Mood = () => {
  const [moodHistory, setMoodHistory] = useState([
    { emoji: '😊', description: 'Feeling happy!', date: '2024-10-01' },
    { emoji: '😔', description: 'Feeling tired', date: '2024-10-03' },
    { emoji: '😡', description: 'Feeling angry!', date: '2024-10-04' },
    { emoji: '😴', description: 'Feeling sleepy', date: '2024-10-05' },
    { emoji: '😇', description: 'Feeling blessed', date: '2024-10-06' },
    { emoji: '😍', description: 'Feeling loved', date: '2024-10-07' },
    { emoji: '🥳', description: 'Feeling celebratory', date: '2024-10-08' },
    { emoji: '🤔', description: 'Feeling contemplative', date: '2024-10-09' },
    { emoji: '😕', description: 'Feeling confused', date: '2024-10-10' },
    { emoji: '😢', description: 'Feeling sad', date: '2024-10-11' },
    { emoji: '🤩', description: 'Feeling excited', date: '2024-10-12' },
    { emoji: '🥺', description: 'Feeling hopeful', date: '2024-10-13' },
    { emoji: '😳', description: 'Feeling embarrassed', date: '2024-10-14' },
    { emoji: '😎', description: 'Feeling cool', date: '2024-10-15' },
    { emoji: '😇', description: 'Feeling blessed', date: '2024-10-16' },
    { emoji: '🤤', description: 'Feeling hungry', date: '2024-10-17' },
    { emoji: '😜', description: 'Feeling playful', date: '2024-10-18' },
    { emoji: '😠', description: 'Feeling frustrated', date: '2024-10-19' },
    { emoji: '🤠', description: 'Feeling adventurous', date: '2024-10-20' },
    { emoji: '🤪', description: 'Feeling silly', date: '2024-10-21' },
    { emoji: '😷', description: 'Feeling sick', date: '2024-10-22' },
    { emoji: '🤯', description: 'Feeling mind-blown', date: '2024-10-23' },
    { emoji: '😌', description: 'Feeling relaxed', date: '2024-10-24' },
    { emoji: '😫', description: 'Feeling exhausted', date: '2024-10-25' },
    { emoji: '🤒', description: 'Feeling ill', date: '2024-10-26' },
    { emoji: '🤓', description: 'Feeling nerdy', date: '2024-10-27' },
    { emoji: '🥴', description: 'Feeling dizzy', date: '2024-10-28' },
    { emoji: '🤤', description: 'Feeling sleepy', date: '2024-10-29' },
    { emoji: '😭', description: 'Feeling overwhelmed', date: '2024-10-30' },
    { emoji: '😃', description: 'Feeling cheerful', date: '2024-11-01' },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddMoodModal, setShowAddMoodModal] = useState(false);
  const [newMood, setNewMood] = useState({ emoji: '', description: '', date: '' });

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

  const handleAddMood = () => {
    setMoodHistory([...moodHistory, newMood]);
    setNewMood({ emoji: '', description: '', date: '' });
    setShowAddMoodModal(false);
  };

  const handleEditMood = () => {
    setMoodHistory(moodHistory.map((m) => (m.date === selectedMood.date ? selectedMood : m)));
    setSelectedMood(null);
    setShowModal(false);
  };

  // Get screen dimensions for responsive sizing
  const { width } = Dimensions.get('window');
  const dayTileWidth = width / 7 - 13; // Adjusted tile width

  return (
    <ScrollView className="flex-1 p-4 pt-11 mb-4 bg-gray-50">
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
            <TouchableOpacity
              onPress={() => {
                setNewMood({ emoji: '', description: '', date: format(currentDate, 'yyyy-MM-dd') });
                setShowAddMoodModal(true);
              }}
            >
              <Text className="text-2xl">?</Text>
            </TouchableOpacity>
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

      {/* Tips & Tricks Section */}
      <View className="p-4 bg-green-100 rounded-lg shadow-lg mb-6">
        <Text className="text-lg font-bold mb-2">Tips & Tricks</Text>
        <View className="flex-wrap flex-row justify-between">
          {[
            { icon: 'sun', text: 'Start your day with gratitude' },
            { icon: 'star', text: 'Take regular breaks' },
            { icon: 'check', text: 'Prioritize your tasks' },
            { icon: 'heart', text: 'Practice self-care' },
            { icon: 'smile', text: 'Stay positive' },
          ].map((tip, index) => (
            <View key={index} className="flex-row items-center p-2">
              <Icon name={tip.icon} size={20} color="#000" className="mr-2" />
              <Text className="text-md">{tip.text}</Text>
            </View>
          ))}
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
          >
            <Text className="text-white font-bold">Add Mood</Text>
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
          >
            <Text className="text-white font-bold">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Mood;
