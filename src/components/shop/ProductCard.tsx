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
    }
    globalDiscount?: number
    globalGst?: number
}

export function ProductCard({ product, globalDiscount = 0, globalGst = 18 }: ProductCardProps) {
    const [showQuickView, setShowQuickView] = useState(false)
    const { addItem } = useCart()

    // Find primary image
    const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0]
    const imageUrl = primaryImage?.cloudinary_url

    const stock = product.stock ?? 0
    const isOutOfStock = stock === 0

    // Discount Logic
    // Product override takes precedence. If null, use global.
    const effectiveDiscount = product.discount_percentage !== null && product.discount_percentage !== undefined
        ? product.discount_percentage
        : globalDiscount

    const hasDiscount = effectiveDiscount > 0
    const finalPrice = hasDiscount ? product.price * (1 - effectiveDiscount / 100) : product.price

    // GST Logic (Product priority > Global default)
    // We assume global GST is passed prop, or fallback 18
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
                price: finalPrice, // Use discounted price
                maxStock: stock,
                image: imageUrl,
                gstPercentage: effectiveGst
            }, 1)
        }
    }

    return (
        <>
            <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-20" />

                <div className="aspect-[3/4] relative overflow-hidden flex items-center justify-center bg-gray-100/50 group-hover:bg-gray-100 transition-colors">

                    {imageUrl ? (
                        <div className="relative h-full w-full flex items-center justify-center p-8 z-10">
                            <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className={`object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    ) : (
                        <div className="h-full w-full bg-gray-50 flex items-center justify-center text-muted-foreground text-sm z-10">
                            No Image
                        </div>
                    )}

                    {/* Stock & Promo Badges - Curved */}
                    {isOutOfStock ? (
                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-sm">
                            <span className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm rounded-full transform -rotate-2">
                                Out of Stock
                            </span>
                        </div>
                    ) : (
                        hasDiscount && (
                            <div className="absolute top-3 left-3 z-20">
                                <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                    <span className="text-[8px]">SAVE</span> {effectiveDiscount}%
                                </span>
                            </div>
                        )
                    )}

                </div>

                <div className="flex flex-col relative z-30 pointer-events-none p-5 flex-grow">
                    {/* Placeholder for Color variants count */}
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">
                        TechDev Gear
                    </div>

                    <div className="flex flex-col justify-between h-full gap-2">
                        <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                            {product.title}
                        </h3>

                        <div className="pt-2 border-t border-gray-50 mt-auto flex items-end justify-between">
                            <div className="flex flex-col">
                                {hasDiscount && (
                                    <span className="text-[11px] text-gray-400 line-through font-medium">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                                <span className={`font-bold text-lg ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {formatPrice(finalPrice)}
                                </span>
                            </div>
                            {/* Visual indicator for 'Add' (Decorative, functionality is via Link or QuickView implies detail) */}
                            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                <ShoppingCart className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hidden interactive elements */}
                <div className="absolute top-3 right-3 z-30 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto scale-100">
                    <WishlistToggle productId={product.id} className="bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-200 rounded-full p-2 shadow-sm transition-all hover:scale-110 active:scale-95" />
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
