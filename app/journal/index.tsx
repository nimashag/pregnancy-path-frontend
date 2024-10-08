import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PregnantJournalScreen from './dailyjournal';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Journal" component={PregnantJournalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
