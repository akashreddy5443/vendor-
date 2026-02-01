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
            <div className="group relative flex flex-col h-[420px] md:h-[500px] w-full bg-transparent">
                <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-20" />

                {/* Image Container - Floating Card Look */}
                <div className="relative w-full h-[320px] md:h-[380px] rounded-[2rem] overflow-hidden bg-slate-50 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-2">
                    {/* Badge Layer */}
                    <div className="absolute top-4 left-4 z-30 flex gap-2">
                        {isOutOfStock ? (
                            <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md">
                                Sold Out
                            </span>
                        ) : hasDiscount && (
                            <span className="bg-white/90 text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md shadow-sm">
                                -{effectiveDiscount}%
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button - Top Right */}
                    <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <WishlistToggle
                            productId={product.id}
                            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 shadow-sm transition-all"
                        />
                    </div>

                    {/* Product Images */}
                    {imageUrl ? (
                        <>
                            <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className={`object-cover transition-transform duration-1000 ease-out group-hover:scale-105 ${hoverImageUrl ? 'group-hover:opacity-0' : ''} ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {hoverImageUrl && (
                                <Image
                                    src={hoverImageUrl}
                                    alt={product.title}
                                    fill
                                    className={`object-cover absolute inset-0 transition-all duration-1000 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            )}
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center bg-slate-100 text-[10px] font-black uppercase text-slate-300 tracking-widest">
                            No Image
                        </div>
                    )}

                    {/* Hover Overlay Actions */}
                    {!isOutOfStock && (
                        <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] z-30">
                            <button
                                onClick={handleAddToCart}
                                className="w-full h-12 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-primary transition-colors active:scale-95"
                            >
                                <ShoppingCart className="w-4 h-4" /> Add to Cart
                            </button>
                        </div>
                    )}
                </div>

                {/* Details Section - Clean & Typography First */}
                <div className="mt-4 flex flex-col flex-1 px-2 relative">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                            {/* Trust Badge / Subtitle */}
                            {product.short_benefit ? (
                                <span className="block text-[9px] font-black uppercase tracking-widest text-primary mb-1">
                                    {product.short_benefit}
                                </span>
                            ) : (
                                <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                    Official Gear
                                </span>
                            )}

                            <h3 className="font-heading font-bold text-base md:text-lg leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                                {product.title}
                            </h3>
                        </div>

                        {/* Price Block */}
                        <div className="text-right">
                            {hasDiscount && (
                                <span className="block text-[10px] text-slate-400 line-through font-bold mb-0.5">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                            <div className={`font-black text-lg tracking-tight ${hasDiscount ? 'text-red-600' : 'text-slate-900'}`}>
                                {formatPrice(finalPrice)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <QuickViewModal
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
                product={{
                    ...product,
                    stock,
                    description: product.description || '',
                    image: imageUrl || ''
                }}
            />
        </>
    )
}
