'use client'

import { useEffect, useState } from 'react'

export function SpotlightCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY })
            setOpacity(1)
        }

        const handleMouseLeave = () => {
            setOpacity(0)
        }

        // Only run on client and if matchMedia matches 'hover: hover' (desktop)
        if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseleave', handleMouseLeave)

            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseleave', handleMouseLeave)
            }
        }
    }, [])

    return (
        <div
            className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500"
            style={{ opacity }}
        >
            <div
                className="absolute h-[600px] w-[600px] opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
                    transform: `translate(${position.x - 300}px, ${position.y - 300}px)`,
                    willChange: 'transform',
                }}
            />
        </div>
    )
}
