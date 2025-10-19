#include <jni.h>
#include "NitroTimerOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::nitrotimer::initialize(vm);
}
