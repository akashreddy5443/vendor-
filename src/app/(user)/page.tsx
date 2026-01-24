import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { ProductCard } from '@/components/shop/ProductCard'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch Hero Section
  const { data: heroSection } = await supabase
    .from('homepage_sections')
    .select('*')
    .eq('section_type', 'hero')
    .single()

  const { data: featuredSection } = await supabase
    .from('homepage_sections')
    .select('*')
    .eq('section_type', 'featured')
    .single()

  let featuredProducts = []
  if (featuredSection?.content_json?.productIds?.length > 0) {
    const { data } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .in('id', featuredSection.content_json.productIds)
      .eq('status', 'active')

    featuredProducts = data || []
  }

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
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No featured products selected. Check Admin Panel.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
