import NitroModules

class HybridNaiTimer: HybridNaiTimerSpec {
  private var bgTask: UIBackgroundTaskIdentifier = .invalid

  private var timeoutTimers: [Int: DispatchSourceTimer] = [:]
  private var intervalTimers: [Int: DispatchSourceTimer] = [:]
  private let serialQueue = DispatchQueue(label: "com.yzlin.naitimer.queue", qos: .userInitiated)

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

    bgTask = UIApplication.shared.beginBackgroundTask(withName: "NaiTimer") { [weak self] in
      self?.releaseBackgroundTask()
    }

    if bgTask == .invalid {
      print("[NaiTimer] Warning: Failed to acquire background task")
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

      self.acquireBackgroundTask()

      let timer = DispatchSource.makeTimerSource(queue: self.serialQueue)
      timer.schedule(deadline: .now() + delay / 1000.0)
      timer.setEventHandler { [weak self] in
        guard let self = self else { return }

        callback(Double(timerId))

        self.serialQueue.async {
          self.timeoutTimers[timerId]?.cancel()
          self.timeoutTimers.removeValue(forKey: timerId)
          self.releaseBackgroundTaskIfNeeded()
        }
      }
      self.timeoutTimers[timerId] = timer
      timer.resume()
    }

    return Double(timerId)
  }

  func clearTimeout(id: Double) throws {
    let timerId = Int(id)

    serialQueue.async { [weak self] in
      guard let self = self else { return }

      if let timer = self.timeoutTimers[timerId] {
        timer.cancel()
        self.timeoutTimers.removeValue(forKey: timerId)
        self.releaseBackgroundTaskIfNeeded()
      }
    }
  }

  func setInterval(callback: @escaping (Double) -> Void, interval: Double) throws -> Double {
    let timerId = generateId()

    serialQueue.async { [weak self] in
      guard let self = self else { return }

      self.acquireBackgroundTask()

      let timer = DispatchSource.makeTimerSource(queue: self.serialQueue)
      timer.schedule(deadline: .now() + interval / 1000.0,
                     repeating: interval / 1000.0)
      timer.setEventHandler { [weak self] in
        guard let _ = self else { return }
        callback(Double(timerId))
      }

      self.intervalTimers[timerId] = timer
      timer.resume()
    }

    return Double(timerId)
  }

  func clearInterval(id: Double) throws {
    let timerId = Int(id)

    serialQueue.async { [weak self] in
      guard let self = self else { return }

      if let timer = self.intervalTimers[timerId] {
        timer.cancel()
        self.intervalTimers.removeValue(forKey: timerId)
        self.releaseBackgroundTaskIfNeeded()
      }
    }
  }

  func clearAllTimers() throws {
    serialQueue.async { [weak self] in
      guard let self = self else { return }

      // Invalidate all timers
      self.timeoutTimers.values.forEach { $0.cancel() }
      self.intervalTimers.values.forEach { $0.cancel() }

      // Clear collections
      self.timeoutTimers.removeAll()
      self.intervalTimers.removeAll()

      // Release background task
      self.releaseBackgroundTask()
    }
  }

  deinit {
    do {
      try clearAllTimers()
    } catch {}
  }
}
