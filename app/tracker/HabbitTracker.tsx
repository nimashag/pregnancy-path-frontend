import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import * as SQLite from 'expo-sqlite/legacy';
import { ProgressBar } from 'react-native-paper';
import moment from 'moment';

const habitData = {
  1: [
    { habit: 'Daily meditation for 10 minutes', dailyTarget: 10, monthlyTarget: 300 },
    { habit: 'Gratitude journaling', dailyTarget: 1, monthlyTarget: 30 },
    { habit: 'Read 5 pages of a book', dailyTarget: 5, monthlyTarget: 150 },
    { habit: 'Stretch for 15 minutes', dailyTarget: 15, monthlyTarget: 450 },
    { habit: 'Limit screen time to 2 hours', dailyTarget: 2, monthlyTarget: 60 },
  ],
  2: [
    { habit: 'Take deep breaths for 5 minutes', dailyTarget: 5, monthlyTarget: 150 },
    { habit: 'Write one positive affirmation', dailyTarget: 1, monthlyTarget: 30 },
    { habit: 'Walk for 20 minutes', dailyTarget: 20, monthlyTarget: 600 },
    { habit: 'Drink 8 glasses of water', dailyTarget: 8, monthlyTarget: 240 },
    { habit: 'Sleep for at least 7 hours', dailyTarget: 7, monthlyTarget: 210 },
  ],
  // Add data for other months...
};

const db = SQLite.openDatabase('habitTracker.db');

const HabitTracker = () => {
  const [month, setMonth] = useState<number | null>(1); // Default to January
  const [habitsProgress, setHabitsProgress] = useState<{ [key: string]: number }>({});
  const [completedHabits, setCompletedHabits] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    createHabitTables();
    fetchHabitData();
  }, []);

  const createHabitTables = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, habit TEXT, dailyTarget INTEGER, monthlyTarget INTEGER, progress INTEGER);'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS habitCompletion (id INTEGER PRIMARY KEY AUTOINCREMENT, habit TEXT, date TEXT);'
      );
    });
  };

  const fetchHabitData = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM habits;', [], (_, { rows }) => {
        const progressData: { [key: string]: number } = {};
        for (let i = 0; i < rows.length; i++) {
          const item = rows.item(i);
          progressData[item.habit] = item.progress;
        }
        setHabitsProgress(progressData);
      });
    });
  };

  const handleHabitUpdate = (habit: string, dailyProgress: number) => {
    if (completedHabits[habit]) {
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE habits SET progress = progress + ? WHERE habit = ?;',
        [dailyProgress, habit],
        () => {
          setHabitsProgress((prevState) => ({
            ...prevState,
            [habit]: prevState[habit] + dailyProgress,
          }));
          markHabitCompletion(habit);
        }
      );
    });
  };

  const markHabitCompletion = (habit: string) => {
    const today = new Date().toISOString().split('T')[0];
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO habitCompletion (habit, date) VALUES (?, ?);', [habit, today], () => {
        setCompletedHabits((prevState) => ({
          ...prevState,
          [habit]: true,
        }));
      });
    });
  };

  const getCurrentHabits = () => {
    return habitData[month] || [];
  };

  const renderHabitAnalytics = () => {
    const totalHabits = getCurrentHabits().reduce((acc, habit) => acc + habit.monthlyTarget, 0);
    const completedHabitsCount = Object.values(habitsProgress).reduce((acc, cur) => acc + cur, 0);
    const percentage = totalHabits ? Math.round((completedHabitsCount / totalHabits) * 100) : 0;

    return (
      <View className="bg-white rounded-lg p-4 shadow mt-4">
        <Text className="text-lg font-semibold text-blue-800">Overall Habit Completion: {percentage}%</Text>
        <ProgressBar progress={percentage / 100} color="#3b82f6" style={{ height: 10, borderRadius: 5 }} />
      </View>
    );
  };

  return (
    <ScrollView className="p-4 mt-6 bg-gray-100">
      <Text className="text-md font-bold text-orange-300 p-1 mt-4 mb-2 text-left">Your Monthly Habit Tracker</Text>
      <FlatList
        data={getCurrentHabits()}
        keyExtractor={(item) => item.habit}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <Text className="text-lg font-semibold text-gray-800">{item.habit}</Text>
            <Text className="text-gray-600">Daily Target: {item.dailyTarget}</Text>
            <Text className="text-gray-600">Monthly Target: {item.monthlyTarget}</Text>
            <TouchableOpacity
              onPress={() => handleHabitUpdate(item.habit, item.dailyTarget)}
              className={`p-2 mt-4 rounded-lg ${completedHabits[item.habit] ? 'bg-[#87abe5]' : 'bg-blue-500'}`}
            >
              <Text className="text-white text-center">
                {completedHabits[item.habit] ? 'Completed' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {renderHabitAnalytics()}
    </ScrollView>
  );
};

export default HabitTracker;
