'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CyberpunkCar() {
    const [windowWidth, setWindowWidth] = useState(1000)
    const [carState, setCarState] = useState<'idle' | 'hover' | 'rev' | 'blast'>('idle')
    const controls = useAnimation()

    useEffect(() => {
        setWindowWidth(window.innerWidth)
        const centerPos = window.innerWidth / 2 - 160

        const sequence = async () => {
            while (true) {
                // 1. Reset
                setCarState('idle')
                await controls.set({ x: -400, y: 100, rotate: 0, scale: 1, opacity: 0 })

                // 2. Fly In
                setCarState('hover')
                await controls.start({
                    x: centerPos,
                    y: 0,
                    opacity: 1,
                    transition: { duration: 1.5, ease: "easeOut" }
                })

                // 3. Float/Hover
                await controls.start({ y: -20, transition: { duration: 1.5, ease: "easeInOut" } })
                await controls.start({ y: 0, transition: { duration: 1.5, ease: "easeInOut" } })

                // 4. Spin
                await controls.start({
                    rotate: 360,
                    scale: 1.1,
                    transition: { duration: 0.8, ease: "easeInOut" }
                })
                await controls.set({ rotate: 0, scale: 1 })

                // 5. Rev Up
                setCarState('rev')
                await controls.start({
                    x: centerPos - 50,
                    rotate: -5,
                    transition: { duration: 0.5, ease: "easeOut" }
                })

                // 6. Blast Off
                setCarState('blast')
                await controls.start({
                    x: window.innerWidth + 500,
                    rotate: 5,
                    transition: { duration: 1.0, ease: "backIn" }
                })

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
                {/* Advanced Nitro Flame Container - Aligned to Rear Exhaust */}
                {/* Moved to extreme left (0.2%) for pixel-perfect alignment */}
                <div className="absolute top-[58%] left-[0.2%] z-0 w-32 h-20 origin-right pointer-events-none -translate-y-1/2">
                    {/* 1. Core White Hot Flame */}
                    <motion.div
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white blur-[2px] rounded-l-full"
                        animate={
                            carState === 'blast' ? { width: [60, 180], height: [10, 20], opacity: 1 } :
                                carState === 'rev' ? { width: [40, 60], height: 8, opacity: 0.9 } :
                                    { width: [20, 25], height: 6, opacity: 0.8 }
                        }
                        transition={{ duration: 0.1, repeat: Infinity, repeatType: "reverse" }}
                    />

                    {/* 2. Inner Cyan Flame */}
                    <motion.div
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-400 blur-md rounded-l-full"
                        animate={
                            carState === 'blast' ? { width: [100, 250], height: [20, 40], opacity: 0.8 } :
                                carState === 'rev' ? { width: [60, 80], height: 15, opacity: 0.7 } :
                                    { width: [30, 40], height: 12, opacity: 0.6 }
                        }
                        transition={{ duration: 0.1, delay: 0.05, repeat: Infinity, repeatType: "reverse" }}
                    />

                    {/* 3. Outer Purple/Gas Trail */}
                    <motion.div
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-purple-600 blur-xl rounded-l-full mix-blend-screen"
                        animate={
                            carState === 'blast' ? { width: [150, 350], height: [40, 70], opacity: 0.6 } :
                                carState === 'rev' ? { width: [80, 100], height: 30, opacity: 0.5 } :
                                    { width: [40, 50], height: 20, opacity: 0.4 }
                        }
                        transition={{ duration: 0.15, repeat: Infinity, repeatType: "reverse" }}
                    />

                    {/* 4. Particles / Sparks */}
                    {(carState === 'blast' || carState === 'rev') && (
                        <>
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute right-4 top-1/2 w-1 h-1 bg-white rounded-full"
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    animate={{
                                        x: -200 - Math.random() * 100,
                                        y: (Math.random() - 0.5) * 50,
                                        opacity: 0
                                    }}
                                    transition={{ duration: 0.4, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
                                />
                            ))}
                        </>
                    )}
                </div>

                {/* Car Container - Relative Z-10 to stay ON TOP of flame */}
                <div className="relative z-10 w-[320px] h-[110px]">
                    <img
                        src="/car-pixel-v3.png"
                        alt="Cyberpunk Car"
                        className="w-full h-full object-contain mix-blend-screen"
                        style={{
                            imageRendering: 'pixelated',
                        }}
                    />
                </div>

                {/* Underglow - Adjusted to be underneath everything */}
                <div className="absolute top-[85%] left-10 right-10 h-6 bg-purple-600/70 blur-xl rounded-full z-0" />
            </motion.div>
        </div>
    )
}
