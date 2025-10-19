import { useEffect } from "react";
import { Text, View } from "react-native";
import { NaiTimer } from "react-native-nai-timer";

export default function Page() {
  useEffect(() => {
    NaiTimer.setInterval(() => {
      console.log("Nai Timer Interval Triggered");
    }, 1000);

    return () => {
      NaiTimer.clearAllTimers();
    };
  }, []);

  return (
    <View>
      <Text>Welcome to React Native Nai Timer!</Text>
    </View>
  );
}
