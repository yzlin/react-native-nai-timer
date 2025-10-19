import type { HybridObject } from "react-native-nitro-modules";

export interface NaiTimer
  extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
  setTimeout(callback: (id: number) => void, delay: number): number;
  clearTimeout(id: number): void;

  setInterval(callback: (id: number) => void, interval: number): number;
  clearInterval(id: number): void;

  clearAllTimers(): void;
}
