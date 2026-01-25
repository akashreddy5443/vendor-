'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { WishlistToggle } from './WishlistToggle'
import { Eye } from 'lucide-react'
import { useState } from 'react'
import { QuickViewModal } from './QuickViewModal'
import { CompareToggle } from './CompareToggle'

interface ProductCardProps {
    product: {
        id: string
        title: string
        price: number
        slug?: string
        description?: string // Added for modal
        stock?: number // Added for stock check
        product_images?: { cloudinary_url: string; is_primary: boolean }[]
    }
}

export function ProductCard({ product }: ProductCardProps) {
    const [showQuickView, setShowQuickView] = useState(false)

    // Find primary image or default to first, or placeholder
    const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0]
    const imageUrl = primaryImage?.cloudinary_url

    const stock = product.stock ?? 0
    const isOutOfStock = stock === 0
    const isLowStock = stock > 0 && stock <= 5

    return (
        <>
            <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
                <Link href={`/products/${product.id}`} className="absolute inset-0 z-0" />

                <div className="aspect-square bg-muted relative overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                        <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
                            <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className={`object-cover ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-sm">No Image</span>
                    )}

                    {/* Stock Badges */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40">
                            <span className="bg-zinc-900/90 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider border border-white/20 rounded-full">
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

                    {/* Quick actions */}
                    <div className="absolute top-2 right-2 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/50 backdrop-blur-sm rounded-full p-1 hover:bg-black/70 transition-colors pointer-events-auto">
                            <WishlistToggle productId={product.id} />
                        </div>
                        <div className="bg-black/50 backdrop-blur-sm rounded-full p-1 hover:bg-black/70 transition-colors pointer-events-auto">
                            <CompareToggle productId={product.id} />
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setShowQuickView(true)
                            }}
                            className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors hover:text-orange-500"
                            title="Quick View"
                        >
                            <Eye className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-grow relative z-10 pointer-events-none">
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-2">
                        <span className={`font-medium ${isOutOfStock ? 'text-gray-500 line-through' : 'text-muted-foreground'}`}>
                            {formatPrice(product.price)}
                        </span>
                        {!isOutOfStock && (
                            <span className="text-xs font-bold text-primary uppercase tracking-wider opacity-0 transform translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                                View Details
                            </span>
                        )}
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
