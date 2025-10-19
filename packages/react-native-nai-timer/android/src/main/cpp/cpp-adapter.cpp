#include <jni.h>
#include "NaiTimerOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro:naitimer::initialize(vm);
}
