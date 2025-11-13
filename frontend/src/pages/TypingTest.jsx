import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function TypingTest() {
  const navigate = useNavigate()
  const areaRef = useRef(null)
  const [startedAt, setStartedAt] = useState(null)
  const [endedAt, setEndedAt] = useState(null)
  const [typedCount, setTypedCount] = useState(0)
  const [backspaces, setBackspaces] = useState(0)
  const [holds, setHolds] = useState([])
  const [flights, setFlights] = useState([])
  const [progress, setProgress] = useState(0)
  const targetCount = 150
  const pending = useRef(new Map())
  const lastKeydown = useRef(null)
  const [prompt] = useState('Please type this text naturally and at your normal pace. The quick brown fox jumps over the lazy dog. Repeat or improvise until the progress reaches 100%.')

  useEffect(() => {
    const el = areaRef.current
    const handleKeyDown = (e) => {
      const t = performance.now()
      if (!startedAt) setStartedAt(t)
      const k = e.key
      const arr = pending.current.get(k) || []
      arr.push(t)
      pending.current.set(k, arr)
      if (lastKeydown.current !== null) {
        const d = t - lastKeydown.current
        setFlights((prev) => [...prev, d])
        if (d > 500) setProgress((p) => p)
      }
      lastKeydown.current = t
      const printable = k.length === 1 || k === ' ' || k === 'Enter'
      if (printable) {
        setTypedCount((c) => {
          const nc = c + 1
          setProgress(Math.min(100, Math.round((nc / targetCount) * 100)))
          return nc
        })
      }
      if (k === 'Backspace') setBackspaces((b) => b + 1)
    }
    const handleKeyUp = (e) => {
      const t = performance.now()
      const k = e.key
      const arr = pending.current.get(k) || []
      if (arr.length > 0) {
        const start = arr.pop()
        pending.current.set(k, arr)
        const hold = t - start
        setHolds((prev) => [...prev, hold])
      }
      setEndedAt(t)
    }
    el.addEventListener('keydown', handleKeyDown)
    el.addEventListener('keyup', handleKeyUp)
    return () => {
      el.removeEventListener('keydown', handleKeyDown)
      el.removeEventListener('keyup', handleKeyUp)
    }
  }, [startedAt])

  const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
  const entropy = (arr) => {
    if (!arr.length) return 0
    const min = Math.min(...arr)
    const max = Math.max(...arr)
    const bins = 8
    const width = (max - min) || 1
    const counts = new Array(bins).fill(0)
    for (const v of arr) {
      const idx = Math.min(bins - 1, Math.max(0, Math.floor(((v - min) / width) * bins)))
      counts[idx] += 1
    }
    const total = arr.length
    let h = 0
    for (const c of counts) {
      if (c === 0) continue
      const p = c / total
      h += -p * Math.log2(p)
    }
    return h
  }
  const drift = (arr) => {
    if (arr.length < 2) return 0
    const n = arr.length
    let sx = 0, sy = 0, sxx = 0, sxy = 0
    for (let i = 0; i < n; i++) {
      const x = i
      const y = arr[i]
      sx += x
      sy += y
      sxx += x * x
      sxy += x * y
    }
    const denom = n * sxx - sx * sx
    if (denom === 0) return 0
    const m = (n * sxy - sx * sy) / denom
    return m
  }

  const finish = () => {
    const start = startedAt || performance.now()
    const end = endedAt || performance.now()
    const durationMin = Math.max(0.001, (end - start) / 60000)
    const holdMean = mean(holds)
    const flightMean = mean(flights)
    const typingSpeed = typedCount / durationMin
    const errorRate = typedCount ? backspaces / typedCount : 0
    const pauseCount = flights.filter((f) => f > 500).length
    const driftOverTime = drift(flights)
    const rhythmEntropy = entropy(flights)
    const payload = {
      email: localStorage.getItem('email') || '',
      hold_mean: Number(holdMean.toFixed(2)),
      flight_mean: Number(flightMean.toFixed(2)),
      typing_speed: Number(typingSpeed.toFixed(2)),
      error_rate: Number(errorRate.toFixed(4)),
      pause_count: pauseCount,
      drift_over_time: Number(driftOverTime.toFixed(4)),
      rhythm_entropy: Number(rhythmEntropy.toFixed(4))
    }
    localStorage.setItem('metrics', JSON.stringify(payload))
    navigate('/survey')
  }

  return (
    <div className="container-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card space-y-4">
        <h2 className="text-xl font-semibold">Typing Test</h2>
        <p className="text-gray-600">{prompt}</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div className="bg-brand-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
        <textarea ref={areaRef} rows={8} className="input h-40" placeholder="Start typing here" />
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Progress {progress}%</div>
          <button className="btn" onClick={finish}>Next</button>
        </div>
      </motion.div>
    </div>
  )
}

export default TypingTest