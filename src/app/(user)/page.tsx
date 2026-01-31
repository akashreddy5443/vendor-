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
import { LayoutGrid, Sparkles, ArrowRight } from 'lucide-react'

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
    { name: 'All Categories', icon: 'GRID', href: '/products' },
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
        setCategories(catSection.content_json.categories)
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
    <div className="min-h-screen bg-transparent text-slate-900 overflow-hidden font-sans">
      {/* Hero Slider */}
      <section className="relative">
        <HeroSlider slides={slides} />
      </section >

      {/* Categories: Alive & Interactive */}
      <section className="py-24 bg-transparent">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex justify-center items-center gap-2 text-blue-600 mb-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quick Access</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none font-heading">
              Shop by <span className="text-blue-600 font-serif normal-case italic">Category</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-10 md:gap-20">
            {categories.map((cat, idx) => (
              <Link key={cat.name} href={cat.href} className="group flex flex-col items-center gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                  className="h-28 w-28 rounded-[2rem] bg-white flex items-center justify-center text-4xl shadow-xl shadow-blue-500/5 transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-blue-500/20 group-hover:rotate-6 border border-blue-50"
                >
                  {cat.icon === 'GRID' ? <LayoutGrid className="w-10 h-10" /> : cat.icon}
                </motion.div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section >

      {/* Lifestyle Grid */}
      <LifestyleGrid items={lifestyleItems} />

      {/* Promo Banner */}
      <section className="bg-transparent py-12">
        <PromoBanner />
      </section>

      {/* Trending Spotlight */}
      <TrendingSpotlight data={trendingData} />

      {/* Featured Gear: Editorial Finish */}
      < section className="py-24 px-6 bg-transparent" >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-20"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Sparkles className="h-4 w-4 fill-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Editor's Choice</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none font-heading">
                Featured <span className="text-blue-600 font-serif normal-case italic">Gear</span>
              </h2>
            </div>
            <Link href="/products" className="group hidden md:flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-all">
              View Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.15, ease: [0.21, 0.45, 0.32, 0.9] }}
                >
                  <ProductCard product={product} globalDiscount={globalDiscount} globalGst={globalGst} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white/50 backdrop-blur-md rounded-[2rem] border border-dashed border-blue-100 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                No curated gear available. Add from Admin.
              </div>
            )}
          </div>

          <div className="md:hidden mt-12 text-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
              View All Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section >
    </div >
  )
}
