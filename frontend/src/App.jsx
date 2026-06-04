import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'
import SizingGuide from './pages/SizingGuide';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Shop from './pages/Shop'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ProductDetail from './pages/ProductDetail'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminStaff from './pages/admin/AdminStaff'
import ForgotPassword from './pages/admin/ForgotPassword'
import ResetPassword from './pages/admin/ResetPassword'
import AcceptInvite from './pages/AcceptInvite'
import AdminLayout from './admin/AdminLayout'
import ProtectedRoute from './admin/ProtectedRoute'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppRoutes() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  const isInvite = pathname.startsWith('/invite/accept')

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="staff" element={<ProtectedRoute managerOnly><AdminStaff /></ProtectedRoute>} />
        </Route>
      </Routes>
    )
  }

  if (isInvite) {
    return (
      <Routes>
        <Route path="/invite/accept" element={<AcceptInvite />} />
      </Routes>
    )
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="pt-[98px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/sizing-guide" element={<SizingGuide />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  )
}
