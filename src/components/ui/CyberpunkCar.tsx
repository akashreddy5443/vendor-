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
                {/* Crop Container for New Pixel Art Car */}
                {/* Image has grey background and 'Wan' logo at bottom right. 
                    We zoom in (scale) and clip sides/bottom. */}
                <div className="relative w-[280px] h-[100px] overflow-hidden rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] bg-transparent">
                    <img
                        src="/car-pixel-v2.jpg"
                        alt="Cyberpunk Car"
                        className="w-full h-full object-cover object-[center_60%] scale-125"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    {/* Overlay to tint the grey background to be more seamless if possible, or just look cool */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-multiply" />
                </div>

                {/* Thruster Flame */}
                <motion.div
                    className="absolute top-1/2 -left-4 w-16 h-8 bg-purple-500/80 blur-lg rounded-full mix-blend-screen"
                    animate={{ scaleX: [1, 1.3, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                />

                {/* Underglow (Purple for this car) */}
                <div className="absolute -bottom-4 left-10 right-10 h-4 bg-purple-600/40 blur-xl rounded-full" />
            </motion.div>
        </div>
    )
}
