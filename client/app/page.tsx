"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { ServicesSection } from "@/components/sections/services-section"
import { ReviewsSection } from "@/components/sections/reviews-section"
import { ApiClient } from "@/lib/api"
import { DateTimePicker } from "@/components/ui/datetime-picker"
import Link from "next/link"
import moment from "moment"

interface Car {
  _id: string
  name: string
  image: string
  fuelType: string
  capacity: number
  rentPerHour: number
  bookedTimeSlots?: Array<{ from: string; to: string }>
}

export default function Home() {
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStartDateTime, setFilterStartDateTime] = useState<Date | null>(null)
  const [filterEndDateTime, setFilterEndDateTime] = useState<Date | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [showCarsSection, setShowCarsSection] = useState(false)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        const response = await ApiClient.get<{ cars: Car[] }>("/api/cars/getallcars", false)
        if (response.success) {
          const carsList = response.cars || []
          setCars(carsList)
          setFilteredCars(carsList)
        } else {
          setError(response.error || "Failed to load cars")
        }
      } catch (err) {
        setError("Failed to load cars. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCars()

    // Listen for custom event from header/footer
    const handleShowCars = () => {
      setShowCarsSection(true)
      setTimeout(() => {
        const carsSection = document.getElementById('cars')
        if (carsSection) {
          const headerHeight = 80 // header height in pixels
          const elementPosition = carsSection.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    }

    window.addEventListener('showCarsSection', handleShowCars)

    // Check if URL has hash on initial load
    if (window.location.hash === '#cars') {
      handleShowCars()
    }

    return () => {
      window.removeEventListener('showCarsSection', handleShowCars)
    }
  }, [])

  const handleFilter = () => {
    if (!filterStartDateTime || !filterEndDateTime) {
      setFilteredCars(cars)
      return
    }

    const selectedFrom = moment(filterStartDateTime)
    const selectedTo = moment(filterEndDateTime)

    if (selectedTo.isSameOrBefore(selectedFrom)) {
      setError("End date/time must be after start date/time")
      return
    }

    const available = cars.filter((car) => {
      let isAvailable = true

      if (car.bookedTimeSlots && car.bookedTimeSlots.length > 0) {
        for (const booking of car.bookedTimeSlots) {
          const bookingFrom = moment(booking.from, "DD/MM/YYYY HH:mm")
          const bookingTo = moment(booking.to, "DD/MM/YYYY HH:mm")

          const hasOverlap =
            selectedFrom.isBetween(bookingFrom, bookingTo, undefined, "[]") ||
            selectedTo.isBetween(bookingFrom, bookingTo, undefined, "[]") ||
            bookingFrom.isBetween(selectedFrom, selectedTo, undefined, "[]") ||
            bookingTo.isBetween(selectedFrom, selectedTo, undefined, "[]")

          if (hasOverlap) {
            isAvailable = false
            break
          }
        }
      }

      return isAvailable
    })

    setFilteredCars(available)
    setShowFilter(false)
  }

  const clearFilter = () => {
    setFilterStartDateTime(null)
    setFilterEndDateTime(null)
    setFilteredCars(cars)
    setError(null)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen gradient-surface pt-20">
        {/* Hero Section */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-8">
          <HeroSection />
          
          {/* Browse Cars Button - Only show when cars section is hidden */}
          {!showCarsSection && (
            <div className="flex justify-center mt-12 mb-8">
              <button
                onClick={() => setShowCarsSection(true)}
                className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg transform hover:-translate-y-1 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Browse Cars
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Cars Section - Only show when button is clicked */}
        {showCarsSection && (
          <div id="cars" className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-16 animate-fade-in-down">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">Available Cars</h2>
                <p className="text-lg text-muted-foreground">
                  Choose from our premium selection of vehicles
                </p>
              </div>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-bold shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter by Date
              </button>
            </div>

            {/* Filter Panel */}
            {showFilter && (
              <div className="bg-surface rounded-lg card-shadow p-6 mb-8 animate-fade-in-down">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                  <DateTimePicker
                    date={filterStartDateTime || undefined}
                    setDate={(date) => setFilterStartDateTime(date || null)}
                    label="Start Date & Time"
                    minDate={new Date()}
                  />
                  <DateTimePicker
                    date={filterEndDateTime || undefined}
                    setDate={(date) => setFilterEndDateTime(date || null)}
                    label="End Date & Time"
                    minDate={filterStartDateTime || new Date()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleFilter}
                      className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md"
                    >
                      Search
                    </button>
                    <button
                      onClick={clearFilter}
                      className="px-5 py-3 border-2 border-border rounded-lg hover:bg-muted transition-all duration-200 font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-8 flex items-center gap-3 animate-fade-in">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Cars Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-96 animate-pulse card-shadow" />
                ))}
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="text-center py-20 bg-surface rounded-lg card-shadow">
                <svg className="w-24 h-24 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl font-semibold text-muted-foreground mb-2">No cars available</p>
                <p className="text-muted-foreground">
                  {filterStartDateTime || filterEndDateTime
                    ? "Try adjusting your search dates"
                    : "Check back later for available vehicles"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCars.map((car) => (
                  <Link key={car._id} href={`/booking/${car._id}`}>
                    <div className="group bg-surface rounded-lg overflow-hidden card-shadow hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                      <div className="h-56 bg-gradient-to-br from-accent/20 to-accent/10" />
                      <div className="relative h-56 bg-muted overflow-hidden -mt-56">
                        <img
                          src={car.image || "/luxury-car-sleek-design.png"}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                        <p className="text-muted-foreground mb-3">{car.fuelType} • {car.capacity} Seats</p>
                        <p className="text-sm text-accent mb-4 font-medium">₹{car.rentPerHour}/hr</p>
                        <button className="w-full px-5 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Book Now
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Services Section */}
        <ServicesSection />

        {/* Reviews Section */}
        <ReviewsSection />
      </main>
      <Footer />
    </>
  )
}
