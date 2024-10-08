import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DailyJournal from './dailyjournal';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Journal" component={DailyJournal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


