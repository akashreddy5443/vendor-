'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
            className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-black group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image - Full Width */}
                    <div className="absolute inset-0">
                        <Image
                            src={currentSlide.imageUrl}
                            alt={currentSlide.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                        {/* Gradient Overlay for Text Readability - Darker for better contrast */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                    </div>

                    {/* Text Content - Overlaid */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-8 md:px-20 lg:px-32">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm md:text-base font-bold text-blue-400 mb-4 uppercase tracking-[0.2em]"
                        >
                            {currentSlide.subtitle}
                        </motion.h3>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tight uppercase max-w-4xl drop-shadow-2xl"
                            style={{ color: currentSlide.color }}
                        >
                            {currentSlide.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link
                                href={currentSlide.link}
                                className="inline-flex items-center justify-center px-10 py-4 text-sm font-bold text-[#0B1026] bg-white hover:bg-blue-50 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 uppercase tracking-wider"
                            >
                                {currentSlide.buttonText}
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
