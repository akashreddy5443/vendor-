'use client'

import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2, ArrowRight, Tag, ShieldCheck, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal, subtotal, taxTotal } = useCart()
    const [isPromoOpen, setIsPromoOpen] = useState(false)
    const [promoCode, setPromoCode] = useState('')
    const [promoStatus, setPromoStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [promoMessage, setPromoMessage] = useState('')

    const handleApplyPromo = () => {
        if (!promoCode.trim()) {
            setPromoStatus('error')
            setPromoMessage('Please enter a code.')
            return
        }
        // Mock validation for UI demonstration
        if (promoCode.toUpperCase() === 'WELCOME10') {
            setPromoStatus('success')
            setPromoMessage('Code applied! 10% Discount.')
        } else {
            setPromoStatus('error')
            setPromoMessage('Invalid code. Try "WELCOME10".')
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50 text-[#191970]">
                <div className="mb-8 h-32 w-32 bg-white shadow-xl rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-6xl">🛒</span>
                </div>
                <h2 className="text-3xl font-extrabold font-serif mb-4 tracking-tight">Your Cart is Empty</h2>
                <p className="text-[#191970]/60 mb-10 max-w-lg text-lg leading-relaxed">
                    Looks like you haven't made your choice yet. Explore our premium collection and find something extraordinary.
                </p>
                <Link
                    href="/products"
                    className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-all duration-300 bg-[#191970] rounded-sm hover:bg-[#131355] hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#191970]"
                >
                    Start Shopping <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        )
    }

    const shippingCost = cartTotal > 5000 ? 0 : 500
    const finalTotal = subtotal + taxTotal + shippingCost

    return (
        <div className="bg-[#f8f9fa] min-h-screen py-12 md:py-20 text-[#191970] font-sans">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b-2 border-[#191970]/10 pb-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#191970]">
                        Shopping Cart
                        <span className="ml-4 text-2xl text-[#191970]/50 font-medium align-middle">
                            {items.reduce((a, b) => a + b.quantity, 0)} Items
                        </span>
                    </h1>
                    <Link href="/products" className="hidden md:flex items-center text-sm font-bold text-[#191970] hover:underline uppercase tracking-wide mt-4 md:mt-0">
                        Continue Shopping <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Left Column: Items */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Free Shipping Banner */}
                        {cartTotal > 5000 && (
                            <div className="flex items-center gap-4 p-5 bg-white border-l-4 border-[#191970] shadow-sm mb-6">
                                <div className="p-2 bg-[#191970]/5 rounded-full">
                                    <ShieldCheck className="h-6 w-6 text-[#191970]" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg tracking-wide text-[#191970]">Free Shipping Unlocked</p>
                                    <p className="text-sm text-[#191970]/70">You are eligible for complimentary express delivery.</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white shadow-sm border border-[#191970]/5 rounded-sm overflow-hidden">
                            {items.map((item, index) => (
                                <div key={item.productId} className={`p-6 md:p-8 flex gap-6 md:gap-10 transition-colors hover:bg-gray-50 ${index !== items.length - 1 ? 'border-b border-[#191970]/10' : ''}`}>
                                    {/* Image */}
                                    <div className="relative h-32 w-32 md:h-48 md:w-48 flex-shrink-0 bg-white border border-gray-100 shadow-inner rounded-sm overflow-hidden group">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm text-gray-300">No Image</div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col justify-between py-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="font-bold text-xl md:text-2xl text-[#191970] leading-tight mb-2 tracking-tight">
                                                    <Link href={`/products/${item.productId}`} className="hover:underline">
                                                        {item.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-sm text-[#191970]/60 mb-2 font-medium tracking-wide">
                                                    STYLE: {item.productId.slice(0, 8).toUpperCase()}
                                                </p>
                                                <div className="flex items-center gap-3 text-sm font-semibold text-[#191970]">
                                                    <span className="bg-[#191970]/5 px-2 py-1 rounded text-xs uppercase tracking-wider">Size: Default</span>
                                                    <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${item.maxStock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-[#191970]'}`}>
                                                        {item.maxStock < 5 ? 'Low Stock' : 'In Stock'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-extrabold text-2xl md:text-3xl text-[#191970] tracking-tight">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-6 mt-8">
                                            {/* Quantity */}
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center border border-[#191970]/20 bg-white rounded-sm shadow-sm hover:border-[#191970] transition-colors">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="p-3 text-[#191970] hover:bg-[#191970] hover:text-white transition-colors"
                                                        disabled={item.quantity <= 1}
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-12 text-center font-bold text-lg select-none">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="p-3 text-[#191970] hover:bg-[#191970] hover:text-white transition-colors"
                                                        disabled={item.quantity >= item.maxStock}
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.productId)}
                                                    className="flex items-center gap-2 text-[#191970]/50 hover:text-red-600 transition-colors text-sm font-bold uppercase tracking-wider group"
                                                >
                                                    <Trash2 className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-12" />
                                                    Remove
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
                        <div className="bg-white p-8 border border-[#191970]/10 shadow-xl rounded-sm sticky top-24">
                            <h2 className="text-2xl font-extrabold uppercase mb-8 pb-4 border-b-2 border-[#191970] text-[#191970] tracking-tight">
                                Order Summary
                            </h2>

                            <div className="space-y-5 text-base mb-8 text-[#191970]">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-[#191970]/70">Subtotal</span>
                                    <span className="font-bold text-xl">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-[#191970]/70">Shipping</span>
                                    <span className={`font-bold text-xl ${shippingCost === 0 ? "text-green-700" : ""}`}>
                                        {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-[#191970]/70">Tax (Est. 18%)</span>
                                    <span className="font-bold text-xl">{formatPrice(taxTotal)}</span>
                                </div>
                            </div>

                            {/* Promo Code Section */}
                            <div className="py-5 border-t border-[#191970]/10 border-b mb-8">
                                <button
                                    onClick={() => setIsPromoOpen(!isPromoOpen)}
                                    className="w-full flex items-center justify-between cursor-pointer group text-[#191970] hover:text-[#191970]/80 transition-colors"
                                >
                                    <span className="font-bold text-sm uppercase flex items-center gap-2 tracking-wide">
                                        <Tag className="h-4 w-4" /> Have a Promo Code?
                                    </span>
                                    <Plus className={`h-4 w-4 transition-transform duration-300 ${isPromoOpen ? 'rotate-45' : 'group-hover:rotate-90'}`} />
                                </button>

                                {isPromoOpen && (
                                    <div className="mt-4 animate-in slide-in-from-top-2 fade-in duration-300">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter code"
                                                value={promoCode}
                                                onChange={(e) => {
                                                    setPromoCode(e.target.value)
                                                    setPromoStatus('idle')
                                                    setPromoMessage('')
                                                }}
                                                className="flex-1 border border-[#191970]/20 p-2 text-sm uppercase font-semibold focus:outline-none focus:border-[#191970]"
                                            />
                                            <button
                                                onClick={handleApplyPromo}
                                                className="bg-[#191970] text-white px-4 py-2 text-sm font-bold hover:bg-[#131355]"
                                            >
                                                APPLY
                                            </button>
                                        </div>
                                        {promoStatus === 'success' && (
                                            <p className="text-green-600 text-xs mt-2 flex items-center gap-1 font-bold">
                                                <CheckCircle className="h-3 w-3" /> {promoMessage}
                                            </p>
                                        )}
                                        {promoStatus === 'error' && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-bold">
                                                <AlertCircle className="h-3 w-3" /> {promoMessage}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-end mb-4 pt-4">
                                <span className="text-xl font-extrabold uppercase text-[#191970] tracking-tight">Total</span>
                                <div className="text-right">
                                    <span className="text-4xl font-extrabold text-[#191970] leading-none block">{formatPrice(finalTotal)}</span>
                                    <p className="text-xs text-[#191970]/50 mt-1 font-medium">Inclusive of all taxes</p>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-[#191970] text-white font-bold uppercase text-lg py-5 rounded-sm flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#131355] hover:shadow-2xl hover:-translate-y-1 group"
                            >
                                Proceed to Checkout <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#191970]/50 font-bold uppercase tracking-widest border-t border-[#191970]/10 pt-6">
                                <Lock className="h-3 w-3" /> Secure Checkout
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
