import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2, ArrowRight, Tag, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal, subtotal, taxTotal, clearCart } = useCart()

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-background text-foreground">
                <div className="mb-6 h-24 w-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🛒</span>
                </div>
                <h2 className="text-2xl font-bold font-serif mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added anything yet. Explore our premium gear.</p>
                <Link
                    href="/products"
                    className="rounded-full bg-black dark:bg-white text-white dark:text-black px-8 py-3 font-bold transition-transform hover:scale-105"
                >
                    Start Shopping
                </Link>
            </div>
        )
    }

    const shippingCost = cartTotal > 5000 ? 0 : 500
    const finalTotal = subtotal + taxTotal + shippingCost

    return (
        <div className="bg-[#F9FAFB] dark:bg-background min-h-screen py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <h1 className="text-2xl font-bold uppercase tracking-tight mb-8">
                    My Shopping Cart ({items.reduce((a, b) => a + b.quantity, 0)})
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Items */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Free Shipping Banner */}
                        {cartTotal > 5000 && (
                            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-3 rounded-md flex items-center gap-2 text-sm font-medium">
                                <ShieldCheck className="h-4 w-4" />
                                YOU'VE EARNED FREE SHIPPING
                            </div>
                        )}

                        <div className="bg-white dark:bg-card border border-border rounded-lg overflow-hidden divide-y divide-border">
                            {items.map((item) => (
                                <div key={item.productId} className="p-4 md:p-6 flex gap-4 md:gap-6">
                                    {/* Image */}
                                    <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No Image</div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg md:text-xl text-black dark:text-white leading-tight mb-1">{item.title}</h3>
                                                <div className="text-sm text-gray-500 mb-2">
                                                    Style Number: {item.productId.slice(0, 8).toUpperCase()}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-medium">Size: Default</span>
                                                    <span className="text-gray-300">|</span>
                                                    <span className={`font-medium ${item.maxStock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                                                        {item.maxStock < 5 ? 'Low Stock' : 'In Stock'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-lg">{formatPrice(item.price)}</p>
                                                {/* If we had original price stored, we show it here. Assuming item.price is currently final (discounted) price. */}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                                            {/* Quantity */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                                                        disabled={item.quantity >= item.maxStock}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.productId)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {/* Item Total */}
                                            <div className="font-bold text-black dark:text-white">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white dark:bg-card border border-border rounded-lg p-6 sticky top-24 shadow-sm">
                            <h2 className="text-lg font-bold uppercase mb-6 pb-4 border-b border-border">Order Summary</h2>

                            <div className="space-y-4 text-sm mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-black dark:text-white">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>Shipping</span>
                                    <span className={shippingCost === 0 ? "text-green-600 font-medium" : "font-medium"}>
                                        {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>Tax (GST Estimated 18%)</span>
                                    <span className="font-medium text-black dark:text-white">{formatPrice(taxTotal)}</span>
                                </div>
                            </div>

                            {/* Promo Code Accordion Placeholder */}
                            <div className="py-4 border-t border-b border-border mb-6">
                                <div className="flex items-center justify-between cursor-pointer group">
                                    <span className="font-bold text-sm uppercase flex items-center gap-2">
                                        <Tag className="h-4 w-4" /> Apply Promo Code
                                    </span>
                                    <Plus className="h-4 w-4 group-hover:rotate-45 transition-transform" />
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-2">
                                <span className="text-lg font-bold uppercase">Grand Total</span>
                                <span className="text-2xl font-bold text-black dark:text-white">{formatPrice(finalTotal)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-6 text-right">Prices include GST</p>

                            <Link
                                href="/checkout"
                                className="w-full bg-[#BA2B2B] hover:bg-[#a62626] text-white font-bold uppercase py-4 rounded-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                            >
                                Checkout
                            </Link>

                            <div className="mt-6 flex flex-col gap-2">
                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Accepted Payment Methods</span>
                                <div className="flex gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
                                    <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                    <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                    <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                    <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
