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

    // Auto-advance
    useEffect(() => {
        if (slides.length <= 1) return
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [slides.length])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    }

    if (!slides || slides.length === 0) return null

    const currentSlide = slides[currentIndex]

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-white group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 h-full"
                >
                    {/* Left: Text Content - Centered better */}
                    <div className="flex flex-col justify-center items-start px-8 md:px-20 lg:px-32 bg-white z-10">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm md:text-base font-bold text-blue-600 mb-4 uppercase tracking-[0.2em]"
                        >
                            {currentSlide.subtitle}
                        </motion.h3>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0B1026] mb-8 leading-[0.9] tracking-tight uppercase max-w-xl"
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
                                className="inline-flex items-center justify-center px-10 py-4 text-sm font-bold text-white bg-[#0B1026] hover:bg-blue-600 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 uppercase tracking-wider"
                            >
                                {currentSlide.buttonText}
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: Image Content - More dynamic background */}
                    <div className="relative w-full h-full bg-gray-50 flex items-center justify-center hidden md:flex">
                        {/* Decorative Circle */}
                        <div className="absolute w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10" />

                        <div className="relative w-3/4 h-3/4">
                            <Image
                                src={currentSlide.imageUrl}
                                alt={currentSlide.title}
                                fill
                                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Mobile Image Overlay (Background) */}
                    <div className="md:hidden absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-white/90 z-10" />
                        <Image
                            src={currentSlide.imageUrl}
                            alt={currentSlide.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons - Cleaner Style */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gray-100 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 hover:scale-110"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gray-100 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 hover:scale-110"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-8 left-8 md:left-32 flex gap-3 z-20">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[#0B1026] w-8' : 'bg-gray-200 w-4 hover:bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
