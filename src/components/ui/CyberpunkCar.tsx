'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CyberpunkCar() {
    const [windowWidth, setWindowWidth] = useState(1000)
    const controls = useAnimation()

    useEffect(() => {
        setWindowWidth(window.innerWidth)

        const sequence = async () => {
            while (true) {
                // Reset
                await controls.set({ x: -300, y: -150, rotate: -5, opacity: 0 })

                // Appear & Fly In (Downards)
                await controls.start({
                    x: 100,
                    y: 0,
                    rotate: 0,
                    opacity: 1,
                    transition: { duration: 2, ease: "easeOut" }
                })

                // "Land" Suspension Bounce
                await controls.start({ y: 2, transition: { duration: 0.1 } })
                await controls.start({ y: 0, transition: { duration: 0.1 } })

                // Idle / Rev for a split second
                await controls.start({ x: 150, transition: { duration: 0.5, ease: "linear" } })

                // Speed Off
                await controls.start({
                    x: window.innerWidth + 300,
                    transition: { duration: 2.5, ease: "easeIn" }
                })

                // Wait before next loop
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }

        sequence()
    }, [controls])

    return (
        <div className="absolute bottom-10 left-0 right-0 h-40 pointer-events-none z-30 overflow-hidden">
            <motion.div
                animate={controls}
                className="absolute bottom-4"
            >
                {/* Advanced DeLorean-style SVG */}
                <svg width="220" height="80" viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2a2a2a" />
                            <stop offset="50%" stopColor="#1a1a1a" />
                            <stop offset="100%" stopColor="#000" />
                        </linearGradient>
                        <linearGradient id="windowGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff00cc" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#330033" stopOpacity="0.8" />
                        </linearGradient>
                        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Thruster Flame (Only visible when flying? We'll transform it) */}
                    <motion.path
                        d="M0 45 L-20 40 L-40 45 L-20 50 Z"
                        fill="#00f3ff"
                        opacity="0.8"
                        animate={{ scaleX: [1, 1.5, 1], opacity: [0.6, 0.9, 0.6] }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                        filter="url(#neonGlow)"
                    />

                    {/* Main Body Shape */}
                    <path d="M10 50 L20 40 L50 38 L80 25 L140 25 L190 38 L210 50 H10 Z" fill="url(#bodyGrad)" stroke="#333" strokeWidth="1" />

                    {/* Retro Grid Accent on Side */}
                    <path d="M20 50 L190 50" stroke="#ff00cc" strokeWidth="2" filter="url(#neonGlow)" />

                    {/* Cabin / Windows */}
                    <path d="M55 38 L82 27 L135 27 L155 38 H55 Z" fill="url(#windowGrad)" stroke="#00f3ff" strokeWidth="0.5" />

                    {/* Rear Spoiler */}
                    <path d="M10 40 L5 30 L20 30" stroke="#333" strokeWidth="2" />

                    {/* Wheels (Detailed) */}
                    <g className="origin-center">
                        <circle cx="45" cy="50" r="14" fill="#000" stroke="#333" strokeWidth="2" />
                        <circle cx="45" cy="50" r="10" fill="none" stroke="#00f3ff" strokeWidth="1.5" strokeDasharray="4 2" className="animate-spin-slow">
                            {/* CSS spin matches parent motion speed roughly */}
                            <animateTransform attributeName="transform" type="rotate" from="0 45 50" to="360 45 50" dur="0.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="45" cy="50" r="4" fill="#ff00cc" filter="url(#neonGlow)" />
                    </g>

                    <g className="origin-center">
                        <circle cx="170" cy="50" r="14" fill="#000" stroke="#333" strokeWidth="2" />
                        <circle cx="170" cy="50" r="10" fill="none" stroke="#00f3ff" strokeWidth="1.5" strokeDasharray="4 2">
                            <animateTransform attributeName="transform" type="rotate" from="0 170 50" to="360 170 50" dur="0.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="170" cy="50" r="4" fill="#ff00cc" filter="url(#neonGlow)" />
                    </g>

                    {/* Underglow */}
                    <ellipse cx="110" cy="62" rx="90" ry="4" fill="#ff00cc" opacity="0.3" filter="url(#neonGlow)" />
                </svg>
            </motion.div>
        </div>
    )
}
