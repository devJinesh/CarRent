"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ApiClient } from "@/lib/api"
import { getUser, isAuthenticated } from "@/lib/auth"
import Link from "next/link"

interface Car {
  _id: string
  name: string
  image: string
  fuelType: string
  capacity: number
  rentPerHour: number
}

export default function AdminPage() {
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const user = getUser()
    if (!isAuthenticated() || !user?.admin) {
      router.push("/")
      return
    }

    const fetchCars = async () => {
      try {
        setLoading(true)
        const response = await ApiClient.get<{ cars: Car[] }>("/api/cars/getallcars")
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
  }, [router])

  const handleDeleteCar = async (carId: string) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return

    try {
      const response = await ApiClient.post("/api/cars/deletecar", { carid: carId })
      if (response.success) {
        setCars(cars.filter((c) => c._id !== carId))
      } else {
        setError(response.error || "Failed to delete car")
      }
    } catch (err) {
      setError("Failed to delete car")
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen gradient-surface pt-24 pb-16">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
              <p className="text-lg text-muted-foreground">Manage your vehicle inventory</p>
            </div>
            <Link
              href="/admin/add-car"
              className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:-translate-y-0.5 font-bold flex items-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Car
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-8 flex items-center gap-3 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-96 animate-pulse card-shadow" />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="bg-surface rounded-lg card-shadow p-16 text-center">
              <svg className="w-24 h-24 mx-auto text-muted-foreground mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-2xl font-bold mb-4">No cars in inventory</h3>
              <p className="text-muted-foreground mb-8">Add your first vehicle to get started</p>
              <Link
                href="/admin/add-car"
                className="inline-block px-8 py-3 bg-accent text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 font-semibold"
              >
                Add First Car
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <div key={car._id} className="bg-surface rounded-lg card-shadow hover:shadow-lg transition-all duration-200 overflow-hidden group">
                  <div className="h-56 bg-gradient-to-br from-accent/20 to-accent/10" />
                  <div className="relative h-56 bg-muted overflow-hidden -mt-56">
                    <img
                      src={car.image || "/placeholder.svg"}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                    <p className="text-muted-foreground mb-3">{car.fuelType} • {car.capacity} Seats</p>
                    <p className="text-sm text-accent mb-4 font-medium">₹{car.rentPerHour}/hour</p>
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/edit-car/${car._id}`}
                        className="flex-1 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 active:scale-95 transition-all duration-200 text-center text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteCar(car._id)}
                        className="flex-1 px-4 py-2.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 active:scale-95 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 border-2 border-destructive/20 hover:border-destructive/30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
