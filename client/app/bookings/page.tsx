"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ApiClient } from "@/lib/api"
import { isAuthenticated, getUser } from "@/lib/auth"
import moment from "moment"

interface Booking {
  _id: string
  car: {
    _id: string
    name: string
    image: string
    rentPerHour: number
  }
  user: {
    username: string
    email: string
    phone: string
  }
  bookedTimeSlots: {
    from: string
    to: string
  }
  totalMins: number
  totalAmount: number
  driverRequired: boolean
  address?: string
  transactionId?: string
  createdAt: string
}

export default function BookingsPage() {
  const router = useRouter()
  const user = getUser()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await ApiClient.get<{ bookings: Booking[] }>("/api/bookings/getallbookings")
        if (response.success) {
          setBookings(response.bookings || response.data || [])
        } else {
          setError(response.error || "Failed to load bookings")
        }
      } catch (err) {
        setError("Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [router])

  const generatePDF = async (booking: Booking) => {
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      
      // Brand Colors
      const primaryColor: [number, number, number] = [167, 139, 250] // #a78bfa - accent purple
      const accentColor: [number, number, number] = [6, 182, 212] // #06b6d4 - cyan
      const darkColor: [number, number, number] = [24, 24, 27] // #18181b - dark gray
      const lightGray: [number, number, number] = [244, 244, 245] // #f4f4f5
      
      // Header Section with Background
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, pageWidth, 45, 'F')
      
      // Company Logo/Name
      doc.setFontSize(28)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(255, 255, 255)
      doc.text("CarRent", pageWidth / 2, 20, { align: "center" })
      
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.text("Premium Car Rental Service", pageWidth / 2, 28, { align: "center" })
      doc.setFontSize(9)
      doc.text("Email: info@carrent.in | Phone: +91 98765 43210 | Web: www.carrent.in", pageWidth / 2, 36, { align: "center" })
      
      // Invoice Title Bar
      doc.setFillColor(...accentColor)
      doc.rect(0, 45, pageWidth, 12, 'F')
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("BOOKING INVOICE", pageWidth / 2, 53, { align: "center" })
      
      // Reset text color for body
      doc.setTextColor(...darkColor)
      
      // Invoice Info Section
      doc.setFillColor(...lightGray)
      doc.roundedRect(14, 62, pageWidth - 28, 22, 3, 3, 'F')
      
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.text("Invoice Date:", 18, 70)
      doc.text("Booking ID:", 18, 78)
      
      doc.setFont("helvetica", "normal")
      doc.text(moment(booking.createdAt).format("DD/MM/YYYY"), 50, 70)
      doc.setFontSize(8)
      doc.text(booking._id, 50, 78)
      
      // Customer Details Section
      let yPos = 92
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("CUSTOMER DETAILS", 14, yPos)
      
      doc.setDrawColor(...primaryColor)
      doc.setLineWidth(0.5)
      doc.line(14, yPos + 2, pageWidth - 14, yPos + 2)
      
      doc.setTextColor(...darkColor)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      yPos += 10
      
      doc.setFont("helvetica", "bold")
      doc.text("Name:", 18, yPos)
      doc.text("Email:", 18, yPos + 8)
      doc.text("Phone:", 18, yPos + 16)
      if (booking.address) {
        doc.text("Address:", 18, yPos + 24)
      }
      
      doc.setFont("helvetica", "normal")
      doc.text(booking.user?.username || "Not Provided", 50, yPos)
      doc.text(booking.user?.email || "Not Provided", 50, yPos + 8)
      doc.text(booking.user?.phone || "Not Provided", 50, yPos + 16)
      if (booking.address) {
        const addressLines = doc.splitTextToSize(booking.address, pageWidth - 65)
        doc.text(addressLines, 50, yPos + 24)
        yPos += (addressLines.length - 1) * 5 // Adjust for multi-line address
      }
      
      // Booking Details Section
      yPos += 30
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("BOOKING DETAILS", 14, yPos)
      
      doc.setDrawColor(...primaryColor)
      doc.line(14, yPos + 2, pageWidth - 14, yPos + 2)
      
      doc.setTextColor(...darkColor)
      doc.setFontSize(10)
      yPos += 10
      
      doc.setFont("helvetica", "bold")
      doc.text("Vehicle:", 18, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(booking.car?.name || "Not Available", 50, yPos)
      
      yPos += 10
      doc.setFillColor(...lightGray)
      doc.roundedRect(14, yPos - 5, pageWidth - 28, 32, 3, 3, 'F')
      
      doc.setFont("helvetica", "bold")
      doc.text("From:", 18, yPos + 2)
      doc.text("To:", 18, yPos + 10)
      doc.text("Duration:", 18, yPos + 18)
      
      doc.setFont("helvetica", "normal")
      doc.text(booking.bookedTimeSlots?.from || "N/A", 50, yPos + 2)
      doc.text(booking.bookedTimeSlots?.to || "N/A", 50, yPos + 10)
      doc.text(`${Math.floor(booking.totalMins / 60)} hours ${booking.totalMins % 60} minutes`, 50, yPos + 18)
      
      yPos += 32 // Move past the gray box
      
      if (booking.driverRequired) {
        doc.setFontSize(9)
        doc.setTextColor(...accentColor)
        doc.setFont("helvetica", "bold")
        doc.text("[*] Driver Service Included", 18, yPos)
        doc.setTextColor(...darkColor)
        yPos += 10 // Add spacing after driver text
      }
      
      // Payment Summary Section
      yPos += 10 // Additional spacing before payment section
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("PAYMENT SUMMARY", 14, yPos)
      
      doc.setDrawColor(...primaryColor)
      doc.line(14, yPos + 2, pageWidth - 14, yPos + 2)
      
      doc.setTextColor(...darkColor)
      doc.setFontSize(10)
      yPos += 12
      
      // Payment Table
      doc.setFillColor(...lightGray)
      doc.roundedRect(14, yPos - 5, pageWidth - 28, 10, 2, 2, 'F')
      doc.setFont("helvetica", "bold")
      doc.text("Rate per Hour:", 18, yPos + 2)
      doc.text(`Rs. ${booking.car?.rentPerHour}`, pageWidth - 18, yPos + 2, { align: "right" })
      
      yPos += 10
      doc.setFont("helvetica", "normal")
      doc.text("Duration:", 18, yPos + 2)
      doc.text(`${(booking.totalMins / 60).toFixed(2)} hours`, pageWidth - 18, yPos + 2, { align: "right" })
      
      if (booking.driverRequired) {
        yPos += 10
        doc.text("Driver Service:", 18, yPos + 2)
        const driverCost = ((booking.totalMins * 300) / 1440).toFixed(2)
        doc.text(`Rs. ${driverCost}`, pageWidth - 18, yPos + 2, { align: "right" })
      }
      
      // Total Amount Box
      yPos += 12
      doc.setFillColor(...accentColor)
      doc.roundedRect(14, yPos - 3, pageWidth - 28, 14, 3, 3, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("TOTAL AMOUNT:", 18, yPos + 6)
      doc.setFontSize(14)
      doc.text(`Rs. ${booking.totalAmount.toFixed(2)}`, pageWidth - 18, yPos + 6, { align: "right" })
      
      // Transaction ID if available
      if (booking.transactionId) {
        yPos += 18
        doc.setTextColor(...darkColor)
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.text(`Transaction ID: ${booking.transactionId}`, 14, yPos)
      }
      
      // Footer
      doc.setFillColor(...lightGray)
      doc.rect(0, pageHeight - 30, pageWidth, 30, 'F')
      
      doc.setTextColor(...darkColor)
      doc.setFontSize(9)
      doc.setFont("helvetica", "italic")
      doc.text("Thank you for choosing CarRent!", pageWidth / 2, pageHeight - 20, { align: "center" })
      
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text("This is a computer-generated invoice. No signature required.", pageWidth / 2, pageHeight - 14, { align: "center" })
      doc.text("For queries, contact us at support@carrent.in", pageWidth / 2, pageHeight - 8, { align: "center" })
      
      // Save PDF
      doc.save(`CarRent_Invoice_${booking._id.slice(-8)}_${moment(booking.createdAt).format("DDMMYYYY")}.pdf`)
    } catch (err) {
      console.error("PDF generation error:", err)
    }
  }

  const convertMinutesToHrsMins = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    return `${hours}h ${minutes}m`
  }

  return (
    <>
      <Header />
      <main className="min-h-screen gradient-surface pt-24 pb-16">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-lg text-muted-foreground">View and manage your car rental history</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse card-shadow" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-surface rounded-lg card-shadow p-16 text-center">
              <svg className="w-24 h-24 mx-auto text-muted-foreground mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-2xl font-bold mb-4">No bookings yet</h3>
              <p className="text-muted-foreground mb-8">Start your journey by booking your first car</p>
              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 font-semibold"
              >
                Browse Cars
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-surface rounded-lg card-shadow hover:shadow-lg transition-all duration-200 overflow-hidden group"
                >
                  <div className="flex gap-4 p-6">
                    <div className="w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={booking.car?.image || "/placeholder.svg?height=128&width=128&query=car"}
                        alt={booking.car?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl mb-1">{booking.car?.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Booked on {moment(booking.createdAt).format("DD/MM/YYYY")}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold">
                          ₹{booking.car?.rentPerHour}/hr
                        </span>
                        {booking.driverRequired && (
                          <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold">
                            Driver Included
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-muted border-t border-border">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">From</p>
                        <p className="font-semibold text-sm">
                          {booking.bookedTimeSlots?.from || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">To</p>
                        <p className="font-semibold text-sm">
                          {booking.bookedTimeSlots?.to || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                        <p className="font-semibold text-sm">{convertMinutesToHrsMins(booking.totalMins)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                        <p className="text-xl font-bold text-accent">₹{booking.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => generatePDF(booking)}
                      className="w-full py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 font-semibold flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Invoice
                    </button>
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
