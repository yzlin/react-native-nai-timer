import {
  AndroidConfig,
  type ConfigPlugin,
  createRunOncePlugin,
} from "expo/config-plugins";

let pkg: { name: string; version?: string } = {
  name: "react-native-nai-timer",
};

try {
  pkg = require("react-native-nai-timer/package.json");
} catch {
  // empty catch block
}

const withBackgroundFetch: ConfigPlugin = (config) =>
  AndroidConfig.Permissions.withPermissions(config, [
    "android.permission.WAKE_LOCK",
  ]);

export default createRunOncePlugin(withBackgroundFetch, pkg.name, pkg.version);
