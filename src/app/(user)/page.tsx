'use client'

import React from 'react'
import Link from 'next/link'
// Trigger Deployment
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

import { ProductCard } from '@/components/shop/ProductCard'
import { ProductCardSkeleton } from '@/components/shop/ProductCardSkeleton'
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
  const [featuredTitle, setFeaturedTitle] = React.useState('Featured Gear')
  const [featuredSubtitle, setFeaturedSubtitle] = React.useState("Editor's Choice")
  const [lifestyleItems, setLifestyleItems] = React.useState<any>(null)
  const [lifestyleSubtitle, setLifestyleSubtitle] = React.useState<string>('')
  const [lifestyleTitle, setLifestyleTitle] = React.useState<string>('')
  const [trendingData, setTrendingData] = React.useState<any>(null)
  const [trustSection, setTrustSection] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true) // Added loading state

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

      if (featured) {
        setFeaturedTitle(featured.title || 'Featured Gear')
        setFeaturedSubtitle(featured.content_json?.subtitle || "Editor's Choice")
      }

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
      setLoading(false)
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
    <div className="min-h-screen bg-transparent text-slate-900 overflow-hidden font-sans flex flex-col md:block">
      {/* Hero Slider - Order 1 */}
      <section className="relative order-1 md:order-none">
        <HeroSlider slides={slides} />
      </section >

      {/* Mobile Trust Strip (Compact) - Order 1.5 */}
      <div className="order-1 md:hidden bg-slate-50 border-y border-slate-100 py-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 px-4 min-w-max">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Fast Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Official Warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Easy Returns</span>
          </div>
        </div>
      </div>

      {/* Trust Section: Order 2 (Right after Hero) */}
      <div className="order-2 md:order-none">
        <TrustSection data={trustSection} />
      </div>

      {/* Categories: AJIO-Style Tiles (Restored) */}
      <section className="pt-8 md:pt-16 pb-8 bg-transparent order-3 md:order-none">
        <div className="w-full px-4 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-1 md:gap-2 mb-6 md:mb-12"
          >
            <div className="flex items-center gap-2 text-primary">
              <LayoutGrid className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Shop by Genre</span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 uppercase tracking-[-0.04em] leading-none font-heading text-left">
                Browse <span className="text-gradient-brand">Categories</span>
              </h2>
              <Link href="/products" className="hidden md:flex text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary items-center gap-2">View All <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </motion.div>

          {/* Categories Grid - Restored with Soft Rails */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={idx > 3 ? 'hidden xl:block' : ''}
              >
                <Link href={cat.href || '#'} className={`group block relative aspect-[4/5] md:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 ${idx > 3 ? 'hidden md:block' : ''}`}>
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
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                    <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-none mb-1">{cat.name}</h3>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Explore</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link href="/products" className="flex items-center justify-center w-full py-3 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-colors">
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner: Order 3 (Mobile) */}
      <section className="bg-transparent py-8 md:py-12 order-3 md:order-none">
        <PromoBanner />
      </section>

      {/* Featured Gear: Order 4 (Mobile) */}
      <section className="py-12 md:py-24 bg-transparent order-4 md:order-none overflow-hidden" >
        <div className="w-full px-4 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-20"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 fill-blue-600" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">{featuredSubtitle}</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 uppercase tracking-[-0.04em] leading-none font-heading">
                {featuredTitle.split(' ').slice(0, -1).join(' ')} <span className="text-gradient-brand">{featuredTitle.split(' ').slice(-1)}</span>
              </h2>
            </div>
            <Link href="/products" className="group hidden md:flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-all">
              View Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scroll-pl-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 md:mx-0 md:px-0 scrollbar-hide">
            {loading ? (
              // Skeleton Loading State
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[75vw] md:min-w-0 snap-start">
                  <ProductCardSkeleton />
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.15, ease: [0.21, 0.45, 0.32, 0.9] as const }}
                  className="min-w-[75vw] md:min-w-0 snap-start"
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

          <div className="md:hidden mt-6 text-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-600 pb-1">
              View All Collection <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section >



      {/* Visual Anchor Strip (Phase 3) - Replaces LifestyleGrid */}
      <section className="py-12 md:py-16 bg-transparent order-6 md:order-none">
        <div className="w-full px-4 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8 md:mb-12 flex flex-col gap-2"
          >
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-[-0.04em] leading-none font-heading text-left">
              {(() => {
                const words = (lifestyleTitle || 'Designed For Every Moment').split(' ')
                const mainPart = words.slice(0, Math.max(0, words.length - 2)).join(' ')
                const highlightPart = words.slice(Math.max(0, words.length - 2)).join(' ')
                return (
                  <>
                    {mainPart} <span className="text-gradient-brand">{highlightPart}</span>
                  </>
                )
              })()}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{lifestyleSubtitle || 'Curated Workspaces'}</p>
          </motion.div>

          {/* Visual Strip - 3 Panels (Editable) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-[120vh] lg:h-[70vh]">
            {(lifestyleItems || [
              { title: 'Desk & Productivity', image: 'https://images.unsplash.com/photo-1493723843671-1d09e75ef1e1?q=80&w=2070', link: '/products' },
              { title: 'Gaming & Performance', image: 'https://images.unsplash.com/photo-1624522206775-680786df76e1?q=80&w=2070', link: '/products' },
              { title: 'Daily Tech Gear', image: 'https://images.unsplash.com/photo-1544652478-6653e09f1826?q=80&w=2070', link: '/products' }
            ]).map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-full w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-900"
              >
                <img
                  src={item.image || item.img} // fallback for compatibility
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 md:p-10 flex flex-col items-start w-full">
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Featured</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[0.9] mb-6">
                    {item.title}
                  </h3>
                  <Link
                    href={item.link || '/products'}
                    className="w-full flex justify-between items-center text-xs font-bold text-white uppercase tracking-widest group/btn border-t border-white/20 pt-6 hover:text-primary hover:border-primary transition-all"
                  >
                    Explore Collection <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Spotlight: Order 7 (Mobile - last) */}
      <div className="order-7 md:order-none">
        <TrendingSpotlight data={trendingData} />
      </div>
    </div >
  )
}
