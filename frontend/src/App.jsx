import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import EnterEmail from './pages/EnterEmail.jsx'
import Consent from './pages/Consent.jsx'
import TypingTest from './pages/TypingTest.jsx'
import FatigueSurvey from './pages/FatigueSurvey.jsx'
import SubmitPage from './pages/SubmitPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/email" replace />} />
        <Route path="/email" element={<EnterEmail />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/test" element={<TypingTest />} />
        <Route path="/survey" element={<FatigueSurvey />} />
        <Route path="/submitted" element={<SubmitPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App