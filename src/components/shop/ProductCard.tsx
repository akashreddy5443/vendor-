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
            <div className="group relative flex flex-col overflow-hidden rounded-xl border border-blue-900/30 bg-card text-card-foreground transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20">
                <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-0" />

                <div className="aspect-square bg-[#020617] relative overflow-hidden flex items-center justify-center">
                    {/* Midnight Blue Glow Effect */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                    {imageUrl ? (
                        <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105 z-10">
                            <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className={`object-cover ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-sm z-10">No Image</span>
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

                    {/* Quick actions - Visible on Mobile, Hover on Desktop */}
                    <div className="absolute top-2 right-2 z-30 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/40 backdrop-blur-md rounded-full p-1.5 hover:bg-black/80 transition-colors pointer-events-auto border border-white/10">
                            <WishlistToggle productId={product.id} className="text-white hover:text-red-500" />
                        </div>
                        <div className="bg-black/40 backdrop-blur-md rounded-full p-1.5 hover:bg-black/80 transition-colors pointer-events-auto border border-white/10">
                            <CompareToggle productId={product.id} className="text-white hover:text-blue-400" />
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setShowQuickView(true)
                            }}
                            className="bg-black/40 backdrop-blur-md rounded-full p-2 text-white hover:bg-black/80 transition-colors hover:text-orange-400 border border-white/10"
                            title="Quick View"
                        >
                            <Eye className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`bg-black/40 backdrop-blur-md rounded-full p-2 text-white hover:bg-black/80 transition-colors hover:text-green-400 border border-white/10 ${isOutOfStock ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
                            title="Add to Cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-grow relative z-10 pointer-events-none bg-gradient-to-b from-card to-zinc-950/50">
                    <h3 className="text-lg font-bold mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {product.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-2">
                        <span className={`font-medium text-lg ${isOutOfStock ? 'text-gray-500 line-through' : 'text-orange-500'}`}>
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
