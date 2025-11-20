"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { getUser, clearUser, isAdmin } from "@/lib/auth"
import type { User } from "@/lib/auth"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    clearUser()
    setUser(null)
    setIsOpen(false)
    router.push("/login")
  }

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

  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <header className="fixed top-0 w-full gradient-header backdrop-blur-md bg-surface/95 border-b border-border/40 z-50 shadow-lg">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl hover:text-accent transition-all duration-300 group">
            <div className="relative w-11 h-11 group-hover:scale-105 transition-transform duration-300">
              <Image 
                src="/logo.svg" 
                alt="CarRent Logo" 
                width={44} 
                height={44}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl">CarRent</span>
          </Link>

          <nav className="hidden md:flex gap-8 items-center">
            <a href="/#cars" onClick={handleBrowseCars} className="font-medium hover:text-accent transition-all duration-200 relative group cursor-pointer">
              <span>Browse Cars</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
            </a>
            <Link href="/services" className="font-medium hover:text-accent transition-all duration-200 relative group">
              <span>Services</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user && (
              <Link href="/bookings" className="font-medium hover:text-accent transition-all duration-200 relative group">
                <span>My Bookings</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            {isAdmin(user) && (
              <Link href="/admin" className="font-medium hover:text-accent transition-all duration-200 relative group">
                <span>Admin</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            <Link href="/about" className="font-medium hover:text-accent transition-all duration-200 relative group">
              <span>About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/contact" className="font-medium hover:text-accent transition-all duration-200 relative group">
              <span>Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  <span className="text-sm font-semibold text-white">{user.username}</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-surface border border-border/40 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-border/40 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Signed in as</p>
                      <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-destructive/10 text-destructive font-semibold transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              !isAuthPage && (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    className="px-6 py-2.5 font-semibold hover:bg-muted/20 rounded-xl transition-all duration-200 border-2 border-border/40 hover:border-accent/50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
