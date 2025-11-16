"use client"

import { useState } from "react"

export function ReviewsSection() {
  const [currentReview, setCurrentReview] = useState(0)

  const reviews = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Excellent service! The car was in perfect condition and the booking process was seamless. Highly recommend!",
      date: "2 weeks ago",
      avatar: "RK"
    },
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Great experience renting from CarRent. Professional staff and well-maintained vehicles. Will use again!",
      date: "1 month ago",
      avatar: "PS"
    },
    {
      name: "Amit Patel",
      rating: 4,
      comment: "Very satisfied with the service. The driver was punctual and courteous. Good value for money.",
      date: "3 weeks ago",
      avatar: "AP"
    },
    {
      name: "Sneha Reddy",
      rating: 5,
      comment: "Best car rental service in the city! Clean cars, fair prices, and excellent customer support.",
      date: "1 week ago",
      avatar: "SR"
    }
  ]

  return (
    <section className="py-20 gradient-surface">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-4xl mx-auto bg-surface p-8 md:p-12 rounded-lg card-shadow hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/40 to-accent/20 flex items-center justify-center text-accent text-xl font-bold">
                        {review.avatar}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{review.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentReview ? "bg-primary w-10" : "bg-border hover:bg-muted-foreground w-3"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-surface card-shadow hover:shadow-lg transition-all duration-200 flex items-center justify-center text-accent"
            aria-label="Previous review"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentReview((prev) => (prev + 1) % reviews.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-surface card-shadow hover:shadow-lg transition-all duration-200 flex items-center justify-center text-accent"
            aria-label="Next review"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
