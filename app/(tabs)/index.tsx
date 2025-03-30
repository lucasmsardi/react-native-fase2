import { useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function HomeScreen() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    const fetchBattery = async () => {
      const level = await DeviceInfo.getBatteryLevel(); 
      setBatteryLevel(Math.round(level * 100));
    };

    fetchBattery();
  }, []);
  return (
    <View>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Text>Battery Level: {batteryLevel}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: wp('80%'), 
    height: hp('50%'),
  },
});
