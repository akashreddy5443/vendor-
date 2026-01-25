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
                <div className="relative w-[300px] h-[100px] overflow-visible">
                    <img
                        src="/car-pixel-v2.jpg"
                        alt="Cyberpunk Car"
                        className="w-full h-[120%] object-cover object-[center_55%] scale-100"
                        style={{
                            imageRendering: 'pixelated',
                            // Polygon crop to hide background box, matching the car shape roughly
                            // Points: Top-Left Hood, Roof start, Roof end, Trunk top, Trunk bot, Wheel Bot, Front Bot
                            clipPath: 'polygon(5% 25%, 33% 20%, 60% 20%, 93% 40%, 95% 88%, 5% 88%)'
                        }}
                    />
                </div>

                {/* Thruster Flame */}
                <motion.div
                    className="absolute top-[40%] left-[2%] w-10 h-6 bg-purple-500/80 blur-md rounded-full mix-blend-screen"
                    animate={{ scaleX: [1, 2, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                />

                {/* Underglow */}
                <div className="absolute top-[78%] left-[10%] right-[10%] h-8 bg-purple-600/50 blur-xl rounded-full" />
            </motion.div>
        </div>
    )
}
