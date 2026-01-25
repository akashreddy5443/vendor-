'use client'

import React from 'react'
import Link from 'next/link'
// Trigger Deployment
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { ProductCard } from '@/components/shop/ProductCard'
import { motion } from 'framer-motion'
import { CyberpunkCar } from '@/components/ui/CyberpunkCar'

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
      {/* Hero Section (CMS Driven) - Always Dark for Premium Feel */}
      <section className="relative flex h-[600px] flex-col items-center justify-center text-center bg-black overflow-hidden border-b border-blue-500/20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroData.imageUrl}')` }}
        ></motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black/40 to-black"></div>

        <div className="relative z-10 space-y-4 p-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4 drop-shadow-[0_0_15px_rgba(234,88,12,0.5)]"
          >
            {heroData.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-md font-light tracking-wide"
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
              className="rounded-full bg-gradient-to-r from-blue-600 to-red-600 px-10 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(234,88,12,0.6)]"
            >
              SHOP NOW
            </Link>
          </motion.div>
        </div>

        {/* Cyberpunk Car Animation */}
        <CyberpunkCar />
      </section>

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
