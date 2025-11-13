import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function EnterEmail() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const baseUrl = 'https://data-preparation.onrender.com'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await axios.post(`${baseUrl}/api/get_next_session`, { email })
      localStorage.setItem('email', email)
      localStorage.setItem('session_number', String(r.data.session_number))
      navigate('/consent')
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <div className="container-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Typing Fatigue Study</h1>
          <p className="text-gray-600">Enter your Gmail to start</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" type="email" value={email} placeholder="gmail@example.com" onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Loading...' : 'Next'}</button>
        </form>
      </motion.div>
    </div>
  )
}

export default EnterEmail
