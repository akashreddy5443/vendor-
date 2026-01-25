'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CyberpunkCar() {
    const [windowWidth, setWindowWidth] = useState(1000)

    useEffect(() => {
        setWindowWidth(window.innerWidth)
    }, [])

    return (
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none z-20">
            {/* Road/Grid Line */}
            <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

            <motion.div
                className="absolute bottom-4 left-[-200px]"
                animate={{
                    x: [-200, windowWidth + 200], // Go across screen
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 2
                }}
            >
                {/* Simplified Cyberpunk Car SVG */}
                <svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Body Glow */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Main Body */}
                    <path d="M10 45 L30 35 L60 35 L90 20 L130 20 L160 35 L170 45 H10 Z" fill="#111" stroke="#00f3ff" strokeWidth="2" filter="url(#glow)" />

                    {/* Windows */}
                    <path d="M65 33 L92 22 L125 22 L150 33 H65 Z" fill="#000" stroke="#ea580c" strokeWidth="1" />

                    {/* Wheels */}
                    <circle cx="40" cy="45" r="12" fill="#111" stroke="#ea580c" strokeWidth="2" className="animate-spin-slow">
                        <animateTransform attributeName="transform" type="rotate" from="0 40 45" to="360 40 45" dur="1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="140" cy="45" r="12" fill="#111" stroke="#ea580c" strokeWidth="2">
                        <animateTransform attributeName="transform" type="rotate" from="0 140 45" to="360 140 45" dur="1s" repeatCount="indefinite" />
                    </circle>

                    {/* Neon Undeglow */}
                    <ellipse cx="90" cy="55" rx="70" ry="3" fill="#00f3ff" opacity="0.3" filter="url(#glow)" />

                    {/* Trail Lines */}
                    <path d="M-20 25 H0" stroke="#00f3ff" strokeWidth="1" opacity="0.5" />
                    <path d="M-40 35 H-10" stroke="#ea580c" strokeWidth="1" opacity="0.5" />
                    <path d="M-30 45 H0" stroke="#00f3ff" strokeWidth="1" opacity="0.5" />
                </svg>
            </motion.div>
        </div>
    )
}
