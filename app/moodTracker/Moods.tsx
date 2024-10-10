import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, TextInput, ScrollView } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure to install react-native-vector-icons

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

  var mood = ''
  const getCurrentmood = () => {
    moodHistory.map((item) => {
        if (new Date(item.date) == new Date()){
            console.log(new Date(item.date))
            console.log(new Date)
            mood = item.emoji
        }
    })
  }

  useEffect( () => {

    getCurrentmood()
  }, [])

 

 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddMoodModal, setShowAddMoodModal] = useState(false);
  const [newMood, setNewMood] = useState({ emoji: '', description: '', date: '' });

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
    <ScrollView className="flex-1 p-4 pt-11 bg-gray-50">
      {/* Month Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={handlePreviousMonth} className="p-2 bg-gray-300 rounded-full">
          <Text className="text-lg">Previous</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} className="p-2 bg-gray-300 rounded-full">
          <Text className="text-lg">Next</Text>
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
            <TouchableOpacity onPress={() => { setNewMood({ emoji: '', description: '', date: format(currentDate, 'yyyy-MM-dd') }); setShowAddMoodModal(true); }}>
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
            <Text className="text-2xl">?</Text>
          </View>
        ))}
      </View>

      {/* Modal for Mood Details */}
      {selectedMood && (
        <Modal transparent={true} visible={showModal} animationType="slide">
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-6 rounded-lg w-3/4">
              <Text className="text-4xl text-center">{selectedMood.emoji}</Text>
              <Text className="text-lg mt-4 text-center">{selectedMood.description}</Text>
              <Text className="text-gray-500 text-center mt-2">{selectedMood.date}</Text>
              <TouchableOpacity className="bg-blue-500 p-2 mt-4 rounded-lg" onPress={() => {
                setSelectedMood({ ...selectedMood, description: 'New description here' }); // Example edit
                handleEditMood();
              }}>
                <Text className="text-white text-center">Edit Mood</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-blue-500 p-2 mt-2 rounded-lg" onPress={() => setShowModal(false)}>
                <Text className="text-white text-center">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal for Adding Mood */}
      <Modal transparent={true} visible={showAddMoodModal} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-2xl text-center">Add Your Mood</Text>
            <TextInput
              placeholder="Emoji"
              value={newMood.emoji}
              onChangeText={(text) => setNewMood({ ...newMood, emoji: text })}
              className="border border-gray-300 p-2 rounded mt-4"
            />
            <TextInput
              placeholder="Description"
              value={newMood.description}
              onChangeText={(text) => setNewMood({ ...newMood, description: text })}
              className="border border-gray-300 p-2 rounded mt-2"
            />
            <TouchableOpacity className="bg-blue-500 p-2 mt-4 rounded-lg" onPress={handleAddMood}>
              <Text className="text-white text-center">Add Mood</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-500 p-2 mt-2 rounded-lg" onPress={() => setShowAddMoodModal(false)}>
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Analytics Section */}
      <View className="mt-6">
        <Text className="text-xl font-bold">Mood Analytics</Text>
        <Text>Total Moods Logged: {moodHistory.length}</Text>
        <Text>Current mood: {mood}</Text>
        {/* Add more analytics as needed */}
      </View>

      

{/* Tips Section */}
<View className="mt-6 p-4 bg-white rounded-lg shadow">
  <Text className="text-xl font-bold">Tips & Tricks</Text>
  {[
    { tip: "Take a walk to clear your mind.", icon: "walking" },
    { tip: "Practice mindfulness and meditation.", icon: "meditation" },
    { tip: "Write in a journal to express your thoughts and feelings.", icon: "pen" },
    { tip: "Connect with friends and family for support.", icon: "users" },
    { tip: "Try breathing exercises to reduce stress.", icon: "heartbeat" },
    { tip: "Set small, achievable goals to boost your confidence.", icon: "flag" },
    { tip: "Listen to your favorite music to elevate your mood.", icon: "music" },
    { tip: "Limit screen time, especially before bed.", icon: "laptop" },
    { tip: "Engage in a hobby or activity you love.", icon: "paint-brush" },
    { tip: "Practice gratitude by listing things you are thankful for.", icon: "heart" },
    { tip: "Get enough sleep to recharge your mind and body.", icon: "bed" },
    { tip: "Eat a balanced diet to support your mental health.", icon: "apple" },
  ].map((item, index) => (
    <View key={index} className="flex-row items-center mt-2 p-2 bg-gray-100 rounded-lg">
      <Icon name={item.icon} size={24} color="#4B5563" style={{ marginRight: 8 }} />
      <Text className="text-md">{item.tip}</Text>
    </View>
  ))}
</View>


    </ScrollView>
  );
};

export default Mood;