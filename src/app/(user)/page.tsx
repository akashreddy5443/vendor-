import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch Hero Section
  const { data: heroSection } = await supabase
    .from('homepage_sections')
    .select('*')
    .eq('section_type', 'hero')
    .single()

  const heroData = {
    title: heroSection?.title || 'LEVEL UP YOUR SETUP',
    subtitle: heroSection?.subtitle || 'Premium gear for developers and tech enthusiasts. High quality, industrial design, and built to last.',
    imageUrl: heroSection?.content_json?.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section (CMS Driven) */}
      <section className="relative flex h-[600px] flex-col items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 transition-opacity duration-1000"
          style={{ backgroundImage: `url('${heroData.imageUrl}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        <div className="relative z-10 space-y-4 p-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">
            {heroData.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-md">
            {heroData.subtitle}
          </p>
          <div className="pt-4">
            <Link
              href="/products"
              className="rounded-full bg-orange-600 px-8 py-3 font-bold text-white transition-transform hover:scale-105 hover:bg-orange-500 shadow-lg shadow-orange-900/20"
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
