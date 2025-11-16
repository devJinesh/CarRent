"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ApiClient } from "@/lib/api"
import { getUser, isAuthenticated } from "@/lib/auth"

interface Car {
  _id: string
  name: string
  image: string
  fuelType: string
  capacity: number
  rentPerHour: number
}

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Car | null>(null)

  useEffect(() => {
    if (!isAuthenticated() || !getUser()?.admin) {
      router.push("/")
      return
    }

    const fetchCar = async () => {
      try {
        const response = await ApiClient.get<{ cars: Car[] }>("/api/cars/getallcars")
        if (response.success) {
          const car = response.cars?.find((c) => c._id === carId)
          if (car) {
            setFormData(car)
          } else {
            setError("Car not found")
          }
        }
      } catch (err) {
        setError("Failed to load car")
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [carId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (!formData) return
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "capacity" ? Number.parseInt(value) : name === "rentPerHour" ? Number.parseFloat(value) : value,
          }
        : null,
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (!formData) return

      const response = await ApiClient.put("/api/cars/editcar", {
        _id: formData._id,
        name: formData.name,
        image: formData.image,
        fuelType: formData.fuelType,
        capacity: formData.capacity,
        rentPerHour: formData.rentPerHour,
      })

      if (response.success) {
        router.push("/admin")
      } else {
        setError(response.error || "Failed to update car")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !formData) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24">
          <div className="max-w-2xl mx-auto px-4">Loading...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen gradient-surface pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="mb-8 text-muted-foreground hover:text-accent flex items-center gap-2 group transition-colors"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          <div className="bg-surface rounded-lg card-shadow p-8 md:p-12">
            <div className="mb-10">
              <h1 className="text-4xl font-bold mb-3">Edit Car</h1>
              <p className="text-muted-foreground text-lg">Update vehicle details and information</p>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-8 flex items-center gap-3 animate-fade-in">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">Car Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-input"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-input"
                />
                {formData.image && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2 text-muted-foreground">Preview:</p>
                    <div className="aspect-square w-full max-w-md mx-auto bg-background rounded-lg overflow-hidden">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = "/placeholder.svg")} />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Fuel Type</label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-input"
                  >
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                    <option>CNG</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Capacity (Seats)</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    required
                    className="w-full px-5 py-3.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">Rent Per Hour (₹)</label>
                <input
                  type="number"
                  name="rentPerHour"
                  value={formData.rentPerHour}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-5 py-3.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-input"
                  placeholder="e.g., 500.00"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-accent text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Car
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 bg-muted text-foreground py-4 rounded-lg font-semibold hover:bg-muted/80 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
