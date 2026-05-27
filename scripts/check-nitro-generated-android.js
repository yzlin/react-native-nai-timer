const fs = require("node:fs");

const checks = [
  {
    path: "packages/react-native-nai-timer/nitrogen/generated/android/kotlin/com/margelo/nitro/naitimer/HybridNaiTimerSpec.kt",
    forbidden: [
      "updateNative(",
      "private var mHybridData: HybridData = initHybrid()",
      "private external fun initHybrid(): HybridData",
    ],
    required: [
      "protected open class CxxPart",
      "override fun createCxxPart(): CxxPart",
    ],
  },
  {
    path: "packages/react-native-nai-timer/nitrogen/generated/android/c++/JHybridNaiTimerSpec.hpp",
    forbidden: [
      "public jni::HybridClass<JHybridNaiTimerSpec, JHybridObject>",
      "instance->cthis()->shared()",
    ],
    required: [
      "struct JavaPart",
      "struct CxxPart",
      "public virtual JHybridObject",
    ],
  },
  {
    path: "packages/react-native-nai-timer/nitrogen/generated/android/c++/JHybridNaiTimerSpec.cpp",
    forbidden: [
      "JHybridNaiTimerSpec::registerNatives()",
      "static const auto method = javaClassStatic()->getMethod",
    ],
    required: [
      "JHybridNaiTimerSpec::CxxPart::registerNatives()",
      "getJHybridNaiTimerSpec()",
      "_javaPart->javaClassStatic()->getMethod",
    ],
  },
  {
    path: "packages/react-native-nai-timer/nitrogen/generated/android/NaiTimerOnLoad.cpp",
    forbidden: [
      "JHybridNaiTimerSpec::registerNatives()",
      "DefaultConstructableObject<JHybridNaiTimerSpec::javaobject>",
      "instance->cthis()->shared()",
    ],
    required: [
      "JHybridNaiTimerSpec::CxxPart::registerNatives()",
      "JHybridNaiTimerSpecImpl",
      "getJHybridNaiTimerSpec()",
    ],
  },
];

let failed = false;

for (const check of checks) {
  const content = fs.readFileSync(check.path, "utf8");

  for (const forbidden of check.forbidden) {
    if (content.includes(forbidden)) {
      console.error(
        `${check.path}: forbidden stale Nitro Android pattern: ${forbidden}`
      );
      failed = true;
    }
  }

  for (const required of check.required) {
    if (!content.includes(required)) {
      console.error(
        `${check.path}: missing Nitro 0.35 Android pattern: ${required}`
      );
      failed = true;
    }
  }
}

process.exit(failed ? 1 : 0);
