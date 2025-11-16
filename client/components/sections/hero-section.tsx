"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      title: "Rent Your Dream Car",
      subtitle: "Premium vehicles at affordable prices",
      image: "/hero-car-1.jpg",
      cta: "Browse Cars"
    },
    {
      title: "Flexible Rental Plans",
      subtitle: "Hourly, daily, or weekly rentals available",
      image: "/hero-car-2.jpg",
      cta: "View Plans"
    },
    {
      title: "24/7 Customer Support",
      subtitle: "We're here to help anytime you need",
      image: "/hero-car-3.jpg",
      cta: "Contact Us"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="relative h-[600px] overflow-hidden rounded-2xl mb-16 shadow-xl">
      {/* Background slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up drop-shadow-lg">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 animate-fade-in-up animation-delay-200 drop-shadow-md">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex gap-4 animate-fade-in-up animation-delay-400">
              <Link
                href="/#cars"
                className="px-8 py-4 bg-white text-primary rounded-lg font-bold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
              >
                {slides[currentSlide].cta}
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-10" : "bg-white/60 hover:bg-white/80 w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
