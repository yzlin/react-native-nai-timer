import { NitroModules } from "react-native-nitro-modules";

import type { NitroTimer as NitroTimerModule } from "./specs/NitroTimer.nitro";

const HybridNitroTimer =
  NitroModules.createHybridObject<NitroTimerModule>("NitroTimer");

export const NitroTimer = {
  setTimeout(callback: (id: number) => void, delay: number) {
    return HybridNitroTimer.setTimeout(callback, delay);
  },
  clearTimeout(id: number) {
    HybridNitroTimer.clearTimeout(id);
  },

  setInterval(callback: (id: number) => void, interval: number) {
    return HybridNitroTimer.setInterval(callback, interval);
  },
  clearInterval(id: number) {
    HybridNitroTimer.clearInterval(id);
  },

  clearAllTimers() {
    HybridNitroTimer.clearAllTimers();
  },
};
