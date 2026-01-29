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
            <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100/50 hover:shadow-lg transition-all duration-300">
                <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-20" />

                <div className="aspect-[3/4] relative overflow-hidden flex items-center justify-center bg-gray-50/50">

                    {imageUrl ? (
                        <div className="relative h-full w-full flex items-center justify-center p-6 z-10">
                            <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className={`object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
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
                                <span className="bg-[#BA2B2B] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                    -{effectiveDiscount}%
                                </span>
                            </div>
                        )
                    )}

                </div>

                <div className="flex flex-col relative z-30 pointer-events-none p-4">
                    {/* Placeholder for Color variants count */}
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1">
                        1 Color
                    </div>

                    <div className="flex justify-between items-start gap-3">
                        <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 flex-grow">
                            {product.title}
                        </h3>
                        <div className="flex flex-col items-end">
                            <span className={`font-bold text-sm ${isOutOfStock ? 'text-gray-400' : 'text-[#BA2B2B]'}`}>
                                {formatPrice(finalPrice)}
                            </span>
                            {hasDiscount && (
                                <span className="text-[11px] text-gray-500 line-through decoration-gray-400">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hidden interactive elements */}
                <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto scale-90 md:scale-100">
                    <WishlistToggle productId={product.id} className="bg-white hover:bg-gray-50 text-black border border-gray-100 rounded-full p-2.5 shadow-md transition-transform active:scale-95" />
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
