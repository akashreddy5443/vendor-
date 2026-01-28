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
        features?: any
        product_images?: { cloudinary_url: string; is_primary: boolean }[]
    }
    globalDiscount?: number
}

export function ProductCard({ product, globalDiscount = 0 }: ProductCardProps) {
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

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isOutOfStock) {
            addItem({
                productId: product.id,
                title: product.title,
                price: finalPrice, // Use discounted price
                maxStock: stock,
                image: imageUrl
            }, 1)
        }
    }

    return (
        <>
            <div className="group relative flex flex-col bg-transparent hover:bg-transparent transition-none">
                <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-20" />

                <div className="aspect-[1.15/1] relative overflow-hidden flex items-center justify-center bg-[#F7F7F7] mb-3">

                    {imageUrl ? (
                        <div className="relative h-full w-full flex items-center justify-center p-8 z-10">
                            <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className={`object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    ) : (
                        <div className="h-full w-full bg-[#F7F7F7] flex items-center justify-center text-muted-foreground text-sm z-10">
                            No Image
                        </div>
                    )}

                    {/* Stock & Promo Badges */}
                    {isOutOfStock ? (
                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-sm">
                            <span className="bg-white text-black px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm transform -rotate-2">
                                Out of Stock
                            </span>
                        </div>
                    ) : (
                        hasDiscount && (
                            <div className="absolute bottom-2 left-2 z-20">
                                <span className="bg-[#BA2B2B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                    -{effectiveDiscount}%
                                </span>
                            </div>
                        )
                    )}

                </div>

                <div className="flex flex-col relative z-30 pointer-events-none px-1">
                    {/* Placeholder for Color variants count */}
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1">
                        1 Color
                    </div>

                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-base font-bold text-black leading-tight group-hover:underline decoration-2 decoration-black underline-offset-4 line-clamp-2 flex-grow">
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

                {/* Hidden interactive elements that could overlay or appear on hover if requested later */}
                <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                    <WishlistToggle productId={product.id} className="bg-white/90 hover:bg-white text-black rounded-full p-2 shadow-sm" />
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
