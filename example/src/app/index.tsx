import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
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
    <ScrollView>
      <Text>Welcome to React Native Nai Timer!</Text>
      <View style={{ height: 1000, backgroundColor: "green" }} />
    </ScrollView>
  );
}
