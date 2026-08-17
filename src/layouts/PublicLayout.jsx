import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import WhatsAppButton from '../components/WhatsAppButton'
import ScrollToTop from '../components/ScrollToTop'

export default function PublicLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-ivory pb-16 sm:pb-0">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <Header />
      {/* Header is fixed so it can float transparently over the homepage
          hero; every other page needs top padding to clear it. */}
      <main id="main-content" className={`flex-1 ${isHome ? '' : 'pt-28'}`}>
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
      <WhatsAppButton floating />
    </div>
  )
}
