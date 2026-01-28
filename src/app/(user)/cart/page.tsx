'use client'

import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2, ArrowRight, Tag, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal, subtotal, taxTotal, clearCart } = useCart()

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-white text-[#191970]">
                <div className="mb-6 h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🛒</span>
                </div>
                <h2 className="text-2xl font-bold font-serif mb-2">Your cart is empty</h2>
                <p className="text-[#191970]/70 mb-8 max-w-md">Looks like you haven't added anything yet. Explore our premium gear.</p>
                <Link
                    href="/products"
                    className="rounded-full bg-[#191970] text-white px-8 py-3 font-bold transition-transform hover:scale-105"
                >
                    Start Shopping
                </Link>
            </div>
        )
    }

    const shippingCost = cartTotal > 5000 ? 0 : 500
    const finalTotal = subtotal + taxTotal + shippingCost

    return (
        <div className="bg-white min-h-screen py-10 md:py-14 text-[#191970]">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-10 text-[#191970]">
                    My Shopping Cart ({items.reduce((a, b) => a + b.quantity, 0)})
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Left Column: Items */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Free Shipping Banner - Changed from Green to simple Text/Icon style */}
                        {cartTotal > 5000 && (
                            <div className="flex items-center gap-3 py-3 border-b-2 border-[#191970] text-[#191970] mb-4">
                                <ShieldCheck className="h-6 w-6" />
                                <span className="font-bold text-lg tracking-wide">YOU'VE EARNED FREE SHIPPING</span>
                            </div>
                        )}

                        <div className="bg-white">
                            {items.map((item) => (
                                <div key={item.productId} className="py-8 border-t border-gray-100 flex gap-6 md:gap-8">
                                    {/* Image */}
                                    <div className="relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0 bg-white border border-gray-100 rounded-sm">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm text-gray-300">No Image</div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-xl md:text-2xl text-[#191970] leading-tight mb-2">{item.title}</h3>
                                                <div className="text-sm text-[#191970]/70 mb-3 font-medium">
                                                    Style Number: {item.productId.slice(0, 8).toUpperCase()}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm font-semibold text-[#191970]">
                                                    <span>Size: Default</span>
                                                    <span className="text-gray-300">|</span>
                                                    <span>
                                                        {item.maxStock < 5 ? 'Low Stock' : 'In Stock'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-extrabold text-2xl md:text-3xl text-[#191970]">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
                                            {/* Quantity */}
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center border-2 border-[#191970] rounded-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="p-2 px-3 text-[#191970] hover:bg-[#191970] hover:text-white transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="p-2 px-3 text-[#191970] hover:bg-[#191970] hover:text-white transition-colors"
                                                        disabled={item.quantity >= item.maxStock}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.productId)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-8 border-2 border-[#191970] sticky top-24">
                            <h2 className="text-2xl font-extrabold uppercase mb-8 pb-4 border-b-2 border-[#191970] text-[#191970]">Order Summary</h2>

                            <div className="space-y-5 text-base mb-8 font-semibold text-[#191970]">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>
                                        {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (GST Estimated)</span>
                                    <span>{formatPrice(taxTotal)}</span>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="py-5 border-t-2 border-[#191970] mb-8">
                                <div className="flex items-center justify-between cursor-pointer group text-[#191970]">
                                    <span className="font-bold text-base uppercase flex items-center gap-2">
                                        <Tag className="h-5 w-5" /> Apply Promo Code
                                    </span>
                                    <Plus className="h-5 w-5 group-hover:rotate-45 transition-transform" />
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-4 pt-4 border-t-2 border-[#191970]">
                                <span className="text-xl font-extrabold uppercase text-[#191970]">Grand Total</span>
                                <span className="text-3xl font-extrabold text-[#191970]">{formatPrice(finalTotal)}</span>
                            </div>
                            <p className="text-xs text-[#191970]/60 mb-8 text-right font-medium">Prices include GST</p>

                            <Link
                                href="/checkout"
                                className="w-full bg-[#191970] hover:bg-[#131355] text-white font-bold uppercase text-lg py-5 rounded-sm flex items-center justify-center gap-3 transition-all hover:shadow-xl"
                            >
                                Checkout <ArrowRight className="h-5 w-5" />
                            </Link>

                            <div className="mt-8 flex flex-col gap-3">
                                <span className="text-xs text-[#191970]/50 font-bold uppercase tracking-widest">Accepted Payment Methods</span>
                                <div className="flex gap-3 opacity-100">
                                    <div className="h-8 w-12 bg-gray-100 border border-gray-200 rounded"></div>
                                    <div className="h-8 w-12 bg-gray-100 border border-gray-200 rounded"></div>
                                    <div className="h-8 w-12 bg-gray-100 border border-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
