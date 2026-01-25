'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CyberpunkCar() {
    const [windowWidth, setWindowWidth] = useState(1000)
    const controls = useAnimation()

    useEffect(() => {
        setWindowWidth(window.innerWidth)
        const centerPos = window.innerWidth / 2 - 140 // Center

        const sequence = async () => {
            while (true) {
                // 1. Reset Position (Off-screen Left)
                await controls.set({ x: -400, y: 100, rotate: 0, scale: 1, opacity: 0 })

                // 2. Fly In Smoothly (Arc up)
                await controls.start({
                    x: centerPos,
                    y: 0,
                    opacity: 1,
                    transition: { duration: 1.5, ease: "easeOut" }
                })

                // 3. Float/Hover Animation (Breathing)
                await controls.start({ y: -20, transition: { duration: 1.5, ease: "easeInOut" } })
                await controls.start({ y: 0, transition: { duration: 1.5, ease: "easeInOut" } })

                // 4. 360 Spin (Barrel Roll)
                await controls.start({
                    rotate: 360,
                    scale: 1.1,
                    transition: { duration: 0.8, ease: "easeInOut" }
                })
                // Instant reset to 0 rotation to avoid winding up next time
                await controls.set({ rotate: 0, scale: 1 })

                // 5. Rev Up (Tilt back slightly)
                await controls.start({
                    x: centerPos - 50, // Pull back slightly like a spring
                    rotate: -5,
                    transition: { duration: 0.5, ease: "easeOut" }
                })

                // 6. Blast Off Right
                await controls.start({
                    x: window.innerWidth + 500,
                    rotate: 5, // Nose down for speed or up depending on style, let's go slight tilt
                    transition: { duration: 1.2, ease: "backIn" } // backIn gives it that "launch" snap
                })

                // Wait before next car
                await new Promise(resolve => setTimeout(resolve, 1500))
            }
        }

        sequence()
    }, [controls])

    return (
        <div className="absolute bottom-10 left-0 right-0 h-48 pointer-events-none z-30 overflow-hidden flex items-end">
            <motion.div
                animate={controls}
                className="absolute bottom-10 left-0"
            >
                {/* Car Container - Increased size slightly */}
                <div className="relative w-[320px] h-[110px]">
                    <img
                        src="/car-pixel-v3.png"
                        alt="Cyberpunk Car"
                        // Tweaking fit to ensure it looks good
                        className="w-full h-full object-contain mix-blend-screen"
                        style={{
                            imageRendering: 'pixelated',
                        }}
                    />
                </div>

                {/* Thruster Flame (Dynamic) */}
                <motion.div
                    className="absolute top-[55%] -left-8 w-20 h-8 bg-cyan-500 blur-lg rounded-full opacity-80"
                    animate={{ scaleX: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                />

                {/* Underglow */}
                <div className="absolute top-[80%] left-6 right-6 h-6 bg-purple-600/70 blur-xl rounded-full" />
            </motion.div>
        </div>
    )
}
