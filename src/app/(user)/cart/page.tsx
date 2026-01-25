'use client'

import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart()

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-black text-white">
                <h2 className="text-2xl font-bold font-serif mb-4">Your cart is empty</h2>
                <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
                <Link
                    href="/products"
                    className="rounded-full bg-blue-600 px-8 py-3 font-bold text-white transition-all hover:bg-blue-500"
                >
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-black text-white min-h-screen py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h1 className="text-3xl font-bold font-serif mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        {items.map((item) => (
                            <div key={item.productId} className="flex gap-6 p-4 rounded-xl border border-gray-800 bg-gray-900/50">
                                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">No Image</div>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{item.title}</h3>
                                            <p className="text-blue-500 font-medium">{formatPrice(item.price)}</p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="flex items-center rounded-md border border-gray-700 bg-gray-950">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                className="p-1 px-3 text-gray-400 hover:text-white"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="p-1 px-3 text-gray-400 hover:text-white"
                                                disabled={item.quantity >= item.maxStock}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Total: <span className="text-white font-medium">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-sm text-red-500 hover:underline"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4 sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-white">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-500">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (Estimated)</span>
                                    <span className="text-white">₹0.00</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-xl font-bold text-blue-500">{formatPrice(cartTotal)}</span>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 rounded-full bg-blue-600 py-3 font-bold text-white transition-all hover:bg-blue-500 mt-4">
                                Proceed to Checkout
                                <ArrowRight className="h-4 w-4" />
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-2">
                                Checkout is not available in development mode yet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
