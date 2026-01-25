'use client'

import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
    const { clearCart } = useCart()

    useEffect(() => {
        // Clear cart on successful landing
        clearCart()

        // Fire Confetti!
        const duration = 3 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now()
            if (timeLeft <= 0) {
                return clearInterval(interval)
            }
            const particleCount = 50 * (timeLeft / duration)
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
        }, 250)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-black text-white min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle className="h-24 w-24 text-green-500" />
                </div>

                <h1 className="text-4xl font-serif font-bold">Order Placed!</h1>
                <p className="text-gray-400">
                    Thank you for your purchase. Your order ID is:
                </p>
                <div className="bg-gray-900 border border-gray-800 rounded p-3 font-mono text-sm break-all text-blue-500">
                    {params.id}
                </div>

                <div className="pt-8">
                    <Link
                        href="/products"
                        className="inline-block rounded-full bg-white px-8 py-3 text-black font-bold hover:bg-gray-200 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    )
}
