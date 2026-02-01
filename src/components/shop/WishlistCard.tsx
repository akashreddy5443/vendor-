'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Trash2, Star, Check } from 'lucide-react'
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

    // Mock specs if none exist
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

            {/* Col 1: Image Section */}
            <div className="relative w-full sm:w-56 aspect-square sm:aspect-auto shrink-0 bg-white flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-50">
                {image ? (
                    <Image
                        src={image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 250px"
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

            {/* Col 2: Content Section (Details) */}
            <div className="flex-grow p-4 md:p-6 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-slate-50">
                <div className="mb-2">
                    <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                        {product.badge || 'Best Seller'}
                    </span>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors mb-2 font-heading">
                        {product.title}
                    </h3>

                    {/* Rating Mockup */}
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mb-4">
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

                {/* Specs / Features List - 2 Column Grid */}
                <div className="hidden sm:block">
                    <ul className="text-xs text-slate-500 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        {specs.map((spec: any, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-slate-300 rounded-full mt-1.5 shrink-0" />
                                <span>
                                    <span className="font-semibold text-slate-700">{spec.key}:</span> {spec.value}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Col 3: Action Section (Price & Buttons) */}
            <div className="w-full sm:w-64 shrink-0 bg-slate-50/50 p-4 md:p-6 flex flex-col justify-between gap-4">
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                            {formatPrice(finalPrice)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through font-bold">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> In Stock & Ready to Ship
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                        Free Delivery by Tomorrow, 2 PM
                    </span>
                </div>

                <div className="space-y-3 z-20">
                    <button
                        onClick={handleAddToCart}
                        className="w-full h-10 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-colors shadow-lg shadow-slate-200 hover:shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-3 h-3" />
                        Add to Cart
                    </button>

                    <button
                        onClick={handleRemove}
                        className="w-full h-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                    >
                        <Trash2 className="w-3 h-3" />
                        Remove Item
                    </button>
                </div>
            </div>
        </div>
    )
}
