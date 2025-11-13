import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function FatigueSurvey() {
  const [level, setLevel] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const navigate = useNavigate()
  const baseUrl = 'https://data-preparation.onrender.com/'

  useEffect(() => {
    const m = localStorage.getItem('metrics')
    if (m) setMetrics(JSON.parse(m))
  }, [])

  const submit = async () => {
    if (!metrics) return
    setSubmitting(true)
    try {
      const payload = { ...metrics, fatigue_level: level }
      await axios.post(`${baseUrl}/api/submit`, payload)
      navigate('/submitted')
    } catch (e) {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card space-y-6">
        <h2 className="text-xl font-semibold">Fatigue Level</h2>
        <div className="space-y-2">
          <input type="range" min="0" max="2" step="1" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full" list="fatigue-marks" />
          <datalist id="fatigue-marks">
            <option value="0" label="Low" />
            <option value="1" label="Medium" />
            <option value="2" label="High" />
          </datalist>
          <div className="text-gray-600">Selected {level === 0 ? 'Low' : level === 1 ? 'Medium' : 'High'} ({level})</div>
        </div>
        <button className="btn" onClick={submit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
      </motion.div>
    </div>
  )
}

export default FatigueSurvey