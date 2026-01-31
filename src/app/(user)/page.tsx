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
import TrustSection from '@/components/shop/TrustSection'
import { LayoutGrid, Sparkles, ArrowRight } from 'lucide-react'

export default function HomePage() {
  // const [heroSection, setHeroSection] = React.useState<any>(null) // Legacy
  const [sliderSection, setSliderSection] = React.useState<any>(null)
  const [globalDiscount, setGlobalDiscount] = React.useState(0)
  const [globalGst, setGlobalGst] = React.useState(18)
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([])
  const [lifestyleItems, setLifestyleItems] = React.useState<any>(null)
  const [lifestyleSubtitle, setLifestyleSubtitle] = React.useState<string>('')
  const [lifestyleTitle, setLifestyleTitle] = React.useState<string>('')
  const [trendingData, setTrendingData] = React.useState<any>(null)
  const [trustSection, setTrustSection] = React.useState<any>(null)

  const [categories, setCategories] = React.useState<any[]>([
    { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop', href: '/search?category=laptops' },
    { name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1780&auto=format&fit=crop', href: '/search?category=phones' },
    { name: 'Studio Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop', href: '/search?category=audio' },
    { name: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop', href: '/search?category=wearables' },
    { name: 'Gaming Rigs', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', href: '/search?category=gaming' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=2070&auto=format&fit=crop', href: '/search?category=accessories' },
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

      if (catSection?.content_json?.categories && catSection.content_json.categories.length > 0) {
        setCategories(catSection.content_json.categories.slice(0, 8))
      }

      // Fetch New Sections
      const { data: lifestyle } = await supabase.from('homepage_sections').select('*').eq('section_type', 'lifestyle_grid').single()
      const { data: trending } = await supabase.from('homepage_sections').select('*').eq('section_type', 'trending_spotlight').single()

      // Fetch Trust Section
      const { data: trust } = await supabase.from('homepage_sections').select('*').eq('section_type', 'trust_section').single()
      setTrustSection(trust?.content_json || null)

      setLifestyleItems(lifestyle?.content_json?.items)
      setLifestyleSubtitle(lifestyle?.subtitle || 'Collections curated for modern creators')
      setLifestyleTitle(lifestyle?.title || 'Designed For Every Moment')
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
      color: '#ffffff',
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

      {/* Categories: AJIO-Style Tiles */}
      <section className="pt-32 pb-8 bg-transparent">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-2 mb-16"
          >
            <div className="flex items-center gap-2 text-primary">
              <LayoutGrid className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Shop by Genre</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-[-0.04em] leading-none font-heading">
              Browse <span className="text-primary">Categories</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={cat.href || '#'} className="group block relative aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                  <img
                    src={cat.image || (
                      cat.name === 'Laptops' ? 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853' :
                        cat.name === 'Smartphones' || cat.name === 'Phones' ? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9' :
                          cat.name === 'Audio' || cat.name === 'Studio Audio' ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' :
                            cat.name === 'Watches' || cat.name === 'Wearables' ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' :
                              cat.name === 'Gaming Rigs' || cat.name === 'Gaming' ? 'https://images.unsplash.com/photo-1542751371-adc38448a05e' :
                                'https://images.unsplash.com/photo-1550745165-9bc0b252726f'
                    )}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-none mb-1">{cat.name}</h3>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Explore Collection</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle Grid */}
      <LifestyleGrid items={lifestyleItems} subtitle={lifestyleSubtitle} title={lifestyleTitle} />

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
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-[-0.04em] leading-none font-heading">
                Featured <span className="text-blue-600">Gear</span>
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
                  transition={{ duration: 0.6, delay: (index % 3) * 0.15, ease: [0.21, 0.45, 0.32, 0.9] as const }}
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

      {/* Social Proof & Trust */}
      <TrustSection data={trustSection} />
    </div >
  )
}
