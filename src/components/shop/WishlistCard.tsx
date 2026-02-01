'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Trash2, Star, Check, Zap } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface WishlistCardProps {
    item: {
        id: string
        product_id: string
        product: {
            id: string
            title: string
            price: number
            slug?: string
            description?: string
            stock?: number
            discount_percentage?: number | null
            product_images?: { cloudinary_url: string; is_primary: boolean }[]
            features?: any[]
            badge?: string
        }
    }
}

export function WishlistCard({ item }: WishlistCardProps) {
    const { product } = item
    const { addItem } = useCart()
    const router = useRouter()
    const [isRemoving, setIsRemoving] = useState(false)
    const supabase = createClient()

    const images = product.product_images || []
    const image = images.find(img => img.is_primary)?.cloudinary_url || images[0]?.cloudinary_url

    // Discount Logic
    const discount = product.discount_percentage || 0
    const hasDiscount = discount > 0
    const finalPrice = hasDiscount ? product.price * (1 - discount / 100) : product.price

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        addItem({
            productId: product.id,
            title: product.title,
            price: finalPrice,
            maxStock: product.stock || 0,
            image: image,
            gstPercentage: 18 // Default
        }, 1)
    }

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (isRemoving) return
        setIsRemoving(true)

        try {
            const { error } = await supabase
                .from('wishlist')
                .delete()
                .eq('id', item.id)

            if (!error) {
                router.refresh()
            }
        } catch (error) {
            console.error('Error removing item:', error)
            setIsRemoving(false)
        }
    }

    // Mock specs if none exist to show the layout intent
    const specs = product.features && product.features.length > 0
        ? product.features.slice(0, 4)
        : [
            { key: 'Quality', value: 'Premium Grade' },
            { key: 'Warranty', value: '1 Year Official' },
            { key: 'Shipping', value: 'Express' },
            { key: 'Stock', value: product.stock ? 'Available' : 'Out of Stock' }
        ]

    return (
        <div className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-all duration-300">
            <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-10" />

            {/* Image Section - Left Side */}
            <div className="relative w-full sm:w-48 aspect-square sm:aspect-auto shrink-0 bg-slate-50 flex items-center justify-center p-4">
                {image ? (
                    <Image
                        src={image}
                        alt={product.title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 200px"
                    />
                ) : (
                    <div className="text-[10px] text-slate-300 font-black uppercase tracking-widest">No Image</div>
                )}
                {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-black px-2 py-1 rounded-md shadow-sm z-20">
                        {discount}% OFF
                    </div>
                )}
            </div>

            {/* Content Section - Right Side */}
            <div className="flex-grow p-4 md:p-6 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                {product.badge || 'Best Seller'}
                            </span>
                            {product.stock && product.stock < 5 && (
                                <span className="text-[9px] font-bold text-red-500 animate-pulse">
                                    Low Stock
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors mb-1 font-heading">
                            {product.title}
                        </h3>
                        {/* Rating Mockup */}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mb-3">
                            <div className="flex text-yellow-400">
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current text-slate-200" />
                            </div>
                            <span>(128 Reviews)</span>
                        </div>
                    </div>

                    {/* Delete Button (Desktop) */}
                    <button
                        onClick={handleRemove}
                        className="hidden sm:flex text-slate-300 hover:text-red-500 transition-colors z-20 p-2"
                        title="Remove from Wishlist"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Specs / Features List - The "Amazon" look */}
                <div className="mb-4 hidden sm:block">
                    <ul className="text-xs text-slate-500 space-y-1">
                        {specs.map((spec: any, idx: number) => (
                            <li key={idx} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <span className="font-semibold text-slate-700">{spec.key}:</span> {spec.value}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto flex items-end justify-between gap-4">
                    <div className="flex flex-col">
                        {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through font-bold">
                                {formatPrice(product.price)}
                            </span>
                        )}
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-slate-900 tracking-tight">
                                {formatPrice(finalPrice)}
                            </span>
                            <span className="text-[10px] font-bold text-green-600 hidden md:inline-block">
                                Free Delivery
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto z-20">
                        {/* Mobile Delete Button */}
                        <button
                            onClick={handleRemove}
                            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-100 transition-colors"
                        >
                            {isRemoving ? <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-red-500 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={handleAddToCart}
                            className="flex-1 sm:flex-none h-10 px-6 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-colors shadow-lg shadow-slate-200 hover:shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-3 h-3" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
