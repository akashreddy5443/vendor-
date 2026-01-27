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
        description?: string // Added for modal
        stock?: number // Added for stock check
        features?: any // JSONB
        product_images?: { cloudinary_url: string; is_primary: boolean }[]
    }
}

export function ProductCard({ product }: ProductCardProps) {
    const [showQuickView, setShowQuickView] = useState(false)
    const { addItem } = useCart()

    // Find primary image or default to first, or placeholder
    const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0]
    const imageUrl = primaryImage?.cloudinary_url

    const stock = product.stock ?? 0
    const isOutOfStock = stock === 0
    const isLowStock = stock > 0 && stock <= 5

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isOutOfStock) {
            addItem({
                productId: product.id,
                title: product.title,
                price: product.price,
                maxStock: stock,
                image: imageUrl
            }, 1)
        }
    }

    return (
        <>
            <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300">
                <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-20" />

                <div className="aspect-square relative overflow-hidden flex items-center justify-center">

                    {imageUrl ? (
                        <div className="relative h-full w-full bg-white flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-500 z-10">
                            <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className={`object-contain mix-blend-multiply ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    ) : (
                        <div className="h-full w-full bg-secondary/20 flex items-center justify-center text-muted-foreground text-sm z-10">
                            No Image
                        </div>
                    )}

                    {/* Stock Badges */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-sm">
                            <span className="bg-red-600/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider border border-white/20 rounded shadow-lg transform -rotate-12">
                                Out of Stock
                            </span>
                        </div>
                    )}
                    {isLowStock && (
                        <div className="absolute top-2 left-2 z-10">
                            <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded shadow-sm animate-pulse">
                                Only {stock} Left
                            </span>
                        </div>
                    )}


                </div>

                <div className="p-4 flex flex-col flex-grow relative z-30 pointer-events-none">
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-2">
                        <span className={`font-medium text-lg ${isOutOfStock ? 'text-gray-500 line-through' : 'text-primary'}`}>
                            {formatPrice(product.price)}
                        </span>

                        <div className="flex items-center gap-2 pointer-events-auto z-20">
                            {/* Wishlist Button - Minimal Style */}
                            <div className="text-gray-400 hover:text-red-500 transition-colors p-1 active:scale-95 flex items-center justify-center">
                                <WishlistToggle productId={product.id} className="w-5 h-5 currentColor" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <QuickViewModal
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
                product={{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    description: product.description || '',
                    image: imageUrl || '',
                    stock: stock
                }}
            />
        </>
    )
}
