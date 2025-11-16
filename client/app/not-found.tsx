import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-2xl text-text-secondary mb-8">Page not found</p>
          <Link
            href="/"
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-200 font-semibold"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
