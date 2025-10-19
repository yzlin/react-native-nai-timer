import NitroModules

class HybridNitroTimer: HybridNitroTimerSpec {
  private var bgTask: UIBackgroundTaskIdentifier = .invalid

  private var timeoutTimers: [Int: Timer] = [:]
  private var intervalTimers: [Int: Timer] = [:]
  private let serialQueue = DispatchQueue(label: "com.yzlin.nitrotimer.queue", qos: .userInitiated)

  private let idLock = NSLock()
  private var nextId: Int = 0

  private func generateId() -> Int {
    idLock.lock()
    defer { idLock.unlock() }
    let id = nextId
    nextId += 1
    return id
  }

  private func acquireBackgroundTask() {
    guard bgTask == .invalid else { return }

    bgTask = UIApplication.shared.beginBackgroundTask(withName: "NitroTimer") { [weak self] in
      self?.releaseBackgroundTask()
    }

    if bgTask == .invalid {
      print("[NitroTimer] Warning: Failed to acquire background task")
    }
  }

  private func releaseBackgroundTaskIfNeeded() {
    if timeoutTimers.isEmpty, intervalTimers.isEmpty {
      releaseBackgroundTask()
    }
  }

  private func releaseBackgroundTask() {
    guard bgTask != .invalid else { return }

    UIApplication.shared.endBackgroundTask(bgTask)
    bgTask = .invalid
  }

  func setTimeout(callback: @escaping (Double) -> Void, delay: Double) throws -> Double {
    let timerId = generateId()

    serialQueue.async { [weak self] in
      guard let self = self else { return }

      DispatchQueue.main.async {
        self.acquireBackgroundTask()

        let timer = Timer.scheduledTimer(withTimeInterval: delay / 1000.0, repeats: false) { [weak self] _ in
          guard let self = self else { return }

          callback(Double(timerId))

          self.serialQueue.async {
            DispatchQueue.main.async {
              self.timeoutTimers.removeValue(forKey: timerId)
              self.releaseBackgroundTaskIfNeeded()
            }
          }
        }

        self.timeoutTimers[timerId] = timer
      }
    }

    return Double(timerId)
  }

  func clearTimeout(id: Double) throws {
    let timerId = Int(id)

    serialQueue.async { [weak self] in
      guard let self = self else { return }

      DispatchQueue.main.async {
        if let timer = self.timeoutTimers[timerId] {
          timer.invalidate()
          self.timeoutTimers.removeValue(forKey: timerId)
          self.releaseBackgroundTaskIfNeeded()
        }
      }
    }
  }

  func setInterval(callback: @escaping (Double) -> Void, interval: Double) throws -> Double {
    let timerId = generateId()

    serialQueue.async { [weak self] in
      guard let self = self else { return }

      DispatchQueue.main.async {
        self.acquireBackgroundTask()

        let timer = Timer.scheduledTimer(withTimeInterval: interval / 1000.0, repeats: true) { [weak self] _ in
          guard let self = self else { return }

          callback(Double(timerId))
        }

        self.intervalTimers[timerId] = timer
      }
    }

    return Double(timerId)
  }

  func clearInterval(id: Double) throws {
    let timerId = Int(id)

    serialQueue.async { [weak self] in
      guard let self = self else { return }

      DispatchQueue.main.async {
        if let timer = self.intervalTimers[timerId] {
          timer.invalidate()
          self.intervalTimers.removeValue(forKey: timerId)
          self.releaseBackgroundTaskIfNeeded()
        }
      }
    }
  }

  func clearAllTimers() throws {
    serialQueue.sync {
      DispatchQueue.main.sync {
        // Invalidate all timers
        timeoutTimers.values.forEach { $0.invalidate() }
        intervalTimers.values.forEach { $0.invalidate() }

        // Clear collections
        timeoutTimers.removeAll()
        intervalTimers.removeAll()

        // Release background task
        releaseBackgroundTask()
      }
    }
  }

  deinit {
    do {
      try clearAllTimers()
    } catch {}
  }
}
