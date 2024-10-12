import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import * as SQLite from 'expo-sqlite/legacy';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ProgressBar } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons'; // For baby icon
import moment from 'moment'; // For date handling
import BackButton from '@/utils/backButtin';

const healthHabits = {
  1: [
    { task: 'Drink 8 glasses of water', dailyTarget: 8, monthlyTarget: 240 },
    { task: 'Take folic acid', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Walk for 30 minutes', dailyTarget: 30, monthlyTarget: 900 },
    { task: 'Eat fruits', dailyTarget: 2, monthlyTarget: 60 },
    { task: 'Get enough sleep', dailyTarget: 8, monthlyTarget: 240 },
    { task: 'Prenatal vitamins', dailyTarget: 1, monthlyTarget: 30 },
  ],
  2: [
    { task: 'Drink 7 glasses of water', dailyTarget: 7, monthlyTarget: 210 },
    { task: 'Take iron supplements', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Walk for 20 minutes', dailyTarget: 20, monthlyTarget: 600 },
    { task: 'Eat leafy greens', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Rest well', dailyTarget: 8, monthlyTarget: 240 },
    { task: 'Prenatal checkups', dailyTarget: 1, monthlyTarget: 4 },
  ],
  3: [
    { task: 'Drink 7 glasses of water', dailyTarget: 7, monthlyTarget: 210 },
    { task: 'Take prenatal vitamins', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Practice yoga', dailyTarget: 30, monthlyTarget: 900 },
    { task: 'Get fresh air', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Meditate', dailyTarget: 10, monthlyTarget: 300 },
    { task: 'Attend prenatal classes', dailyTarget: 1, monthlyTarget: 4 },
  ],
  4: [
    { task: 'Drink 8 glasses of water', dailyTarget: 8, monthlyTarget: 240 },
    { task: 'Take iron supplements', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Walk for 40 minutes', dailyTarget: 40, monthlyTarget: 1200 },
    { task: 'Eat a balanced diet', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Get regular check-ups', dailyTarget: 1, monthlyTarget: 4 },
    { task: 'Start baby shopping', dailyTarget: 1, monthlyTarget: 30 },
  ],
  5: [
    { task: 'Drink 8 glasses of water', dailyTarget: 8, monthlyTarget: 240 },
    { task: 'Take prenatal vitamins', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Walk for 45 minutes', dailyTarget: 45, monthlyTarget: 1350 },
    { task: 'Do pelvic exercises', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Maintain good posture', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Prepare the nursery', dailyTarget: 1, monthlyTarget: 30 },
  ],
  6: [
    { task: 'Drink 8 glasses of water', dailyTarget: 8, monthlyTarget: 240 },
    { task: 'Attend prenatal classes', dailyTarget: 1, monthlyTarget: 4 },
    { task: 'Walk for 45 minutes', dailyTarget: 45, monthlyTarget: 1350 },
    { task: 'Eat protein-rich foods', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Engage in light exercise', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Take time for self-care', dailyTarget: 1, monthlyTarget: 30 },
  ],
  7: [
    { task: 'Drink 8 glasses of water', dailyTarget: 8, monthlyTarget: 240 },
    { task: 'Take prenatal vitamins', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Walk for 30 minutes', dailyTarget: 30, monthlyTarget: 900 },
    { task: 'Practice relaxation techniques', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Attend check-ups regularly', dailyTarget: 1, monthlyTarget: 4 },
    { task: 'Plan for maternity leave', dailyTarget: 1, monthlyTarget: 30 },
  ],
  8: [
    { task: 'Drink 8 glasses of water', dailyTarget: 8, monthlyTarget: 240 },
    { task: 'Read parenting books', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Practice breathing exercises', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Prepare birth plan', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Pack hospital bag', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Stay active', dailyTarget: 30, monthlyTarget: 900 },
  ],
  9: [
    { task: 'Drink 8 glasses of water', dailyTarget: 8, monthlyTarget: 240 },
    { task: 'Attend prenatal appointments', dailyTarget: 1, monthlyTarget: 4 },
    { task: 'Stay positive and calm', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Communicate with partner', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Prepare for babys arrival', dailyTarget: 1, monthlyTarget: 30 },
    { task: 'Stay connected with friends', dailyTarget: 1, monthlyTarget: 30 },
  ],
};

const db = SQLite.openDatabase('healthTrackerss.db');

const HealthTracker = () => {
  const [pregnancyMonth, setPregnancyMonth] = useState<number | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [tasksProgress, setTasksProgress] = useState<{ [key: string]: number }>({});
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({});
  const [userFirstTime, setUserFirstTime] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(0);

  useEffect(() => {
    createTables();
    fetchData();
    Notifications.requestPermissionsAsync();
    scheduleNotifications();
  }, []);

  const createTables = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, pregnancyMonth INTEGER, deliveryDate TEXT);"
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, dailyTarget INTEGER, monthlyTarget INTEGER, progress INTEGER);"
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS completion (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, date TEXT);"
      );
    });
  };

  const fetchData = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM user LIMIT 1;', [], (_, { rows }) => {
        if (rows.length > 0) {
          const user = rows.item(0);
          setPregnancyMonth(user.pregnancyMonth);
          setDeliveryDate(new Date(user.deliveryDate));
          setUserFirstTime(false);
          loadTasksProgress();
          checkCompletionToday();
        }
      });
    });
  };

  const loadTasksProgress = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT task, progress FROM tasks;', [], (_, { rows }) => {
        const progressData: { [key: string]: number } = {};
        for (let i = 0; i < rows.length; i++) {
          const item = rows.item(i);
          progressData[item.task] = item.progress;
        }
        setTasksProgress(progressData);
      });
    });
  };

  const checkCompletionToday = () => {
    const today = new Date().toISOString().split('T')[0];
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM completion WHERE date = ?;', [today], (_, { rows }) => {
        const completed = {};
        for (let i = 0; i < rows.length; i++) {
          const item = rows.item(i);
          completed[item.task] = true;
        }
        setCompletedTasks(completed);
      });
    });
  };

  const scheduleNotifications = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Health Reminder",
        body: "Have you completed your health tasks for today?",
      },
      trigger: { hour: 0, minute: 1, repeats: true },
    });
  };

  const saveUserData = async () => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT OR REPLACE INTO user (id, pregnancyMonth, deliveryDate) VALUES (?, ?, ?);',
        [1, pregnancyMonth, deliveryDate.toISOString().split('T')[0]],
        () => {
          setUserFirstTime(false);
          saveTasks();
        }
      );
    });
  };

  const saveTasks = () => {
    const tasks = healthHabits[pregnancyMonth] || [];
    db.transaction((tx) => {
      tasks.forEach(({ task, dailyTarget, monthlyTarget }) => {
        tx.executeSql(
          'INSERT INTO tasks (task, dailyTarget, monthlyTarget, progress) VALUES (?, ?, ?, ?);',
          [task, dailyTarget, monthlyTarget, 0]
        );
      });
    });
  };

  const handleTaskUpdate = (task: string, dailyProgress: number) => {
    if (completedTasks[task]) {
      return; // Task is already completed for today
    }

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE tasks SET progress = progress + ? WHERE task = ?;',
        [dailyProgress, task],
        () => {
          setTasksProgress((prevState) => ({
            ...prevState,
            [task]: prevState[task] + dailyProgress,
          }));
          markCompletion(task);
          addXP();
        }
      );
    });
  };

  const addXP = () => {
    setXp((prevXp) => prevXp + 10); // Increment XP by 10 for each task completion
  };

  const markCompletion = (task: string) => {
    const today = new Date().toISOString().split('T')[0];
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO completion (task, date) VALUES (?, ?);', [task, today], () => {
        setCompletedTasks((prevState) => ({
          ...prevState,
          [task]: true,
        }));
      });
    });
  };

  const getCurrentHabits = () => {
    return healthHabits[pregnancyMonth] || [];
  };

  const renderAnalytics = () => {
    const totalTasks = getCurrentHabits().reduce((acc, habit) => acc + habit.monthlyTarget, 0);
    const completedTasks = Object.values(tasksProgress).reduce((acc, cur) => acc + cur, 0);
    const percentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
      <View className="bg-white rounded-lg p-4 shadow mt-4">
        <Text className="text-lg font-semibold text-blue-800">Overall Completion Rate: {percentage}%</Text>
        <ProgressBar progress={percentage / 100} color="#3b82f6" style={{ height: 10, borderRadius: 5 }} />
      </View>
    );
  };

  const renderPregnancyPath = () => {
    const weeksRemaining = moment(deliveryDate).diff(moment(), 'weeks');
    return (
      <View className="bg-white rounded-lg p-4 shadow mt-4">
        <Text className="text-lg font-semibold text-teal-600">Weeks Remaining: {weeksRemaining}</Text>
        <FontAwesome5 name="baby" size={40} color="pink" />
      </View>
    );
  };

  const renderTipsAndMotivation = () => {
    return (
      <View className="bg-yellow-100 rounded-lg p-4 shadow mt-4">
        <Text className="text-lg font-semibold text-yellow-800">Tips & Motivation</Text>
        <Text className="text-gray-600">- Drinking enough water keeps you and your baby hydrated.</Text>
        <Text className="text-gray-600">- Prenatal vitamins ensure your baby gets essential nutrients.</Text>
        <Text className="text-gray-600">- Stay active! It helps with circulation and prepares your body for delivery.</Text>
      </View>
    );
  };

  return (
    <ScrollView className="p-4 mt-6 bg-gray-100">
        <BackButton />
      {userFirstTime ? (
        <View className="flex-1 justify-center items-center pt-6 bg-gray-100">
          <View className="bg-white p-6 pt-0 rounded-lg shadow-lg w-11/12 max-w-md">
            <Image
              source={require('../../assets/images/welcome_image.png')}
              className="w-full h-96 mb-6"
              style={{ resizeMode: 'contain' }}
            />
            <Text className="text-2xl font-bold text-blue-700 mb-4 text-center">Welcome!</Text>
            <Text className="text-gray-700 text-center mb-4">
              Enter your pregnancy month and expected delivery date.
            </Text>

            <TextInput
              placeholder="Pregnancy Month"
              value={pregnancyMonth ? pregnancyMonth.toString() : ''}
              onChangeText={(text) => setPregnancyMonth(parseInt(text))}
              keyboardType="numeric"
              className="bg-gray-200 p-2 rounded-lg mb-4"
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="bg-gray-200 p-2 rounded-lg">
              <Text>{deliveryDate.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={deliveryDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDeliveryDate(selectedDate);
                  }
                }}
              />
            )}

            <Button title="Save" onPress={saveUserData} />
          </View>
        </View>
      ) : (
        <>
        <Image source={require('../../assets/images/new_welcome_image.jpg')} style={{ width: '100%', height: 300 }} />
          {renderPregnancyPath()}
          {renderTipsAndMotivation()}
          {renderAnalytics()}
          <Text className="text-md font-bold text-orange-300 p-1 mt-4 mb-2 text-left">Your Daily Health Tasks</Text>
          <FlatList
            data={getCurrentHabits()}
            keyExtractor={(item) => item.task}
            renderItem={({ item }) => (
              <View className="bg-white p-4 rounded-lg shadow mb-4">
                <Text className="text-lg font-semibold text-gray-800">{item.task}</Text>
                <Text className="text-gray-600">Daily Target: {item.dailyTarget}</Text>
                <Text className="text-gray-600">Monthly Target: {item.monthlyTarget}</Text>
                <TouchableOpacity
                  onPress={() => handleTaskUpdate(item.task, item.dailyTarget)}
                  className={`p-2 mt-4 rounded-lg ${completedTasks[item.task] ? 'bg-[#87abe5]' : 'bg-blue-500'}`}
                >
                  <Text className="text-white text-center">
                    {completedTasks[item.task] ? 'Completed' : 'Mark Complete'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
    </ScrollView>
  );
};

export default HealthTracker;
