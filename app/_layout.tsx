import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (

    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="/index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="journal/creatememory" options={{ headerShown: false }} />
        <Stack.Screen name="journal/dailyjournal" options={{ headerShown: false }} />
        <Stack.Screen name="journal/journalEntryDetail" options={{ headerShown: false }} />
        <Stack.Screen name="journal/favourites" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />


        <Stack.Screen name="vaccination/vacciguide" />
        <Stack.Screen name="vaccination/vaccimain" />
        <Stack.Screen name="vaccination/vaccilog" />
        <Stack.Screen name="vaccination/createvaccischedule" />
        <Stack.Screen name="vaccination/viewvaccischedule" />
        <Stack.Screen name="vaccination/vaccimonthtracker" />

      </Stack>
    </ThemeProvider>
  );
}
