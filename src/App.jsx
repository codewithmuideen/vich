import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/admin/AdminLayout'
import Loader from './components/Loader'
import PageTransition from './components/PageTransition'
import { AdminAuthProvider } from './context/AdminAuthContext'
import ProtectedRoute from './components/admin/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Gallery = lazy(() => import('./pages/Gallery'))
const GalleryDetail = lazy(() => import('./pages/GalleryDetail'))
const About = lazy(() => import('./pages/About'))
const Reviews = lazy(() => import('./pages/Reviews'))
const Contact = lazy(() => import('./pages/Contact'))
const BookAppointment = lazy(() => import('./pages/BookAppointment'))
const ManageBooking = lazy(() => import('./pages/ManageBooking'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Journal = lazy(() => import('./pages/Journal'))
const JournalDetail = lazy(() => import('./pages/JournalDetail'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const NotFound = lazy(() => import('./pages/NotFound'))

const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminAppointments = lazy(() => import('./pages/admin/Appointments'))
const AdminServices = lazy(() => import('./pages/admin/Services'))
const AdminCategories = lazy(() => import('./pages/admin/Categories'))
const AdminAvailability = lazy(() => import('./pages/admin/Availability'))
const AdminBlockedDates = lazy(() => import('./pages/admin/BlockedDates'))
const AdminGallery = lazy(() => import('./pages/admin/Gallery'))
const AdminReviews = lazy(() => import('./pages/admin/Reviews'))
const AdminCustomers = lazy(() => import('./pages/admin/Customers'))
const AdminJournal = lazy(() => import('./pages/admin/Journal'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Wrap><Home /></Wrap>} />
          <Route path="/services" element={<Wrap><Services /></Wrap>} />
          <Route path="/services/:slug" element={<Wrap><ServiceDetail /></Wrap>} />
          <Route path="/gallery" element={<Wrap><Gallery /></Wrap>} />
          <Route path="/gallery/:slug" element={<Wrap><GalleryDetail /></Wrap>} />
          <Route path="/about" element={<Wrap><About /></Wrap>} />
          <Route path="/reviews" element={<Wrap><Reviews /></Wrap>} />
          <Route path="/contact" element={<Wrap><Contact /></Wrap>} />
          <Route path="/book-appointment" element={<Wrap><BookAppointment /></Wrap>} />
          <Route path="/manage-booking" element={<Wrap><ManageBooking /></Wrap>} />
          <Route path="/faq" element={<Wrap><FAQ /></Wrap>} />
          <Route path="/journal" element={<Wrap><Journal /></Wrap>} />
          <Route path="/journal/:slug" element={<Wrap><JournalDetail /></Wrap>} />
          <Route path="/privacy-policy" element={<Wrap><PrivacyPolicy /></Wrap>} />
          <Route path="/cookie-policy" element={<Wrap><CookiePolicy /></Wrap>} />
          <Route path="/terms" element={<Wrap><Terms /></Wrap>} />
          <Route path="*" element={<Wrap><NotFound /></Wrap>} />
        </Route>

        <Route path="/admin/login" element={<Wrap><AdminLogin /></Wrap>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="availability" element={<AdminAvailability />} />
          <Route path="blocked-dates" element={<AdminBlockedDates />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="journal" element={<AdminJournal />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function Wrap({ children }) {
  return (
    <Suspense fallback={<Loader />}>
      <PageTransition>{children}</PageTransition>
    </Suspense>
  )
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AnimatedRoutes />
    </AdminAuthProvider>
  )
}
