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
        <section className="py-24 bg-[#020617] relative overflow-hidden">
            {/* Background "Alive" Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full translate-y-1/2 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="max-w-7xl mx-auto px-6 relative z-10"
            >
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <Sparkles className="h-4 w-4 fill-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Curated Essentials</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-white leading-none font-heading">
                            In The <span className="text-primary">Spotlight</span>
                        </h2>
                    </div>
                    <Link href="/products" className="group mt-4 md:mt-0 flex items-center text-[10px] font-black text-primary/80 hover:text-white uppercase tracking-[0.2em] transition-colors">
                        View All Collections <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                    {/* Large Featured Item (8/12 columns) */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-8 group relative rounded-2xl overflow-hidden bg-slate-900/40 border border-white/10 shadow-2xl"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] as const }}
                            className="relative h-[650px] w-full"
                        >
                            <Image
                                src={content.hero.image}
                                alt={content.hero.title}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Mesh Overlay for Text Legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent z-10" />

                            <div className="absolute bottom-12 left-12 right-12 z-20">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="space-y-5"
                                >
                                    <span className="inline-block bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-2 shadow-lg shadow-blue-500/20">
                                        {content.hero.tag}
                                    </span>
                                    <h3 className="text-5xl md:text-7xl font-black text-white leading-[0.85] tracking-tighter max-w-2xl font-heading">
                                        {content.hero.title}
                                    </h3>
                                    <p className="text-slate-300 text-sm md:text-base font-medium max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 leading-relaxed">
                                        {content.hero.description}
                                    </p>
                                    <div className="pt-6">
                                        <Link href={content.hero.link} className="inline-flex items-center gap-3 bg-white text-[#020617] px-10 py-5 font-black text-[11px] tracking-widest rounded-full hover:bg-blue-600 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-2xl">
                                            Explore Now <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Secondary Stacked Items (4/12 columns) */}
                    <div className="md:col-span-4 flex flex-col gap-8">
                        {[content.sub1, content.sub2].map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="flex-1 group relative rounded-2xl overflow-hidden bg-slate-900/40 border border-white/10 shadow-xl min-h-[300px]"
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-transparent to-transparent z-10" />

                                    <div className="absolute bottom-10 left-10 right-10 z-20">
                                        <h3 className="text-2xl font-black text-white leading-none tracking-tighter mb-4 font-heading">
                                            {item.title}
                                        </h3>
                                        <Link href={item.link} className="inline-flex items-center text-[10px] font-black text-primary group-hover:text-white tracking-widest transition-all gap-2">
                                            Shop Collection <ArrowRight className="h-3.5 w-3.5" />
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
