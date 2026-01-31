'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

// Define the structure of a single slide
export type HeroSlide = {
    id: string
    title: string
    subtitle: string
    imageUrl: string
    buttonText: string
    link: string
    color?: string // Optional text color override
}

interface HeroSliderProps {
    slides: HeroSlide[]
}

export function HeroSlider({ slides }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    // Auto-advance
    useEffect(() => {
        if (slides.length <= 1 || isHovered) return

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [currentIndex, isHovered, slides.length])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    }

    if (!slides || slides.length === 0) return null

    const currentSlide = slides[currentIndex]

    return (
        <div
            className="relative w-full h-[550px] md:h-[650px] lg:h-[700px] overflow-hidden bg-slate-950 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] as const }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image - Full Width */}
                    <div className="absolute inset-0">
                        <Image
                            src={currentSlide.imageUrl}
                            alt={currentSlide.title}
                            fill
                            className="object-cover scale-105"
                            priority
                            sizes="100vw"
                        />
                        {/* Adjusted Gradient - Heavy on left, light on right to show background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/70 via-40% to-slate-950/10 z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-10" />
                    </div>

                    {/* Text Content - Left Aligned */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-8 md:px-16 lg:px-24">
                        {/* Premium Glow Effect - positioned on left */}
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 blur-[150px] -z-10 pointer-events-none rounded-full" />

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="h-[2px] w-12 bg-primary" />
                            <h3 className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.4em]">
                                {currentSlide.subtitle}
                            </h3>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] as const }}
                            className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white mb-12 leading-[0.85] tracking-[-0.04em] max-w-5xl font-heading uppercase"
                            style={{
                                color: currentSlide.color,
                                textShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(59,130,246,0.2)'
                            }}
                        >
                            {currentSlide.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <Link
                                href={currentSlide.link}
                                className="inline-flex items-center justify-center px-10 py-4 md:px-14 md:py-5 text-[10px] md:text-xs font-black text-slate-950 bg-white hover:bg-primary hover:text-white rounded-full transition-all duration-300 shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 uppercase tracking-[0.25em] group"
                            >
                                {currentSlide.buttonText}
                                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons - Cleaner Style with Glassmorphism */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md hover:bg-white text-white hover:text-black shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30 hover:scale-110"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md hover:bg-white text-white hover:text-black shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30 hover:scale-110"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-8 left-8 md:left-32 flex gap-3 z-30">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-8' : 'bg-white/40 w-4 hover:bg-white/60'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
