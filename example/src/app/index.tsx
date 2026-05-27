import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NaiTimer } from "react-native-nai-timer";

export default function Page() {
  const [seconds, setSeconds] = useState(0);
  const [lastTickTimerId, setLastTickTimerId] = useState<number | null>(null);

  useEffect(() => {
    const timerId = NaiTimer.setInterval((id) => {
      setSeconds((currentSeconds) => currentSeconds + 1);
      setLastTickTimerId(id);
    }, 1000);

    return () => {
      NaiTimer.clearInterval(timerId);
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>React Native Nai Timer</Text>
      <Text style={styles.title}>Native interval demo</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Elapsed time</Text>
        <Text style={styles.seconds}>{seconds}s</Text>
        <Text style={styles.caption}>
          Timer ID: {lastTickTimerId ?? "waiting for first tick"}
        </Text>
      </View>
      <Text style={styles.description}>
        This screen uses NaiTimer.setInterval and NaiTimer.clearInterval from the
        package API. Leave the screen or reload the app to clear the native timer.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    elevation: 2,
    gap: 8,
    padding: 32,
    shadowColor: "#000000",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    width: "100%",
  },
  caption: {
    color: "#667085",
    fontSize: 14,
  },
  container: {
    alignItems: "center",
    backgroundColor: "#f4f7fb",
    flexGrow: 1,
    gap: 20,
    justifyContent: "center",
    padding: 24,
  },
  description: {
    color: "#344054",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  eyebrow: {
    color: "#475467",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  label: {
    color: "#475467",
    fontSize: 16,
  },
  seconds: {
    color: "#101828",
    fontSize: 72,
    fontVariant: ["tabular-nums"],
    fontWeight: "800",
  },
  title: {
    color: "#101828",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },
});
