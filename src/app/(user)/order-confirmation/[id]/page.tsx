'use client'

import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
    const { clearCart } = useCart()

    useEffect(() => {
        // Clear cart on successful landing
        clearCart()
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
                <div className="bg-gray-900 border border-gray-800 rounded p-3 font-mono text-sm break-all text-orange-500">
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
