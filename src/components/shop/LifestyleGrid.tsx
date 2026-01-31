'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function LifestyleGrid({ items, subtitle, title }: { items?: any[], subtitle?: string, title?: string }) {
    const gridItems = items || [
        {
            title: 'DESK & PRODUCTIVITY',
            image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop',
            link: '/search?category=laptops'
        },
        {
            title: 'GAMING & PERFORMANCE',
            image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop',
            link: '/search?category=audio'
        },
        {
            title: 'DAILY TECH GEAR',
            image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=2070&auto=format&fit=crop',
            link: '/search?category=wearables'
        }
    ]

    const sectionSubtitle = subtitle || 'Collections curated for modern creators'
    const sectionTitle = title || 'Designed For Every Moment'

    return (
        <section className="pt-8 pb-32 bg-transparent relative overflow-hidden">
            {/* Dynamic Section Background */}
            <div className="absolute top-1/2 left-0 w-full h-[500px] bg-blue-500/5 blur-[120px] -translate-y-1/2 rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-3 mb-32"
                >
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-10 h-[2px] bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">{sectionSubtitle}</span>
                    </div>
                    {/* Phase 4: Reduced underline thickness from 8 to 5 */}
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-[-0.05em] text-slate-900 leading-[0.9] font-heading">
                        {sectionTitle.split(' ').slice(0, -2).join(' ')} <br />
                        <span className="text-primary relative">
                            {sectionTitle.split(' ').slice(-2).join(' ')}
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="5" />
                            </svg>
                        </span>
                    </h2>
                </motion.div>

                {/* Phase 5: Strict grid system - equal widths, equal gaps, vertical alignment */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {gridItems.map((item, idx) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                delay: idx * 0.15,
                                duration: 0.8,
                                ease: [0.21, 0.45, 0.32, 0.9] as const
                            }}
                            className="relative h-[600px]"
                        >
                            {/* Phase 6: Cursor feedback - whole card clickable */}
                            <Link href={item.link} className="group block h-full w-full cursor-pointer">
                                {/* Phase 3: Consistent corner radius (2.5rem), enhanced shadows, card lift */}
                                <div className="h-full w-full relative rounded-[2.5rem] overflow-hidden bg-white border border-blue-100/50 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_50px_100px_-20px_rgba(59,130,246,0.3)] group-hover:-translate-y-3 transition-all duration-500">
                                    {/* Phase 3: Image zoom 1.05 on hover */}
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />

                                    {/* Phase 2: Consistent Gradient Overlay - Stronger for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 via-transparent to-transparent" />
                                    <div className="absolute inset-0 bg-blue-900/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    {/* Phase 6: Micro-copy on hover - top right badge */}
                                    <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/50">
                                            <p className="text-xs font-bold text-slate-900">Explore Now →</p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-10 left-8 right-8 z-20">
                                        {/* Phase 3: Improved label container - Dark glassmorphism, higher contrast */}
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="bg-slate-950/70 backdrop-blur-3xl border border-white/40 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group/label"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/25 to-transparent pointer-events-none" />
                                            <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" />

                                            {/* Phase 3: CTA Hierarchy - Title → CTA → Arrow */}
                                            <h3 className="text-2xl md:text-3xl font-black text-white mb-5 uppercase tracking-tighter leading-none font-heading relative z-10 drop-shadow-2xl">
                                                {item.title}
                                            </h3>

                                            <div className="flex items-center text-[11px] font-black uppercase tracking-[0.2em] text-blue-300 group-hover/label:text-white transition-all gap-2 relative z-10 drop-shadow-md">
                                                <span className="relative">
                                                    Explore Collection
                                                    {/* Phase 3: CTA underline animation */}
                                                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white group-hover/label:w-full transition-all duration-300"></span>
                                                </span>
                                                <div className="relative">
                                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/label:translate-x-2" />
                                                    <div className="absolute inset-0 bg-blue-300 blur-lg opacity-0 group-hover/label:opacity-60" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
