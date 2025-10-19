"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
let pkg = {
    name: "react-native-nitro-timer",
};
try {
    pkg = require("react-native-nitro-timer/package.json");
}
catch {
    // empty catch block
}
const withBackgroundFetch = (config) => config_plugins_1.AndroidConfig.Permissions.withPermissions(config, [
    "android.permission.WAKE_LOCK",
]);
exports.default = (0, config_plugins_1.createRunOncePlugin)(withBackgroundFetch, pkg.name, pkg.version);
