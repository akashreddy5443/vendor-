'use client'

import React from 'react'
import Link from 'next/link'
// Trigger Deployment
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

import { ProductCard } from '@/components/shop/ProductCard'
import { motion } from 'framer-motion'
import { CyberpunkCar } from '@/components/ui/CyberpunkCar'
import { HeroSlider } from '@/components/shop/HeroSlider'
import { PromoBanner } from '@/components/shop/PromoBanner'
import { LifestyleGrid } from '@/components/shop/LifestyleGrid'
import { TrendingSpotlight } from '@/components/shop/TrendingSpotlight'

export default function HomePage() {
  // const [heroSection, setHeroSection] = React.useState<any>(null) // Legacy
  const [sliderSection, setSliderSection] = React.useState<any>(null)
  const [globalDiscount, setGlobalDiscount] = React.useState(0)
  const [globalGst, setGlobalGst] = React.useState(18)
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([])
  const [lifestyleItems, setLifestyleItems] = React.useState<any>(null)
  const [trendingData, setTrendingData] = React.useState<any>(null)

  const [categories, setCategories] = React.useState<any[]>([
    { name: 'Laptops', icon: '💻', href: '/search?category=laptops' },
    { name: 'Phones', icon: '📱', href: '/search?category=phones' },
    { name: 'Audio', icon: '🎧', href: '/search?category=audio' },
    { name: 'Watches', icon: '⌚', href: '/search?category=wearables' },
    { name: 'All Categories', icon: '⚡', href: '/products' },
  ])

  React.useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch Global Settings
      const { data: settings } = await supabase.from('site_settings').select('global_discount_percentage, default_gst_percentage').single()
      if (settings) {
        setGlobalDiscount(settings.global_discount_percentage || 0)
        setGlobalGst(settings.default_gst_percentage || 18)
      }

      // Fetch Hero Slider
      const { data: slider } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'hero_slider')
        .single()
      setSliderSection(slider)

      // Fetch Featured
      const { data: featured } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'featured')
        .single()

      // Fetch Categories
      const { data: catSection } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'categories')
        .single()

      if (catSection?.content_json?.categories) {
        // setCategories(catSection.content_json.categories) 
        // Forced to use hardcoded list per user request for "4 items + All Categories"
      }

      // Fetch New Sections
      const { data: lifestyle } = await supabase.from('homepage_sections').select('*').eq('section_type', 'lifestyle_grid').single()
      const { data: trending } = await supabase.from('homepage_sections').select('*').eq('section_type', 'trending_spotlight').single()

      setLifestyleItems(lifestyle?.content_json?.items)
      setTrendingData(trending?.content_json)

      if (featured?.content_json?.productIds?.length > 0) {
        const { data: products } = await supabase
          .from('products')
          .select('*, product_images(*)')
          .in('id', featured.content_json.productIds)
          .eq('status', 'active')
        setFeaturedProducts(products || [])
      }
    }
    fetchData()
  }, [])

  // Prepare slides from DB or use defaults
  const slides = sliderSection?.content_json?.slides || [
    {
      id: 'default',
      title: 'LEVEL UP YOUR SETUP',
      subtitle: 'Premium Gear',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
      buttonText: 'Shop Now',
      link: '/products'
    }
  ]

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Slider */}
      <section className="relative bg-background border-b border-gray-100">
        <HeroSlider slides={slides} />
      </section >

      {/* BigTech Phase 2: Category Circles */}
      <section className="py-16 border-b border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg font-bold text-blue-600 mb-2 uppercase tracking-widest"
          >
            Explore
          </motion.h3>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-[#0B1026] mb-12 uppercase tracking-tight"
          >
            Shop by Category
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {categories.map((cat, idx) => (
              <Link key={cat.name} href={cat.href} className="group flex flex-col items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-4xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#0B1026] group-hover:text-white group-hover:shadow-xl border border-gray-100"
                >
                  {cat.icon}
                </motion.div>
                <span className="text-sm font-bold uppercase tracking-wider text-gray-500 group-hover:text-[#0B1026] transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section >

      {/* Made For Every Moment (Lifestyle Grid) */}
      <LifestyleGrid items={lifestyleItems} />

      {/* BigTech Phase 3: Promo Banners */}
      < PromoBanner />

      {/* In The Spotlight (Trending/Editorial) */}
      <TrendingSpotlight data={trendingData} />

      {/* Featured Products Placeholder */}
      < section className="py-24 px-6 bg-white" >
        <div className="text-center mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg font-bold text-blue-600 mb-2 uppercase tracking-widest"
          >
            Curated Selection
          </motion.h3>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-4xl font-black text-[#0B1026] uppercase tracking-tight"
          >
            Featured Gear
          </motion.h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} globalDiscount={globalDiscount} globalGst={globalGst} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No featured products selected. Check Admin Panel.
            </div>
          )}
        </div>
      </section >
    </div >
  )
}
