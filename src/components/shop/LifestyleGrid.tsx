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
                    className="flex flex-col gap-3 mb-24"
                >
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-10 h-[2px] bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">{sectionSubtitle}</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-[-0.05em] text-slate-900 leading-[0.9] font-heading">
                        {sectionTitle.split(' ').slice(0, -2).join(' ')} <br />
                        <span className="text-primary relative">
                            {sectionTitle.split(' ').slice(-2).join(' ')}
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
                            </svg>
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 perspective-1000">
                    {gridItems.map((item, idx) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: idx % 2 === 0 ? 0 : 40 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                delay: idx * 0.15,
                                duration: 0.8,
                                ease: [0.21, 0.45, 0.32, 0.9] as const
                            }}
                            className={`relative h-[550px] ${idx % 2 !== 0 ? 'md:mt-0' : 'md:mt-0'}`}
                        >
                            <Link href={item.link} className="group block h-full w-full">
                                <div className="h-full w-full relative rounded-[3rem] overflow-hidden bg-white border border-blue-100/50 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_40px_80px_-20px_rgba(59,130,246,0.25)] group-hover:-translate-y-2 transition-all duration-500">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />

                                    {/* Cinematic Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                                    <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    <div className="absolute bottom-10 left-8 right-8 z-20">
                                        {/* Floating Glass Label */}
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group/label"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter leading-none font-heading relative z-10">
                                                {item.title}
                                            </h3>

                                            <div className="flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-primary group-hover/label:text-white transition-all gap-2 relative z-10">
                                                Explore Collection
                                                <div className="relative">
                                                    <ArrowRight className="h-3 w-3 transition-transform group-hover/label:translate-x-2" />
                                                    <div className="absolute inset-0 bg-primary blur-lg opacity-0 group-hover/label:opacity-50" />
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
