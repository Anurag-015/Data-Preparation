import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function Consent() {
  const navigate = useNavigate()
  const agree = () => {
    navigate('/test')
  }
  return (
    <div className="container-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Consent</h2>
          <p className="text-gray-600">By proceeding you agree to participate in a typing study. No sensitive data beyond your Gmail and typing metrics will be collected.</p>
        </div>
        <button className="btn" onClick={agree}>I Agree</button>
      </motion.div>
    </div>
  )
}

export default Consent