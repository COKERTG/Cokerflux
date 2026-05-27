import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CurrencyProvider } from './context/CurrencyContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Shop from './pages/Shop'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ProductDetail from './pages/ProductDetail'

export default function App() {
  return (
    <CurrencyProvider>
    <BrowserRouter>
      <Navbar />
      <div className="pt-[98px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
    </CurrencyProvider>
  )
}