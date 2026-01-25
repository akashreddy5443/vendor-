'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CyberpunkCar() {
    const [windowWidth, setWindowWidth] = useState(1000)
    const controls = useAnimation()

    useEffect(() => {
        setWindowWidth(window.innerWidth)
        const centerPos = window.innerWidth / 2 - 140 // Center - half car width

        const sequence = async () => {
            while (true) {
                // 1. Reset Position (Off-screen Left)
                await controls.set({ x: -400, y: 50, rotate: 0, scaleX: 1, opacity: 1 }) // Start low

                // 2. Full Speed Entry (slide in to center)
                await controls.start({
                    x: centerPos,
                    y: 50,
                    transition: { duration: 1.2, ease: "circOut" }
                })

                // 3. Fly Up (Hover Mode Engage)
                await controls.start({
                    y: -50,
                    rotate: -10, // Tilt up
                    transition: { duration: 0.8, ease: "easeInOut" }
                })

                // 4. Hover Up and Down (Float)
                await controls.start({ y: -80, rotate: 0, transition: { duration: 1, ease: "easeInOut" } })
                await controls.start({ y: -20, transition: { duration: 1, ease: "easeInOut" } })

                // 5. 360 Spin (Barrel Roll / Backflip)
                await controls.start({
                    rotate: 360,
                    scale: 1.2, // Zoom slightly
                    transition: { duration: 0.8, ease: "backInOut" }
                })
                // Reset rotation to 0 (visually identical) instantly
                await controls.set({ rotate: 0, scale: 1 })

                // 6. "Go Back" - Turn Around and Fly Away Left
                // Flip image to face left
                await controls.start({ scaleX: -1, transition: { duration: 0.3 } })

                // Speed off to left
                await controls.start({
                    x: -500,
                    rotate: -5,
                    transition: { duration: 1.0, ease: "backIn" }
                })

                // Wait before repeating
                await new Promise(resolve => setTimeout(resolve, 2000))
            }
        }

        sequence()
    }, [controls])

    return (
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-30 overflow-hidden flex items-end">
            <motion.div
                animate={controls}
                className="absolute bottom-10 left-0" // Using absolute positioning driven by controls.x
            >
                {/* Car Container */}
                <div className="relative w-[280px] h-[100px]">
                    {/* The Image - V3 */}
                    {/* Assuming white background, using blend mode to remove it on dark background */}
                    <img
                        src="/car-pixel-v3.png"
                        alt="Cyberpunk Car"
                        className="w-full h-full object-contain mix-blend-screen" // Screen or Lighten usually keeps lights, drops blacks? 
                        // Wait, if it has WHITE background and we are on DARK, we want Multiply to keep darks? 
                        // No, removing WHITE background on DARK requires Multiply? No, Multiply keeps BLACK. 
                        // We want to remove WHITE. Multiply: 1 * Color = Color. 0 * Color = 0. White is 1. Black is 0. 
                        // So Multiply on Dark Background: The White pixels (1) will become transparent? 
                        // No. White (1) * Dark (0.1) = 0.1. So White becomes Dark. Yes!
                        // But the car is dark? If car is dark pixel art, Multiply works.
                        // If car is neon (bright), Multiply might darken it.
                        // Let's try MIX-BLEND-MULTIPLY. 
                        // Ensure parent has z-index context right. 
                        // Actually better to use a tight Clip Path if blend modes are risky.
                        style={{
                            imageRendering: 'pixelated',
                            // Tighter crop in case blend mode fails or artifacts appear
                            // clipPath: 'inset(10% 5% 10% 5%)'
                        }}
                    />

                    {/* Manual glow behind to separate from bg if multiply makes it too dark */}
                    {/* If we use Multiply, the white bg becomes transparent (showing the black hero bg). Ideally. */}
                </div>

                {/* Thruster Flame (Dynamic based on direction? We flip scaleX, so this flips too!) */}
                <motion.div
                    className="absolute top-[55%] -left-6 w-12 h-6 bg-cyan-500 blur-md rounded-full"
                    animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                />

                {/* Underglow */}
                <div className="absolute -bottom-4 left-4 right-4 h-6 bg-purple-600/60 blur-xl rounded-full" />
            </motion.div>
        </div>
    )
}
