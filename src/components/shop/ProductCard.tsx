'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { WishlistToggle } from './WishlistToggle'
import { Eye, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { QuickViewModal } from './QuickViewModal'
import { CompareToggle } from './CompareToggle'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
    product: {
        id: string
        title: string
        price: number
        slug?: string
        description?: string
        stock?: number
        discount_percentage?: number | null // DB field
        gst_percentage?: number | null // DB field
        features?: any
        product_images?: { cloudinary_url: string; is_primary: boolean }[]
        short_benefit?: string
        badges?: string[]
    }
    globalDiscount?: number
    globalGst?: number
}

export function ProductCard({ product, globalDiscount = 0, globalGst = 18 }: ProductCardProps) {
    const [showQuickView, setShowQuickView] = useState(false)
    const { addItem } = useCart()

    // Find primary and hover images
    const images = product.product_images || []
    const primaryImage = images.find(img => img.is_primary) || images[0]
    const hoverImage = images.length > 1 ? (images.find(img => !img.is_primary) || images[1]) : null

    const imageUrl = primaryImage?.cloudinary_url
    const hoverImageUrl = hoverImage?.cloudinary_url

    const stock = product.stock ?? 0
    const isOutOfStock = stock === 0

    // Discount Logic
    const effectiveDiscount = product.discount_percentage !== null && product.discount_percentage !== undefined
        ? product.discount_percentage
        : globalDiscount

    const hasDiscount = effectiveDiscount > 0
    const finalPrice = hasDiscount ? product.price * (1 - effectiveDiscount / 100) : product.price

    // GST Logic
    const effectiveGst = product.gst_percentage !== null && product.gst_percentage !== undefined
        ? product.gst_percentage
        : (globalGst || 18)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isOutOfStock) {
            addItem({
                productId: product.id,
                title: product.title,
                price: finalPrice,
                maxStock: stock,
                image: imageUrl,
                gstPercentage: effectiveGst
            }, 1)
        }
    }

    return (
        <>
            <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-primary/20 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-2 h-[480px]">
                <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-20" />

                <div className="aspect-square relative overflow-hidden flex items-center justify-center bg-slate-50/50 group-hover:bg-white transition-colors duration-700">
                    {imageUrl ? (
                        <div className="relative h-full w-full flex items-center justify-center p-10 z-10">
                            <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className={`object-contain transition-all duration-1000 group-hover:scale-110 ${hoverImageUrl ? 'group-hover:opacity-0' : ''} ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {hoverImageUrl && (
                                <Image
                                    src={hoverImageUrl}
                                    alt={`${product.title} alternate`}
                                    fill
                                    className={`object-contain transition-all duration-1000 absolute inset-0 p-10 opacity-0 group-hover:opacity-100 group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="h-full w-full bg-slate-50 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 z-10">
                            No Preview
                        </div>
                    )}

                    {/* Stock & Promo Badges - High-End Style */}
                    {isOutOfStock ? (
                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-950/40 backdrop-blur-[2px]">
                            <span className="bg-white text-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl rounded-full">
                                Sold Out
                            </span>
                        </div>
                    ) : (
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                            {/* Discount Badge */}
                            {hasDiscount && (
                                <span className="bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-primary/30 flex items-center gap-1 uppercase tracking-widest">
                                    {effectiveDiscount}% OFF
                                </span>
                            )}

                            {/* Trust Badges */}
                            {product.badges && Array.isArray(product.badges) && product.badges.map((badge: string) => (
                                <span key={badge} className="bg-white/90 backdrop-blur text-slate-900 text-[8px] font-bold px-2 py-1 rounded-md border border-slate-200 shadow-sm uppercase tracking-wider">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Quick View & Add to Cart Hover Overlay */}
                    {!isOutOfStock && (
                        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-20 px-4">
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setShowQuickView(true)
                                }}
                                className="h-10 w-10 flex items-center justify-center bg-white text-slate-900 rounded-xl shadow-xl hover:bg-slate-50 transition-colors border border-slate-100"
                                title="Quick View"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="h-10 bg-primary text-white px-6 rounded-xl shadow-xl hover:bg-primary/90 transition-colors flex items-center gap-2 font-bold text-xs uppercase tracking-wider border border-transparent"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col relative z-30 pointer-events-none p-6 flex-grow">
                    {/* Authorized Hub / Trust Signal */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-[9px] uppercase tracking-[0.35em] text-primary font-black opacity-60">
                            Authorized Hub
                        </div>
                        {/* Delivery Signal */}
                        <div className="flex items-center gap-1 text-[9px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            3-Day Delivery
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <h3 className="text-lg font-black text-slate-900 leading-[1.1] group-hover:text-primary transition-colors line-clamp-1 mb-1 font-heading tracking-tight">
                            {product.title}
                        </h3>

                        {/* Short Benefit / Hook */}
                        {product.short_benefit && (
                            <p className="text-xs font-bold text-indigo-600 mb-2">
                                {product.short_benefit}
                            </p>
                        )}

                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-4 leading-relaxed font-medium h-8">
                            {product.description || "Premium quality tech gear designed for the modern professional workspace."}
                        </p>

                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex flex-col">
                                {hasDiscount && (
                                    <span className="text-[10px] text-slate-400 line-through font-bold tracking-tighter">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                                <span className={`font-black text-2xl tracking-tighter ${isOutOfStock ? 'text-slate-300' : 'text-slate-900'}`}>
                                    {formatPrice(finalPrice)}
                                </span>
                            </div>

                            <div className="h-11 w-11 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-2 group-hover:translate-y-0 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 shadow-xl shadow-primary/20">
                                <ShoppingCart className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wishlist Action */}
                <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-auto scale-90 group-hover:scale-100">
                    <WishlistToggle productId={product.id} className="bg-white/80 backdrop-blur-md hover:bg-white text-slate-400 hover:text-red-500 border border-white/50 rounded-2xl p-2.5 shadow-xl transition-all hover:scale-110 active:scale-90" />
                </div>
            </div>

            {/* Modals */}
            <QuickViewModal
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
                product={{
                    ...product,
                    stock,
                    description: product.description || '', // Ensure valid string
                    image: imageUrl || ''
                }}
            />
        </>
    )
}
