"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ApiClient } from "@/lib/api"
import { getUser, isAuthenticated } from "@/lib/auth"
import { LoadingSpinner } from "@/components/ui/loading"
import { DateTimePicker } from "@/components/ui/datetime-picker"
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

// Declare Razorpay type
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showBookedSlots, setShowBookedSlots] = useState(false)
  
  const [startDateTime, setStartDateTime] = useState<Date | null>(null)
  const [endDateTime, setEndDateTime] = useState<Date | null>(null)
  const [driverRequired, setDriverRequired] = useState(false)
  
  const [totalMins, setTotalMins] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const fetchCar = async () => {
      try {
        setLoading(true)
        const response = await ApiClient.get<{ cars: Car[] }>("/api/cars/getallcars", false)
        if (response.success) {
          const selectedCar = response.cars?.find((c: Car) => c._id === carId)
          if (selectedCar) {
            setCar(selectedCar)
          } else {
            setError("Car not found")
          }
        }
      } catch (err) {
        setError("Failed to load car details")
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [carId, router])

  useEffect(() => {
    if (startDateTime && endDateTime && car) {
      const start = moment(startDateTime)
      const end = moment(endDateTime)
      const mins = end.diff(start, "minutes")

      if (mins > 0) {
        setTotalMins(mins)
        let amount = (mins * car.rentPerHour) / 60

        if (driverRequired) {
          amount += (mins * 300) / 1440
        }

        amount = Math.round(amount / 5) * 5
        setTotalAmount(amount)
      } else {
        setTotalMins(0)
        setTotalAmount(0)
      }
    }
  }, [startDateTime, endDateTime, driverRequired, car])

  const handlePayment = () => {
    if (!startDateTime || !endDateTime) {
      setError("Please select start and end dates")
      return
    }

    const start = moment(startDateTime)
    const end = moment(endDateTime)

    if (end.isSameOrBefore(start)) {
      setError("End time must be after start time")
      return
    }

    if (totalMins < 60) {
      setError("Minimum booking duration is 1 hour")
      return
    }

    setError(null)
    setSubmitting(true)

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: totalAmount * 100,
      currency: "INR",
      name: "CarRent",
      description: `Booking for ${car?.name || "Car"}`,
      handler: async function (response: any) {
        try {
          const requestData = {
            car: carId,
            user: getUser()?._id,
            bookedTimeSlots: {
              from: start.format("DD/MM/YYYY HH:mm"),
              to: end.format("DD/MM/YYYY HH:mm"),
            },
            totalMins,
            totalAmount,
            driverRequired: driverRequired,
            razorpay_order_id: response.razorpay_order_id || "order_" + Date.now(),
            razorpay_payment_id: response.razorpay_payment_id || "pay_" + Date.now(),
            razorpay_signature: response.razorpay_signature || "sig_" + Date.now(),
          }

          const bookingResponse = await ApiClient.post("/api/bookings/bookcar", requestData)

          if (bookingResponse.success) {
            router.push("/bookings")
          } else {
            setError(bookingResponse.error || "Booking failed")
            setSubmitting(false)
          }
        } catch (err: any) {
          setError(err.message || "Booking failed")
          setSubmitting(false)
        }
      },
      prefill: {
        name: getUser()?.username || "",
        email: getUser()?.email || "",
      },
      theme: {
        color: "#3b82f6",
      },
      modal: {
        ondismiss: function () {
          setSubmitting(false)
        },
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner fullscreen />
      </>
    )
  }

  if (!car) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xl font-semibold mb-4">{error || "Car not found"}</p>
            <button onClick={() => router.push("/")} className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all">
              Back to Home
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen gradient-surface pt-24 pb-16">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-accent hover:text-accent/80 transition-all font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Car Details */}
            <div className="space-y-6">
              <div className="bg-surface rounded-lg card-shadow overflow-hidden">
                <div className="aspect-[16/10] bg-muted">
                  <img
                    src={car.image || "/placeholder.svg?height=320&width=600&query=car"}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h1 className="text-3xl font-bold mb-4">{car.name}</h1>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      <div>
                        <p className="text-sm text-muted-foreground">Fuel Type</p>
                        <p className="font-semibold">{car.fuelType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-semibold">{car.capacity} Persons</p>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
                      <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm text-accent/70">Rental Rate</p>
                        <p className="text-xl font-bold text-accent">₹{car.rentPerHour} / hour</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {car.bookedTimeSlots && car.bookedTimeSlots.length > 0 && (
                <div className="bg-surface rounded-lg card-shadow p-6">
                  <button
                    onClick={() => setShowBookedSlots(!showBookedSlots)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold">Booked Time Slots</h3>
                    <svg
                      className={`w-5 h-5 transition-transform ${showBookedSlots ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showBookedSlots && (
                    <div className="mt-4 space-y-2">
                      {car.bookedTimeSlots.map((slot, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                          <span className="font-medium">{slot.from}</span>
                          <span className="mx-2 text-muted-foreground">→</span>
                          <span className="font-medium">{slot.to}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div className="bg-surface rounded-lg card-shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Book This Car</h2>

              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-6 flex items-center gap-3 animate-fade-in">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Date and Time Selection */}
                <DateTimePicker
                  date={startDateTime || undefined}
                  setDate={(date) => setStartDateTime(date || null)}
                  minDate={new Date()}
                  placeholder="Select pickup date and time"
                  label="Pickup Date & Time"
                />

                <DateTimePicker
                  date={endDateTime || undefined}
                  setDate={(date) => setEndDateTime(date || null)}
                  minDate={startDateTime || new Date()}
                  placeholder="Select return date and time"
                  label="Return Date & Time"
                />

                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <input
                    type="checkbox"
                    checked={driverRequired}
                    onChange={(e) => setDriverRequired(e.target.checked)}
                    className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent"
                  />
                  <label className="text-sm font-medium">Driver Required (+₹300/day)</label>
                </div>

                {totalMins > 0 && (
                  <div className="p-6 bg-gradient-primary rounded-xl text-white space-y-3">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold">
                        {Math.floor(totalMins / 60)}h {totalMins % 60}m
                      </span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total Amount:</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={submitting || !startDateTime || !endDateTime || totalMins === 0}
                  className="w-full py-4 bg-accent text-white rounded-lg font-bold hover:bg-accent/90 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </>
  )
}
