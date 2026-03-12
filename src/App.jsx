import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import LegalNoticePage from './pages/LegalNoticePage'
import { Footer } from './components/Footer'
import { BottomAdBanner } from './components/BottomAdBanner'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/legal" element={<LegalNoticePage />} />
      </Routes>
      <Footer />
      <BottomAdBanner />
    </div>
  )
}
