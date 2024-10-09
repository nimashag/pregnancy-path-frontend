import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DailyJournal from './dailyjournal';
import JournalEntryDetail from './viewmemory';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="dailyjournal" component={DailyJournal} />
        {/* <Stack.Screen name="journalEntryDetail" component={JournalEntryDetail} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


