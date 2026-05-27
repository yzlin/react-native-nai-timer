# react-native-nai-timer

Native timer module for React Native apps using Nitro Modules.

## Support

- Expo SDK 56 and newer
- iOS and Android native builds
- Requires `react-native-nitro-modules`
- Not supported in Expo Go because this package includes native code

## Installation

```sh
bun add react-native-nai-timer react-native-nitro-modules
```

For npm projects:

```sh
npm install react-native-nai-timer react-native-nitro-modules
```

Then generate native projects or rebuild your development client:

```sh
npx expo prebuild
npx expo run:ios
npx expo run:android
```

## Usage

```tsx
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { NaiTimer } from "react-native-nai-timer";

export function TimerDemo() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerId = NaiTimer.setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => {
      NaiTimer.clearInterval(timerId);
    };
  }, []);

  return <Text>{seconds}s</Text>;
}
```

Available methods:

- `NaiTimer.setTimeout(callback, delay)`
- `NaiTimer.clearTimeout(id)`
- `NaiTimer.setInterval(callback, interval)`
- `NaiTimer.clearInterval(id)`
- `NaiTimer.clearAllTimers()`

## Example app

The repository includes an Expo example app with a visible timer demo:

```sh
bun install
bun run example start
```

Use a development build or native simulator/device. Expo Go cannot load this native module.

## Validation

From the repository root:

```sh
bun run lint
bun run typecheck
bun run build
bun run prebuild
bun run pods
bun run android:gradle
```

Notes:

- `bun run prebuild` regenerates `example/ios` and `example/android` for local validation.
- The native example folders are ignored and should not be committed.
- `bun run pods` requires CocoaPods and an iOS prebuild.
- `bun run android:gradle` requires an Android prebuild and local Android build tooling.
