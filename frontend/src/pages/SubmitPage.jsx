import { motion } from 'framer-motion'

function SubmitPage() {
  return (
    <div className="container-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="card text-center space-y-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-600 text-3xl">✓</motion.span>
        </motion.div>
        <h2 className="text-xl font-semibold">Submission Successful</h2>
        <p className="text-gray-600">Thank you for participating</p>
      </motion.div>
    </div>
  )
}

export default SubmitPage