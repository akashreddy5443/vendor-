'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, Quote, X } from 'lucide-react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

export function TrendingSpotlight({ data }: { data?: any }) {
    const ref = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)

    const toggleMute = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

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
        <section ref={ref} className="py-12 md:py-32 bg-slate-950 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="w-full max-w-[1800px] mx-auto px-4 md:px-12 lg:px-16 relative z-10">

                {/* Section Header - Editorial Style */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-24 gap-4 md:gap-8 text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <span className="block text-indigo-500 font-bold tracking-[0.3em] uppercase text-xs mb-3 md:mb-4">
                            — {content.hero.tag || 'Featured Story'}
                        </span>
                        <h2 className="text-4xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter font-heading">
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
                            {content.hero.description || 'Explore a collection defined by precision, aesthetics, and raw performance. This is gear for the modern visionary.'}
                        </p>
                    </motion.div>
                </div>

                {/* Main Feature Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:min-h-[800px]">

                    {/* Left Column: Narrative & Sub-stories (4 Cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8 justify-between order-2 lg:order-1">

                        {/* Quote Block */}
                        <div className="p-6 md:p-8 border-l-2 border-indigo-500/30 bg-white/5 backdrop-blur-sm rounded-r-2xl">
                            <Quote className="w-6 h-6 md:w-8 md:h-8 text-indigo-500 mb-4 opacity-50" />
                            <p className="text-lg md:text-2xl text-slate-200 font-serif italic leading-relaxed mb-6">
                                "{content.hero.quote || content.hero.description || 'Design is not just what it looks like and feels like. Design is how it works.'}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                                </div>
                                <div>
                                    <span className="block text-white text-xs font-bold uppercase tracking-wider">{content.hero.role || 'Editor in Chief'}</span>
                                    <span className="block text-slate-500 text-[10px] uppercase">{content.hero.author || 'Vendor Tech'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sub Stories (Small Cards) */}
                        <div className="flex flex-col gap-4">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-2">Related Collections</span>
                            {[content.sub1, content.sub2].map((item: any, idx: number) => (
                                <Link key={idx} href={item.link} className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-800 transition-all">
                                    <div className="w-16 h-16 md:w-20 md:h-20 relative rounded-lg overflow-hidden flex-shrink-0">
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

                    {/* Right Column: Hero Media (8 Cols) */}
                    <div
                        className="lg:col-span-8 relative min-h-[400px] md:min-h-[500px] lg:h-auto rounded-[2rem] md:rounded-[2.5rem] overflow-hidden order-1 lg:order-2 group bg-slate-900 shadow-2xl shadow-indigo-500/10 cursor-pointer"
                        onClick={toggleMute}
                    >
                        {/* Video Layer (Always On) */}
                        {content.hero.video ? (
                            <>
                                <video
                                    ref={videoRef}
                                    src={content.hero.video}
                                    className="absolute inset-0 w-full h-full object-cover z-0"
                                    autoPlay
                                    loop
                                    muted={isMuted}
                                    playsInline
                                />
                                {/* Mute Toggle Button */}
                                <button
                                    onClick={toggleMute}
                                    className="absolute top-6 right-6 z-30 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all border border-white/10"
                                >
                                    {isMuted ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                                    )}
                                </button>

                                {/* Audio Hint Toast (Fade out after interaction) */}
                                <div className={`absolute top-6 right-20 z-30 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 transition-opacity duration-500 ${!isMuted ? 'opacity-0' : 'opacity-100'}`}>
                                    Tap for Sound
                                </div>
                            </>
                        ) : (
                            <motion.div style={{ y }} className="absolute inset-0 h-[120%] w-full -top-[10%]">
                                <Image
                                    src={content.hero.image}
                                    alt={content.hero.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                            </motion.div>
                        )}

                        {/* Cinematic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 z-10 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent z-10 pointer-events-none" />

                        {/* Floating Content on Image */}
                        <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 max-w-xl z-20 pointer-events-none">
                            <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none font-heading shadow-black drop-shadow-lg text-left">
                                {content.hero.title}
                            </h3>
                            <div className="pointer-events-auto inline-block" onClick={(e) => e.stopPropagation()}>
                                <Link href={content.hero.link} className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all group-hover:gap-5">
                                    Shop The Look <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
