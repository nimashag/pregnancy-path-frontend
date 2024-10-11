import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import * as SQLite from "expo-sqlite/legacy";
import { ProgressBar } from "react-native-paper";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";

// Database setup
const db = SQLite.openDatabase("habitTracker.db");

// Timer Component
const Timer = ({ duration, onFinish, isRunning, startTimer, stopTimer }) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    let timerId;
    if (isRunning) {
      timerId = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 0) {
            clearInterval(timerId);
            onFinish();
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <View
      className="flex flex-row justify-between items-center bg-white
     rounded-lg p-4"
    >
      <Text className="text-3xl font-bold">{formatTime(secondsLeft)}</Text>
      <TouchableOpacity
        onPress={isRunning ? stopTimer : startTimer}
        className="bg-[#d27767] rounded-full"
      >
        <Text>
          {isRunning ? (
            <MaterialIcons
              name={isRunning ? "pause" : "play-arrow"}
              size={40}
              color="white"
              style={{ marginRight: 8 }}
            />
          ) : (
            <MaterialIcons
              name={isRunning ? "pause" : "play-arrow"}
              size={40}
              color="white"
              style={{ marginRight: 8 }}
            />
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// MusicPlayer Component
const MusicPlayer = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/audios/melody-of-nature-main-6672.mp3")
    );
    setSound(sound);
    await sound.playAsync();
    setIsPlaying(true);
  }

  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View>
      <TouchableOpacity
        onPress={isPlaying ? stopSound : playSound}
        className="bg-[#d5856c] p-2 rounded-lg"
      >
        <Text className="text-center font-black text-white">
          {isPlaying ? "Stop Music" : "Play Calming Music"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const yogaPostures = [
  {
    id: 1,
    name: "Cat-Cow Pose",
    time: "Morning",
    description:
      "Helps relieve tension in the spine and strengthens the lower back.",
    imageUrl:
      "https://www.yogapedia.com/wp-content/uploads/2023/11/istock-667293822-800x521.jpg",
  },
  {
    id: 2,
    name: "Child’s Pose",
    time: "Afternoon",
    description: "Relieves stress and stretches hips, thighs, and ankles.",
    imageUrl:
      "https://res.cloudinary.com/peloton-cycle/image/fetch/f_auto,c_limit,w_384,q_90/https://images.ctfassets.net/6ilvqec50fal/15r1b2QTdWSfFzQ3BOyZrw/48e86bf3ad5c430408b0ace65b403cab/childspose_kirra.png",
  },
  {
    id: 3,
    name: "Seated Forward Bend",
    time: "Evening",
    description:
      "Stretches the spine and legs, calms the mind (perform gently).",
    imageUrl:
      "https://images.ctfassets.net/p0sybd6jir6r/3MNagkluwLBql1r1TuGXqm/443f130acbb306566bbe35f8a53e6c78/variation-of-half-pigeon-pose-34dc127c903f9050e34084069308035a.jpg",
  },
  {
    id: 4,
    name: "Warrior I Pose",
    time: "Morning",
    description: "Strengthens legs, opens hips and chest, and stretches arms.",
    imageUrl:
      "https://cdn.yogajournal.com/wp-content/uploads/2021/10/Warrior-1-Pose_Andrew-Clark_2400x1350.jpeg",
  },
  {
    id: 5,
    name: "Bridge Pose",
    time: "Evening",
    description:
      "Strengthens the back, glutes, and hamstrings while opening the chest.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7QMGe7Y72spIrHgEVoi06fDaCxWRnhcgaBQ&s",
  },
  {
    id: 6,
    name: "Cobra Pose",
    time: "Morning",
    description:
      "Increases spinal flexibility and opens the chest (perform gently).",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxmTuCEyFB1CRskbnU7s6_REEuu22mv8RvrQ&s",
  },
  {
    id: 7,
    name: "Tree Pose",
    time: "Afternoon",
    description:
      "Improves balance and strengthens the legs while opening the hips (use support).",
    imageUrl:
      "https://cdn.yogajournal.com/wp-content/uploads/2022/01/Tree-Pose_Alt-1_2400x1350_Andrew-Clark.jpeg",
  },
];

// Meditation Habits Data
const meditationHabits = [
  { id: 1, name: "Mindful Breathing", time: "Morning" },
  { id: 2, name: "Loving-Kindness Meditation", time: "Afternoon" },
  { id: 3, name: "Body Scan Meditation", time: "Evening" },
];

// Habit Tracker Component
const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [totalTasks, setTotalTasks] = useState("");
  const [timerDuration, setTimerDuration] = useState(300); // 5 minutes default
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPosture, setSelectedPosture] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, habitName TEXT, progress INTEGER, totalTasks INTEGER);"
      );
      fetchHabits();
    });
  }, []);

  const fetchHabits = () => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM habits;", [], (_, { rows }) =>
        setHabits(rows._array)
      );
    });
  };

  const addHabit = () => {
    if (newHabit && totalTasks) {
      const parsedTotalTasks = parseInt(totalTasks);
      if (isNaN(parsedTotalTasks)) {
        return; // Exit if it's not valid
      }

      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO habits (habitName, progress, totalTasks) VALUES (?, ?, ?);",
          [newHabit, 0, parsedTotalTasks],
          (_, { insertId }) => {
            const newHabitObj = {
              id: insertId,
              habitName: newHabit,
              progress: 0,
              totalTasks: parsedTotalTasks,
            };
            setHabits([...habits, newHabitObj]);
            setNewHabit("");
            setTotalTasks("");
            setDisplayPopup(false);
            console.log("Hello world");
          },
          (_, error) => {
            console.log("Error inserting habit:", error);
          }
        );
      });
    }
  };

  const updateProgress = (id, progress, totalTasks) => {
    const newProgress = progress + 1;
    if (newProgress <= totalTasks) {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE habits SET progress = ? WHERE id = ?;",
          [newProgress, id],
          () => {
            setHabits((prev) =>
              prev.map((habit) =>
                habit.id === id ? { ...habit, progress: newProgress } : habit
              )
            );
          }
        );
      });
    }
  };

  const deleteHabit = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM habits WHERE id = ?;",
        [id],
        () => {
          setHabits(habits.filter((habit) => habit.id !== id));
          console.log("Habit deleted");
        },
        (_, error) => {
          console.log("Error deleting habit:", error);
        }
      );
    });
  };

  const startYogaSession = (posture) => {
    setTimerDuration(
      posture.time === "Morning"
        ? 300
        : posture.time === "Afternoon"
        ? 600
        : 900
    ); // Set duration based on time category
    startTimer(); // Start the timer
    alert(`Starting ${posture.name} session for ${posture.time} minutes!`);
  };

  const showPostureDetails = (posture) => {
    setSelectedPosture(posture);
    setModalVisible(true);
  };

  const startTimer = () => setIsTimerRunning(true);
  const stopTimer = () => setIsTimerRunning(false);
  const onFinishTimer = () => {
    alert("Time is up! Great work!");
    setIsTimerRunning(false);
  };

  const renderTipsAndMotivation = () => (
    <View className="bg-orange-200 rounded-lg p-4 shadow-md mt-8 my-8">
      <Text className="text-lg font-semibold text-pink-800">
        Pregnancy Yoga & Meditation Guide
      </Text>
      <Text className="text-gray-600">
        - Start your day with gentle yoga postures to stretch and relax your
        body.
      </Text>
      <Text className="text-gray-600">
        - Perform each yoga posture for 5 minutes to enhance flexibility and
        improve circulation.
      </Text>
      <Text className="text-gray-600">
        - In the morning, try poses like Cat-Cow or Warrior I to energize your
        body.
      </Text>
      <Text className="text-gray-600">
        - Incorporate meditation into your daily routine for 5 minutes. Begin
        with mindful breathing to calm your mind.
      </Text>
      <Text className="text-gray-600">
        - Midday yoga can help alleviate back pain. Poses like Tree Pose can
        improve balance and stability.
      </Text>
      <Text className="text-gray-600">
        - In the evening, try Seated Forward Bend or Bridge Pose to relax your
        body and unwind.
      </Text>
      <Text className="text-gray-600">
        - Consistent practice of yoga and meditation helps with circulation,
        reduces stress, and prepares your body for birth.
      </Text>
    </View>
  );

  const [displayPopup, setDisplayPopup] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
      <SafeAreaView>
        {displayPopup && (
          <View
            className="bg-[#0000002a] bg-opacity-10 absolute
   top-0 le justify-center items-center w-[100vw] h-[110vh] z-50"
          >
            <View className="bg-white rounded-lg shadow-lg p-6 w-4/5 max-w-md">
              <TouchableOpacity
                onPress={() => setDisplayPopup(false)}
                className="absolute top-3 right-3"
              >
                <MaterialIcons name="close" size={30} color="#FF3D00" />
              </TouchableOpacity>
              <Text className="text-xl font-semibold text-center mb-4">
                Add a New Habit
              </Text>
              <TextInput
                placeholder="Enter new habit"
                value={newHabit}
                onChangeText={setNewHabit}
                className="border border-gray-300 p-2 rounded mb-4"
              />
              <TextInput
                placeholder="Total tasks (e.g., 10)"
                value={totalTasks}
                onChangeText={setTotalTasks}
                keyboardType="numeric"
                className="border border-gray-300 p-2 rounded mb-4"
              />
              <TouchableOpacity
                onPress={addHabit}
                className="bg-[#68a1b0] p-3 rounded-lg shadow-md"
              >
                <Text className="text-white text-center font-bold">
                  Add Habit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Image
          source={require("../../assets/images/habbits.jpg")}
          className="w-full h-72 object-cover mb-4 rounded-lg"
        />

        {/* Timer Section */}
        <View className="my-4">
          <Text className="text-xl mb-2">Yoga/Meditation Timer</Text>
          <Timer
            duration={timerDuration}
            onFinish={onFinishTimer}
            isRunning={isTimerRunning}
            startTimer={startTimer}
            stopTimer={stopTimer}
          />
        </View>

        {/* Music Player */}
        <MusicPlayer />

        {renderTipsAndMotivation()}

        <View className="absolute top-4 right-4">
          <TouchableOpacity
            onPress={() => {
              setDisplayPopup(!displayPopup);
            }}
            className="p-2 flex items-center justify-center flex-row rounded-md absolute top-0 z-20 right-0 bg-[#cf937e]"
          >
            <MaterialIcons name="add" size={30} color="white" />
            <Text className="font-bold text-white">Add Habit</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-3xl font-bold mb-4 mt-2 text-[#1f1f1f]">
          Habit Tracker
        </Text>

        {/* Habits List */}
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mb-6 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
              {/* Habit Name */}
              <Text className="text-2xl font-extrabold text-[#f28b3f] mb-2 tracking-wide">
                {item.habitName}
              </Text>

              {/* Progress Bar */}
              <View className="my-2">
                <ProgressBar
                  progress={item.progress / item.totalTasks}
                  color="#f0a23b"
                  style={{ height: 10, borderRadius: 8 }}
                />
                <Text className="text-gray-500 text-sm mt-1">
                  {item.progress} / {item.totalTasks} completed
                </Text>
              </View>

              {/* Buttons: Mark Progress and Delete */}
              <View className="flex-row justify-between items-center mt-4">
                <TouchableOpacity
                  className="bg-[#d8936b] rounded-lg py-2 px-4 shadow-md"
                  onPress={() =>
                    updateProgress(item.id, item.progress, item.totalTasks)
                  }
                >
                  <Text className="text-white font-semibold">
                    Mark Progress
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-500 rounded-full p-2 shadow-md"
                  onPress={() => deleteHabit(item.id)}
                >
                  <MaterialIcons name="delete" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Yoga Postures */}
        <View className="my-8">
          <Text className="text-4xl font-extrabold text-center mb-8 text-[#d27767]">
            Yoga Postures
          </Text>
          <View className="space-y-8">
            {yogaPostures.map((posture) => (
              <View
                key={posture.id}
                className="bg-white p-6 rounded-2xl shadow-xl flex-col items-center space-y-4 border-2 border-[#f3d1c7]"
              >
                <Image
                  source={{ uri: posture.imageUrl }}
                  className="w-36 h-36 rounded-full border-4 border-[#d27767]"
                />
                <View className="text-center">
                  <Text className="text-2xl font-bold text-[#aa5c3a]">
                    {posture.name}
                  </Text>
                  <Text className="text-lg text-[#aa8638] mt-2">
                    {posture.time} minutes
                  </Text>
                  <Text className="text-gray-600 mt-4">
                    {posture.description}
                  </Text>
                </View>
                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    onPress={() => startYogaSession(posture)}
                    className="bg-[#fce9dc] p-2 px-6 rounded-lg shadow-md"
                  >
                    <Text className="text-[#d27767] font-semibold">Start</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Meditation Habits Section */}
        <View className="my-8">
          <Text className="text-4xl font-extrabold text-center mb-8 text-[#d27767]">
            Meditation Habits
          </Text>
          <View className="space-y-6">
            {meditationHabits.map((habit) => (
              <View
                key={habit.id}
                className="bg-gradient-to-r from-[#f6e4e2] to-[#fbe8dc] p-6 rounded-xl shadow-lg flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-2xl font-semibold text-gray-900">
                    {habit.name}
                  </Text>
                  <Text className="text-lg text-[#aa8638] mt-2">
                    {habit.time} minutes
                  </Text>
                </View>
                <View className="bg-[#f3d1c7] px-4 py-2 rounded-full">
                  <TouchableOpacity onPress={() => startYogaSession(habit)}>
                    <Text className="text-sm font-semibold text-[#aa8638]">
                      Track
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default HabitTracker;
