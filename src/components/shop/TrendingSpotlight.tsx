'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, Quote } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function TrendingSpotlight({ data }: { data?: any }) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [100, -100])

    const content = data || {
        hero: { image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070', title: 'The Pro Gamer Edit', tag: 'Curator Choice', link: '/search?category=laptops', description: 'Experience unpowered performance with our latest gaming rigs. Engineered for those who refuse to compromise on frame rates or aesthetics.' },
        sub1: { image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2072', title: 'Console Ready', link: '/search?category=gaming', description: 'Next-gen performance.' },
        sub2: { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070', title: 'Audiophile Grade', link: '/search?category=audio', description: 'Studio-quality sound.' }
    }

    return (
        <section ref={ref} className="py-24 md:py-32 bg-slate-950 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="w-full max-w-[1800px] mx-auto px-4 md:px-12 lg:px-16 relative z-10">

                {/* Section Header - Editorial Style */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 md:mb-24 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <span className="block text-indigo-500 font-bold tracking-[0.3em] uppercase text-xs mb-4">
                            — {content.hero.tag || 'Featured Story'}
                        </span>
                        <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter font-heading">
                            The Creator's <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-white">Sanctuary</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="hidden md:block max-w-sm text-right"
                    >
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            Explore a collection defined by precision, aesthetics, and raw performance. This is gear for the modern visionary.
                        </p>
                    </motion.div>
                </div>

                {/* Main Feature Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[600px] lg:min-h-[800px]">

                    {/* Left Column: Narrative & Sub-stories (4 Cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-8 justify-between order-2 lg:order-1">

                        {/* Quote Block */}
                        <div className="p-8 border-l-2 border-indigo-500/30 bg-white/5 backdrop-blur-sm rounded-r-2xl">
                            <Quote className="w-8 h-8 text-indigo-500 mb-4 opacity-50" />
                            <p className="text-xl md:text-2xl text-slate-200 font-serif italic leading-relaxed mb-6">
                                "{content.hero.description || 'Design is not just what it looks like and feels like. Design is how it works.'}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                                    {/* Placeholder Avatar */}
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                                </div>
                                <div>
                                    <span className="block text-white text-xs font-bold uppercase tracking-wider">Editor in Chief</span>
                                    <span className="block text-slate-500 text-[10px] uppercase">Vendor Tech</span>
                                </div>
                            </div>
                        </div>

                        {/* Sub Stories (Small Cards) */}
                        <div className="flex flex-col gap-4">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-2">Related Collections</span>
                            {[content.sub1, content.sub2].map((item, idx) => (
                                <Link key={idx} href={item.link} className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-800 transition-all">
                                    <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                        <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold leading-tight mb-1 group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider group-hover:text-slate-300">View Collection</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Hero Image (8 Cols) */}
                    <div className="lg:col-span-8 relative h-[500px] lg:h-auto rounded-[2.5rem] overflow-hidden order-1 lg:order-2 group">
                        <motion.div style={{ y }} className="absolute inset-0 h-[120%] w-full -top-[10%]">
                            <Image
                                src={content.hero.image}
                                alt={content.hero.title}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                priority
                            />
                        </motion.div>

                        {/* Cinematic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent" />

                        {/* Floating Content on Image */}
                        <div className="absolute bottom-12 left-8 md:left-12 max-w-xl">
                            <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none font-heading shadow-black drop-shadow-lg">
                                {content.hero.title}
                            </h3>
                            <Link href={content.hero.link} className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all group-hover:gap-5">
                                Shop The Look <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Video Trigger (Visual Only) */}
                        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-indigo-600 transition-all scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 duration-500">
                            <Play className="w-8 h-8 fill-current" />
                        </button>
                    </div>

                </div>
            </div>
        </section>
    )
}
