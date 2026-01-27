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
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-white shadow-sm border-b border-gray-100 group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 h-full"
                >
                    {/* Left: Text Content */}
                    <div className="flex flex-col justify-center items-start px-8 md:px-16 lg:px-24 bg-white z-10">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg font-bold text-primary mb-2 uppercase tracking-wider"
                        >
                            {currentSlide.subtitle}
                        </motion.h3>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight"
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
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-primary hover:bg-emerald-600 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {currentSlide.buttonText}
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: Image Content */}
                    <div className="relative w-full h-full bg-secondary/30 hidden md:block">
                        <Image
                            src={currentSlide.imageUrl}
                            alt={currentSlide.title}
                            fill
                            className="object-contain p-8 mix-blend-multiply"
                            priority
                        />
                    </div>
                    {/* Mobile Image (Background) - Fallback if needed, or simple stack */}
                    <div className="md:hidden absolute inset-0 -z-10 opacity-10">
                        <Image
                            src={currentSlide.imageUrl}
                            alt={currentSlide.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-8' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
