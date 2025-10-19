import { NitroModules } from "react-native-nitro-modules";

import type { NaiTimer as NaiTimerModule } from "./specs/NaiTimer.nitro";

const HybridNaiTimer =
  NitroModules.createHybridObject<NaiTimerModule>("NaiTimer");

export const NaiTimer = {
  setTimeout(callback: (id: number) => void, delay: number) {
    return HybridNaiTimer.setTimeout(callback, delay);
  },
  clearTimeout(id: number) {
    HybridNaiTimer.clearTimeout(id);
  },

  setInterval(callback: (id: number) => void, interval: number) {
    return HybridNaiTimer.setInterval(callback, interval);
  },
  clearInterval(id: number) {
    HybridNaiTimer.clearInterval(id);
  },

  clearAllTimers() {
    HybridNaiTimer.clearAllTimers();
  },
};
