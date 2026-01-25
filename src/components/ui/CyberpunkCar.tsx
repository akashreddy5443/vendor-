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
                {/* Crop Container for Pixel Art Car */}
                <div className="relative w-[200px] h-[100px] overflow-hidden rounded-lg">
                    {/* The Image is scaled and positioned to hide the footer text */}
                    {/* Assuming image is roughly square/rectangular with text at bottom. 
                        We scale it up slightly and shift it up. */}
                    <img
                        src="/car-pixel.png"
                        alt="Cyberpunk Car"
                        className="w-full h-full object-cover object-top scale-110 -translate-y-2 mix-blend-screen"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    {/* Add a manual glow since the image background might be grey */}
                    <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay rounded-lg" />
                </div>

                {/* Thruster Flame (Simulated) */}
                <motion.div
                    className="absolute top-1/2 -left-8 w-12 h-6 bg-cyan-500/80 blur-md rounded-full"
                    animate={{ scaleX: [1, 1.5, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                />
            </motion.div>
        </div>
    )
}
