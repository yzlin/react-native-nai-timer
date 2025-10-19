import { useEffect } from "react";
import { Text, View } from "react-native";
import { NitroTimer } from "react-native-nitro-timer";

export default function Page() {
  useEffect(() => {
    NitroTimer.setInterval(() => {
      console.log("Nitro Timer Interval Triggered");
    }, 1000);

    return () => {
      NitroTimer.clearAllTimers();
    };
  }, []);

  return (
    <View>
      <Text>Welcome to React Native Nitro Timer!</Text>
    </View>
  );
}
