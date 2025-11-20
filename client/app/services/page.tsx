"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ApiClient } from "@/lib/api"
import Link from "next/link"

interface Car {
  _id: string
  name: string
  image: string
  fuelType: string
  capacity: number
  rentPerHour: number
}

export default function ServicesPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCars, setShowCars] = useState(false)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        const response = await ApiClient.get<{ cars: Car[] }>("/api/cars/getallcars", false)
        if (response.success) {
          setCars(response.cars || [])
        } else {
          setError(response.error || "Failed to load cars")
        }
      } catch (err) {
        setError("Failed to load cars")
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  const services = [
    {
      name: "Airport Drop",
      description: "Comfortable rides to and from airport",
      note: "Min 5 hrs of booking required",
    },
    {
      name: "City Tours",
      description: "Explore the city with our premium fleet",
      note: "Daily limit 300 kms",
    },
    {
      name: "Weekend Getaway",
      description: "Perfect for your weekend adventures",
      note: "Special weekend rates available",
    },
    {
      name: "Business Travel",
      description: "Professional transportation for business",
      note: "Corporate rates available",
    },
    {
      name: "Wedding Events",
      description: "Make your special day memorable",
      note: "Luxury vehicles available",
    },
  ]

  const handleBookService = () => {
    setShowCars(true)
    setTimeout(() => {
      document.getElementById("available-cars")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen gradient-surface pt-24">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Explore our premium car rental services tailored for every occasion and need.
            </p>
          </div>

          {error && <div className="p-4 bg-error/10 text-error rounded-lg mb-8 text-center">{error}</div>}

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-surface rounded-lg card-shadow overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="h-40 bg-gradient-to-br from-accent/20 to-accent/10" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-text-secondary mb-3">{service.description}</p>
                  <p className="text-sm text-accent mb-4 font-medium">{service.note}</p>
                  <button
                    onClick={handleBookService}
                    className="w-full px-5 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Available Cars Section */}
          {showCars && (
            <div id="available-cars">
              <h2 className="text-4xl font-bold mb-8 text-center">Available Cars for Booking</h2>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-surface rounded-lg h-80 animate-pulse" />
                  ))}
                </div>
              ) : cars.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-secondary">No cars available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <Link key={car._id} href={`/booking/${car._id}`}>
                      <div className="bg-surface rounded-lg overflow-hidden card-shadow hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                        <div className="h-56 bg-gradient-to-br from-accent/20 to-accent/10" />
                        <div className="relative h-56 bg-muted overflow-hidden -mt-56">
                          <img
                            src={car.image || "/placeholder.svg?height=160&width=280&query=car"}
                            alt={car.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                          <p className="text-muted-foreground mb-3">{car.fuelType} • {car.capacity} Seats</p>
                          <p className="text-sm text-accent mb-4 font-medium">${car.rentPerHour}/hr</p>
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
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
