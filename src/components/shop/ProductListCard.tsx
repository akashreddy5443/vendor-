'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, Heart, ShieldCheck } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'

export function ProductListCard({ product }: { product: any }) {
    const router = useRouter()
    const { addItem } = useCart()

    // Calculate final price if compare_at_price is set, or just use price.
    // In this project schema: price is the selling price, compare_at_price is the MSRP.
    // So 'price' is the correct final price.

    const discount = product.compare_at_price > product.price
        ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
        : 0

    const cartItemPayload = {
        productId: product.id,
        title: product.title,
        price: product.price,
        maxStock: product.stock ?? 10,
        image: product.product_images?.[0]?.cloudinary_url || '/placeholder.png',
        gstPercentage: product.gst_percentage || 18
    }

    // Mock features if not present in DB
    const features = product.features || [
        'High Performance Processor',
        'Long-lasting Battery Life',
        'Premium Build Quality',
        '1 Year Manufacturer Warranty'
    ]

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] hover:shadow-[0_40px_80px_-20px_rgba(45,92,247,0.12)] transition-all duration-700 p-8 flex flex-col md:flex-row gap-10 group relative overflow-hidden">
            {/* Image Section */}
            <div className="relative w-full md:w-64 h-64 flex-shrink-0 flex items-center justify-center rounded-[2.5rem] bg-white border border-slate-50 shadow-sm overflow-hidden p-6 group-hover:border-primary/20 transition-all duration-700">
                <div className="relative w-full h-full">
                    <Image
                        src={product.product_images?.[0]?.cloudinary_url || '/placeholder.png'}
                        alt={product.title}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                </div>
                {/* Wishlist Icon */}
                <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur shadow-sm rounded-full text-slate-300 hover:text-red-500 transition-all hover:scale-110 active:scale-95 group/heart">
                    <Heart className="w-5 h-5 group-hover/heart:fill-current" />
                </button>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col md:flex-row gap-10">
                {/* Details */}
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <Link href={`/products/${product.slug}`} className="block group/title">
                            <h3 className="text-2xl font-heading font-black text-slate-900 group-hover/title:text-primary transition-colors tracking-tighter leading-none">
                                {product.title}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full border border-green-100 uppercase tracking-widest">
                                <Star className="w-3 h-3 fill-current" /> Certified 4.8
                            </span>
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">Global Stock Index</span>
                        </div>
                    </div>

                    {/* Features List */}
                    <ul className="grid grid-cols-1 gap-3">
                        {features.slice(0, 3).map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-500" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price Section */}
                <div className="w-full md:w-72 flex-shrink-0 md:border-l md:border-slate-100 md:pl-10 flex flex-col justify-start">
                    <div className="flex flex-col mb-8">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-3xl font-heading font-black text-slate-900 tracking-tighter">{formatPrice(product.price)}</span>
                            {product.status === 'active' && (
                                <div className="flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-[9px] uppercase font-black text-primary tracking-widest">Authorized Hub</span>
                                </div>
                            )}
                        </div>
                        {discount > 0 && (
                            <div className="flex items-center gap-3 text-sm font-bold">
                                <span className="text-slate-400 line-through decoration-slate-300 font-medium">{formatPrice(product.compare_at_price)}</span>
                                <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-md">-{discount}% Early Access</span>
                            </div>
                        )}
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-600">
                            Express Logistics Included
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto grid grid-cols-1 gap-4">
                        <button
                            onClick={() => addItem(cartItemPayload, 1)}
                            className="w-full bg-slate-900 text-white font-heading font-black py-4 rounded-2xl hover:bg-slate-800 transition-all duration-300 text-xs uppercase tracking-[0.2em] active:scale-95 shadow-xl shadow-slate-900/10"
                        >
                            Log to Unit
                        </button>
                        <button
                            onClick={() => {
                                addItem(cartItemPayload, 1)
                                router.push('/checkout')
                            }}
                            className="w-full bg-primary text-white font-heading font-black py-4 rounded-2xl hover:bg-indigo-600 transition-all duration-1000 ease-out text-xs uppercase tracking-[0.2em] active:scale-95 shadow-xl shadow-primary/20 border border-primary/20"
                        >
                            Sync & Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
