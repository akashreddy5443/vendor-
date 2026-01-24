import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar Placeholder */}
      <nav className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
        <div className="flex items-center gap-2 text-xl font-bold text-orange-500">
          <ShoppingBag />
          TechDev Store
        </div>
        <div className="flex gap-4 text-sm font-medium text-gray-300">
          <Link href="/products" className="hover:text-white">Products</Link>
          <Link href="/cart" className="hover:text-white">Cart</Link>
          <Link href="/login" className="hover:text-white">Login</Link>
        </div>
      </nav>

      {/* Hero Section Placeholder (Will be CMS driven) */}
      <section className="relative flex h-[600px] flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 space-y-4 p-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">
            LEVEL UP YOUR SETUP
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Premium gear for developers and tech enthusiasts. High quality, industrial design, and built to last.
          </p>
          <div className="pt-4">
            <Link
              href="/products"
              className="rounded-full bg-orange-600 px-8 py-3 font-bold text-white transition-transform hover:scale-105 hover:bg-orange-500"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">FEATURED GEAR</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Skeleton Cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
              <div className="aspect-square bg-gray-800 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 w-3/4 bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/4 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
