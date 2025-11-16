"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen gradient-surface pt-24 pb-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">About CarRent</h1>
            <p className="text-xl text-muted-foreground">Your trusted partner for premium car rentals</p>
          </div>

          <div className="space-y-16">
            <section className="bg-surface rounded-lg card-shadow p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                CarRent is dedicated to providing premium car rental services with exceptional customer experience. We
                believe in making vehicle rental simple, transparent, and accessible to everyone.
              </p>
            </section>

            <section>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">Why Choose Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface p-8 rounded-lg card-shadow hover:shadow-lg transition-all duration-200 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-accent/40 to-accent/20 rounded-lg">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl">Wide Selection</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Choose from our diverse fleet of well-maintained vehicles for any occasion.
                  </p>
                </div>
                <div className="bg-surface p-8 rounded-lg card-shadow hover:shadow-lg transition-all duration-200 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-accent/40 to-accent/20 rounded-lg">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl">Affordable Pricing</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Competitive rates with no hidden charges. Transparent pricing for peace of mind.
                  </p>
                </div>
                <div className="bg-surface p-8 rounded-lg card-shadow hover:shadow-lg transition-all duration-200 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-accent/40 to-accent/20 rounded-lg">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl">Easy Booking</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Book your vehicle in minutes through our user-friendly online platform.
                  </p>
                </div>
                <div className="bg-surface p-8 rounded-lg card-shadow hover:shadow-lg transition-all duration-200 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-accent/40 to-accent/20 rounded-lg">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl">24/7 Support</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Our dedicated team is always ready to assist you whenever you need help.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-surface rounded-lg card-shadow p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-accent/10 rounded-xl">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">Our Fleet</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We maintain a modern and well-maintained fleet of vehicles ranging from economy cars to premium SUVs.
                All vehicles are regularly serviced and inspected to ensure your safety and comfort.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
