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
import { PromoBanner } from '@/components/shop/PromoBanner'

export default function HomePage() {
  const [heroSection, setHeroSection] = React.useState<any>(null)
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch Hero
      const { data: hero } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'hero')
        .single()
      setHeroSection(hero)

      // Fetch Featured
      const { data: featured } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'featured')
        .single()

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

  const heroData = {
    title: heroSection?.title || 'LEVEL UP YOUR SETUP',
    subtitle: heroSection?.subtitle || 'Premium gear for developers and tech enthusiasts. High quality, industrial design, and built to last.',
    imageUrl: heroSection?.content_json?.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section (CMS Driven) - Theme Adaptive */}
      <section className="relative flex h-[600px] flex-col items-center justify-center text-center bg-background overflow-hidden border-b border-blue-500/20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroData.imageUrl}')` }}
        ></motion.div>

        {/* Gradient Overlays - Adaptive */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-background/40 to-background/80 dark:from-blue-900/20 dark:via-black/40 dark:to-black"></div>

        <div className="relative z-10 space-y-4 p-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-sm"
            style={{ color: '#0B1026' }}
          >
            {heroData.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl max-w-2xl mx-auto drop-shadow-sm font-medium tracking-wide"
            style={{ color: '#0B1026' }}
          >
            {heroData.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pt-8"
          >
            <Link
              href="/products"
              className="rounded-full bg-gradient-to-r from-gray-900 to-black px-10 py-4 font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl dark:from-blue-600 dark:to-blue-800"
            >
              SHOP NOW
            </Link>
          </motion.div>
        </div>

        {/* Cyberpunk Car Animation */}
        <CyberpunkCar />
      </section>

      {/* BigTech Phase 2: Category Circles */}
      <section className="py-12 bg-white dark:bg-zinc-900/50 border-b border-gray-100 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h3 className="text-xl font-bold text-[#0B1026] dark:text-white mb-8">Shop by Category</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { name: 'Laptops', icon: '💻', href: '/search?category=laptops' },
              { name: 'Phones', icon: '📱', href: '/search?category=phones' },
              { name: 'Audio', icon: '🎧', href: '/search?category=audio' },
              { name: 'Watches', icon: '⌚', href: '/search?category=wearables' },
              { name: 'Gaming', icon: '🎮', href: '/search?category=gaming' },
              { name: 'Cameras', icon: '📷', href: '/search?category=cameras' },
            ].map((cat) => (
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
      </section>

      {/* BigTech Phase 3: Promo Banners */}
      <PromoBanner />

      {/* Featured Products Placeholder */}
      <section className="py-20 px-6">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-3xl font-bold text-center mb-12"
        >
          FEATURED GEAR
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
      </section>
    </div>
  )
}
