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
            className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-slate-950 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Cinematic Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={currentSlide.imageUrl}
                            alt={currentSlide.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                        {/* Cinematic Gradient: Subtle vignette + clean text legibility zone */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 opacity-60" />
                    </div>

                    {/* Content Layer - Offset Layout */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-0">
                        <div className="md:ml-[12%] max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="flex items-center gap-4 mb-6"
                            >
                                <div className="h-[2px] w-12 bg-white/50" />
                                <h3 className="text-xs md:text-sm font-medium text-white/80 uppercase tracking-[0.3em]">
                                    {currentSlide.subtitle}
                                </h3>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                                className="text-5xl md:text-8xl lg:text-9xl font-black text-white mb-10 leading-[0.9] tracking-tighter"
                                style={{ color: currentSlide.color }}
                            >
                                {currentSlide.title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                <Link
                                    href={currentSlide.link}
                                    className="inline-flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest hover:gap-5 transition-all duration-300 group/btn"
                                >
                                    <span className="border-b border-white pb-1">{currentSlide.buttonText}</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
