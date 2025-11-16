"use client"

import { useRouter, usePathname } from "next/navigation"

export function Footer() {
  const router = useRouter()
  const pathname = usePathname()

  const handleBrowseCars = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (pathname === "/") {
      // If on homepage, trigger the cars section
      const event = new CustomEvent('showCarsSection')
      window.dispatchEvent(event)
    } else {
      // Navigate to home with hash
      router.push("/#cars")
    }
  }

  return (
    <footer className="gradient-header text-white mt-auto border-t border-white/10">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-xl mb-4 text-white">CarRent</h3>
            <p className="text-white/80">Premium car rental service for your journey.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3 text-white/80">
              <li>
                <a href="/#cars" onClick={handleBrowseCars} className="hover:text-accent transition-all duration-200 inline-flex items-center gap-2 group cursor-pointer">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Browse Cars</span>
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="/bookings" className="hover:text-accent transition-all duration-200 inline-flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">My Bookings</span>
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-accent transition-all duration-200 inline-flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">About</span>
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Support</h4>
            <ul className="space-y-3 text-white/80">
              <li>
                <a href="/contact" className="hover:text-accent transition-all duration-200 inline-flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Contact</span>
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-all duration-200 inline-flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">FAQ</span>
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Contact</h4>
            <p className="text-white/80">Email: support@carrent.in</p>
            <p className="text-white/80">Phone: +91 98765 43210</p>
            <p className="text-white/80 mt-2">42, MG Road, Koramangala</p>
            <p className="text-white/80">Bangalore, Karnataka 560034</p>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center text-white/80">
          <p>&copy; 2025 CarRent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
