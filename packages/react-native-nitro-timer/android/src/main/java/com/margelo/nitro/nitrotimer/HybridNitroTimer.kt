package com.margelo.nitro.nitrotimer

import android.annotation.SuppressLint
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import android.util.Log
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.NitroModules

@DoNotStrip
class HybridNitroTimer : HybridNitroTimerSpec() {
  private val context = NitroModules.applicationContext
    ?: throw IllegalStateException("NitroModules.applicationContext is null")

  private val handler = Handler(Looper.getMainLooper())
  private val powerManager =
    context.getSystemService(android.content.Context.POWER_SERVICE) as PowerManager

  @SuppressLint("InvalidWakeLockTag")
  private val wakeLock: PowerManager.WakeLock =
    powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "NitroTimer")

  private val timeoutRunnableMap = HashMap<Int, Runnable>()
  private val intervalRunnableMap = HashMap<Int, Runnable>()

  // Helpers
  @SuppressLint("WakelockTimeout")
  private fun acquireWakeLock() {
    if (!wakeLock.isHeld) {
      wakeLock.acquire()
    }
  }

  private fun releaseWakeLockIfNeeded() {
    if (timeoutRunnableMap.isEmpty() && intervalRunnableMap.isEmpty() && wakeLock.isHeld) {
      wakeLock.release()
    }
  }

  // Thread-safe auto-incrementing ID generator
  private val idGenerator = java.util.concurrent.atomic.AtomicInteger(0)
  private fun generateId(): Int = idGenerator.incrementAndGet()

  override fun setTimeout(callback: (id: Double) -> Unit, delay: Double): Double {
    val timerId = generateId()

    acquireWakeLock()
    val runnable = Runnable {
      try {
        callback(timerId.toDouble())
      } catch (e: Exception) {
        Log.e("NitroTimer", "Callback error in setTimeout($timerId): ${e.message}", e)
      }
      timeoutRunnableMap.remove(timerId)
      releaseWakeLockIfNeeded()
    }

    timeoutRunnableMap[timerId] = runnable
    handler.postDelayed(runnable, delay.toLong())

    return timerId.toDouble()
  }

  override fun clearTimeout(id: Double) {
    val timerId = id.toInt()
    timeoutRunnableMap[timerId]?.let { handler.removeCallbacks(it) }
    timeoutRunnableMap.remove(timerId)
    releaseWakeLockIfNeeded()
  }

  override fun setInterval(callback: (id: Double) -> Unit, interval: Double): Double {
    val timerId = generateId()

    acquireWakeLock()
    val runnable = object : Runnable {
      override fun run() {
        try {
          callback(timerId.toDouble())
        } catch (e: Exception) {
          Log.e(
            "NitroTimer", "Callback error in setInterval($timerId): ${e.message}", e
          )
        }
        handler.postDelayed(this, interval.toLong())
      }
    }

    intervalRunnableMap[timerId] = runnable
    handler.postDelayed(runnable, interval.toLong())

    return timerId.toDouble()
  }

  override fun clearInterval(id: Double) {
    val timerId = id.toInt()
    intervalRunnableMap[timerId]?.let { handler.removeCallbacks(it) }
    intervalRunnableMap.remove(timerId)
    releaseWakeLockIfNeeded()
  }

  override fun clearAllTimers() {
    timeoutRunnableMap.values.forEach { handler.removeCallbacks(it) }
    intervalRunnableMap.values.forEach { handler.removeCallbacks(it) }
    timeoutRunnableMap.clear()
    intervalRunnableMap.clear()
    if (wakeLock.isHeld) {
      wakeLock.release()
    }
  }

  protected fun finalize() {
    clearAllTimers()
  }
}
