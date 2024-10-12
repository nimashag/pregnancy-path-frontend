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
        <Stack.Screen name="main/home" options={{ headerShown: false }} />
        <Stack.Screen name="tracker/HealthTracker"  options={{headerShown: false}}/>
        <Stack.Screen name="tracker/HabitTracker" options={{headerShown: false}}/>
        <Stack.Screen name="+not-found" />

        {/* Startup Routes */}
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="moodTracker/Moods" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />

        {/* Home Routes */}
        <Stack.Screen name="main/samplehome" options={{ headerShown: false }}/>

        {/* Journal Routes */}
        <Stack.Screen name="journal/creatememory" options={{ headerShown: false }} />
        <Stack.Screen name="journal/dailyjournal" options={{ headerShown: false }} />
        <Stack.Screen name="journal/updatememory" options={{ headerShown: false }} />
        <Stack.Screen name="journal/viewmemory" options={{ headerShown: false }} />
        <Stack.Screen name="journal/favourites" options={{ headerShown: false }} />

        {/* Vaccination Routes */}
        <Stack.Screen name="vaccination/vacciguide" options={{ headerShown: false }}/>
        <Stack.Screen name="vaccination/vaccimain" options={{ headerShown: false }}/>
        <Stack.Screen name="vaccination/vaccilog" options={{ headerShown: false }}/>
        <Stack.Screen name="vaccination/createvaccischedule" options={{ headerShown: false }}/>
        <Stack.Screen name="vaccination/viewvaccischedule" options={{ headerShown: false }}/>
        <Stack.Screen name="vaccination/vaccimonthtracker" options={{ headerShown: false }}/>

        {/* Vaccination Routes */}
        <Stack.Screen name="clinic/CreateClinicSchedule" options={{ headerShown: true }}/>

        {/* Startup Pages */}
        <Stack.Screen name="startup/startup1"  options={{headerShown: false}}/>
        <Stack.Screen name="startup/startup2"  options={{headerShown: false}}/>
        <Stack.Screen name="startup/startup3"  options={{headerShown: false}}/>
        <Stack.Screen name="startup/startup4"  options={{headerShown: false}}/>

      </Stack>
    </ThemeProvider>
  );
}
