'use client'

import Link from 'next/link'
import { CheckCircle, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')

    return (
        <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-500">
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                <CheckCircle className="h-24 w-24 text-green-500 relative z-10 mx-auto" />
            </div>

            <div className="space-y-2">
                <h1 className="text-4xl font-bold font-serif text-white">Order Confirmed!</h1>
                <p className="text-gray-400">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>
                {orderId && (
                    <p className="text-sm font-mono text-gray-500 bg-zinc-900 py-1 px-3 rounded-full inline-block">
                        Order ID: {orderId}
                    </p>
                )}
            </div>

            <div className="space-y-3 pt-4">
                <Link
                    href="/user/orders"
                    className="block w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-500 transition-colors"
                >
                    Track My Order
                </Link>
                <Link
                    href="/products"
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-zinc-700 bg-transparent py-3 font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                    <ShoppingBag className="h-4 w-4" /> Continue Shopping
                </Link>
            </div>
        </div>
    )
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-gray-400">Loading order details...</p>
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    )
}
