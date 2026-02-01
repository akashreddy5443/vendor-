'use client'

import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2, ArrowRight, Tag, ShieldCheck, Lock, CheckCircle, AlertCircle, Heart, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { CartRecommendations } from '@/components/shop/CartRecommendations'
import { AvailableCoupons } from '@/components/shop/AvailableCoupons'

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal, subtotal, taxTotal, addToCart } = useCart()
    const [isPromoOpen, setIsPromoOpen] = useState(false)
    const [promoCode, setPromoCode] = useState('')
    const [promoStatus, setPromoStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [promoMessage, setPromoMessage] = useState('')
    const [discountAmount, setDiscountAmount] = useState(0)

    // Local State for Save for Later (Ideally this should be in Context or DB)
    const [savedItems, setSavedItems] = useState<any[]>([])

    const moveToSaved = (item: any) => {
        setSavedItems([...savedItems, item])
        removeItem(item.productId)
    }

    const moveToCart = (item: any) => {
        addToCart(item)
        setSavedItems(savedItems.filter(i => i.productId !== item.productId))
    }

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            setPromoStatus('error')
            setPromoMessage('Please enter a code.')
            return
        }
        try {
            const { validateCoupon } = await import('./actions')
            const result = await validateCoupon(promoCode, subtotal)

            if (result.success) {
                setPromoStatus('success')
                let discount = result.discountType === 'percent'
                    ? (subtotal * (result.discountValue || 0)) / 100
                    : result.discountValue || 0

                setDiscountAmount(Math.min(discount, subtotal + taxTotal))
                setPromoMessage(`${result.code} Applied! Saved ${formatPrice(discount)}`)
            } else {
                setPromoStatus('error')
                setPromoMessage(result.message || 'Invalid code')
                setDiscountAmount(0)
            }
        } catch (e) {
            console.error(e)
            setPromoStatus('error')
            setPromoMessage('Error applying coupon')
            setDiscountAmount(0)
        }
    }

    const shippingCost = cartTotal > 5000 ? 0 : 500
    const finalTotal = Math.max(0, subtotal + taxTotal + shippingCost - discountAmount)

    if (items.length === 0 && savedItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50 text-foreground">
                <div className="mb-8 h-32 w-32 bg-white shadow-xl rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-6xl">🛒</span>
                </div>
                <h2 className="text-3xl font-heading font-bold mb-4 tracking-tight">Your Cart is Empty</h2>
                <p className="text-muted-foreground mb-10 max-w-lg text-lg leading-relaxed">
                    Looks like you haven't made your choice yet. Explore our premium collection and find something extraordinary.
                </p>
                <Link href="/products" className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-gray-50/50 min-h-screen py-12 md:py-20 text-foreground font-sans">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10 border-b border-slate-200 pb-6">
                    <h1 className="flex items-center gap-4 text-3xl md:text-5xl font-heading font-black uppercase tracking-tight text-slate-900">
                        Your Selection
                        {items.length > 0 && (
                            <span className="flex h-8 min-w-[2rem] px-2 items-center justify-center rounded-full bg-slate-100 text-lg md:text-xl font-bold text-slate-500">
                                {items.reduce((a, b) => a + b.quantity, 0)}
                            </span>
                        )}
                    </h1>
                    <Link href="/products" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                        Continue Shopping <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Free Shipping Banner */}
                        {cartTotal > 5000 && (
                            <div className="flex items-center gap-4 p-5 bg-white border border-green-100 rounded-xl shadow-sm">
                                <div className="p-2 bg-green-50 rounded-full">
                                    <ShieldCheck className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg tracking-wide text-green-700">Free Express Shipping Unlocked</p>
                                    <p className="text-sm text-green-600/80">You are eligible for complimentary express delivery.</p>
                                </div>
                            </div>
                        )}

                        {items.length > 0 && (
                            <div className="bg-white shadow-sm border border-border rounded-2xl overflow-hidden">
                                {items.map((item, index) => (
                                    <div key={item.productId} className={`p-6 md:p-8 flex gap-6 md:gap-10 transition-colors hover:bg-gray-50/50 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                        {/* Image */}
                                        <div className="relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0 bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden group">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.title} fill className="object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-sm text-gray-300">No Image</div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        {/* Content */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="mb-3">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-heading font-bold text-base md:text-xl text-slate-900 leading-snug mb-1">
                                                        <Link href={`/products/${item.productId}`} className="hover:text-primary transition-colors line-clamp-2">
                                                            {item.title}
                                                        </Link>
                                                    </h3>
                                                </div>

                                                <p className="font-heading font-black text-lg md:text-2xl text-primary mb-2">{formatPrice(item.price)}</p>

                                                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                    <span className="bg-slate-100 px-2 py-1 rounded">Default</span>
                                                    <span className={`${item.maxStock < 5 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'} px-2 py-1 rounded`}>
                                                        {item.maxStock < 5 ? 'Low Stock' : 'In Stock'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-2 mt-2">
                                                {/* Quantity */}
                                                <div className="flex items-center border border-slate-200 bg-white rounded-lg h-8 md:h-10 shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="w-8 md:w-10 h-full flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 rounded-l-lg transition-colors disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3 md:h-4 md:w-4" />
                                                    </button>
                                                    <span className="w-8 md:w-10 text-center text-xs md:text-sm font-black text-slate-900 select-none">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="w-8 md:w-10 h-full flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 rounded-r-lg transition-colors disabled:opacity-50"
                                                        disabled={item.quantity >= item.maxStock}
                                                    >
                                                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                                                    </button>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 md:gap-3">
                                                    <button
                                                        onClick={() => moveToSaved(item)}
                                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all"
                                                        title="Save for Later"
                                                    >
                                                        <Heart className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeItem(item.productId)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                        title="Remove"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Saved For Later Section */}
                        {savedItems.length > 0 && (
                            <div className="mt-12 animate-in fade-in slide-in-from-bottom-5">
                                <h2 className="text-xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-primary" /> Saved for Later ({savedItems.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {savedItems.map(item => (
                                        <div key={item.productId} className="bg-white p-4 rounded-xl border border-border shadow-sm flex gap-4 transition-all hover:shadow-md">
                                            <div className="relative h-24 w-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.image && <Image src={item.image} alt={item.title} fill className="object-contain p-2" />}
                                            </div>
                                            <div className="flex flex-col justify-between flex-1">
                                                <div>
                                                    <Link href={`/products/${item.productId}`} className="font-bold text-sm text-foreground line-clamp-1 hover:text-primary">
                                                        {item.title}
                                                    </Link>
                                                    <p className="text-lg font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                                                </div>
                                                <div className="flex gap-3 mt-3">
                                                    <button
                                                        onClick={() => moveToCart(item)}
                                                        className="flex-1 bg-primary/5 text-primary text-xs font-bold py-2 rounded hover:bg-primary/10 transition-colors flex items-center justify-center gap-1"
                                                    >
                                                        <ShoppingBag className="h-3 w-3" /> Move to Cart
                                                    </button>
                                                    <button
                                                        onClick={() => setSavedItems(savedItems.filter(i => i.productId !== item.productId))}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Summaries */}
                    {items.length > 0 && (
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white p-8 border border-border shadow-xl rounded-2xl sticky top-24">
                                <h2 className="text-xl font-heading font-extrabold uppercase mb-6 pb-4 border-b border-border text-foreground tracking-tight">Order Summary</h2>

                                <div className="space-y-4 text-sm mb-8 text-muted-foreground">
                                    <div className="flex justify-between items-center"><span className="font-medium">Subtotal</span><span className="font-bold text-lg text-foreground">{formatPrice(subtotal)}</span></div>
                                    <div className="flex justify-between items-center"><span className="font-medium">Shipping</span><span className={`font-bold text-lg ${shippingCost === 0 ? "text-green-600" : "text-foreground"}`}>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span></div>
                                    <div className="flex justify-between items-center"><span className="font-medium">Tax (Est. 18%)</span><span className="font-bold text-lg text-foreground">{formatPrice(taxTotal)}</span></div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between items-center text-green-600 animate-in fade-in slide-in-from-right-4">
                                            <span className="font-bold">Discount</span>
                                            <span className="font-bold text-lg">-{formatPrice(discountAmount)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="py-5 border-t border-border border-b mb-8">
                                    <button onClick={() => setIsPromoOpen(!isPromoOpen)} className="w-full flex items-center justify-between cursor-pointer group text-primary hover:text-primary/80 transition-colors">
                                        <span className="font-bold text-xs uppercase flex items-center gap-2 tracking-wide"><Tag className="h-4 w-4" /> Have a Promo Code?</span>
                                        <Plus className={`h-4 w-4 transition-transform duration-300 ${isPromoOpen ? 'rotate-45' : 'group-hover:rotate-90'}`} />
                                    </button>
                                    {isPromoOpen && (
                                        <div className="mt-4 animate-in slide-in-from-top-2 fade-in duration-300">
                                            <div className="flex gap-2">
                                                <input type="text" placeholder="Enter code" value={promoCode} onChange={(e) => { setPromoCode(e.target.value); setPromoStatus('idle'); setPromoMessage('') }} className="flex-1 border border-border rounded-lg p-3 text-sm uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                                <button onClick={handleApplyPromo} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90">APPLY</button>
                                            </div>
                                            {promoStatus === 'success' && <p className="text-green-600 text-xs mt-2 flex items-center gap-1 font-bold"><CheckCircle className="h-3 w-3" /> {promoMessage}</p>}
                                            {promoStatus === 'error' && <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-bold"><AlertCircle className="h-3 w-3" /> {promoMessage}</p>}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-lg font-heading font-bold uppercase text-foreground">Total</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-heading font-extrabold text-primary leading-none block">{formatPrice(finalTotal)}</span>
                                        <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">Inclusive of all taxes</p>
                                    </div>
                                </div>

                                <Link href="/checkout" className="w-full bg-primary text-primary-foreground font-bold uppercase text-sm py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 group shadow-blue-500/20 shadow-lg">
                                    Proceed to Checkout <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                    <Lock className="h-3 w-3" /> Secure Checkout
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="lg:col-span-8">
                    <CartRecommendations />
                </div>
                <div className="lg:col-span-4">
                    <AvailableCoupons />
                </div>
            </div>
        </div>
    )
}
