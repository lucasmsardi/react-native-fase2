import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // State for battery, time, and network
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [networkStatus, setNetworkStatus] = useState<string>('Unknown');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    const fetchBattery = async () => {
      const level = await DeviceInfo.getBatteryLevel();
      setBatteryLevel(Math.round(level * 100));
    };
    fetchBattery();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkStatus(state.isConnected ? 'Online' : 'Offline');
    });

    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timeInterval);
    };
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ paddingTop: 40, paddingBottom: 10, backgroundColor: 'black' }}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <Text style={{ color: 'white' }}>Time: {currentTime}</Text>
          <Text style={{ color: 'white' }}>Battery: {batteryLevel !== null ? `${batteryLevel}%` : 'Loading...'}</Text>
          <Text style={{ color: 'white' }}>Network: {networkStatus}</Text>
        </View>
      </View>

      <Slot />
    </ThemeProvider>
  );
}
