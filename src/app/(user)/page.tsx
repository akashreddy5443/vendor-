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

export default function HomePage() {
  // const [heroSection, setHeroSection] = React.useState<any>(null) // Legacy
  const [sliderSection, setSliderSection] = React.useState<any>(null)
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([])
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

      {/* Cyberpunk Car Animation */}
      < CyberpunkCar />

      {/* BigTech Phase 2: Category Circles */}
      <section className="py-12 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h3 className="text-3xl font-bold text-[#0B1026] mb-12 drop-shadow-sm">Shop by Category</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group flex flex-col items-center gap-3">
                <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-3xl shadow-sm transition-all group-hover:scale-110 group-hover:bg-[#0B1026] group-hover:text-white group-hover:shadow-md border border-gray-200 dark:border-zinc-700">
                  {cat.icon}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#0B1026] dark:group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section >

      {/* BigTech Phase 3: Promo Banners */}
      < PromoBanner />

      {/* Featured Products Placeholder */}
      < section className="py-20 px-6" >
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-3xl font-bold text-center mb-12"
        >
          FEATURED GEAR
        </motion.h2>
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
                <ProductCard product={product} />
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
