'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function TrendingSpotlight({ data }: { data?: any }) {
    // Default fallback if no data
    const content = data || {
        hero: { image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', title: 'THE PRO GAMER EDIT', tag: 'New Arrival', link: '/search?category=laptops', description: 'Experience unpowered performance with our latest gaming rigs and high-refresh setups.' },
        sub1: { image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2072&auto=format&fit=crop', title: 'CONSOLE READY', link: '/search?category=gaming', description: 'Next-gen performance for the modern gamer.' },
        sub2: { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop', title: 'AUDIOPHILE GRADE', link: '/search?category=audio', description: 'Studio-quality sound for every moment.' }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.21, 0.45, 0.32, 0.9] as const }
        }
    }

    return (
        <section className="py-24 bg-transparent overflow-hidden">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="max-w-7xl mx-auto px-6"
            >
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <Sparkles className="h-4 w-4 fill-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Curated Essentials</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-[-0.04em] text-slate-900 leading-none font-heading">
                            In The <span className="text-blue-600">Spotlight</span>
                        </h2>
                    </div>
                    <Link href="/products" className="group mt-4 md:mt-0 flex items-center text-[10px] font-black text-slate-500 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors">
                        View All Collections <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    {/* Large Featured Item (8/12 columns) */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-8 group relative rounded-[2rem] overflow-hidden bg-white border border-blue-100/50 shadow-2xl shadow-blue-500/5"
                    >
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] as const }}
                            className="relative h-[600px] w-full"
                        >
                            <Image
                                src={content.hero.image}
                                alt={content.hero.title}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Mesh Overlay for Text Legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent z-10" />

                            <div className="absolute bottom-12 left-12 right-12 z-20">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="space-y-4"
                                >
                                    <span className="inline-block bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-2">
                                        {content.hero.tag}
                                    </span>
                                    <h3 className="text-4xl md:text-6xl font-black text-white uppercase leading-[0.85] tracking-tighter max-w-xl">
                                        {content.hero.title}
                                    </h3>
                                    <p className="text-slate-300 text-sm md:text-base font-medium max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {content.hero.description}
                                    </p>
                                    <div className="pt-4">
                                        <Link href={content.hero.link} className="inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-4 font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-blue-600 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl">
                                            Explore Now <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Secondary Stacked Items (4/12 columns) */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        {[content.sub1, content.sub2].map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="flex-1 group relative rounded-[2rem] overflow-hidden bg-white border border-blue-100/50 shadow-xl shadow-blue-500/5 min-h-[288px]"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] as const }}
                                    className="relative h-full w-full"
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />

                                    <div className="absolute bottom-8 left-8 right-8 z-20">
                                        <h3 className="text-xl md:text-2xl font-black text-white uppercase leading-none tracking-tighter mb-3">
                                            {item.title}
                                        </h3>
                                        <Link href={item.link} className="inline-flex items-center text-[9px] font-black text-blue-400 group-hover:text-white uppercase tracking-widest transition-colors">
                                            Shop Collection <ArrowRight className="ml-2 h-3 w-3" />
                                        </Link>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
