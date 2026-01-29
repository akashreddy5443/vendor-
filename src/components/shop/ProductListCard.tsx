'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, Heart, ShieldCheck } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'

export function ProductListCard({ product }: { product: any }) {
    const router = useRouter()
    const { addItem } = useCart()
    const discount = product.compare_at_price > product.price
        ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
        : 0

    // Mock features if not present in DB
    const features = product.features || [
        'High Performance Processor',
        'Long-lasting Battery Life',
        'Premium Build Quality',
        '1 Year Manufacturer Warranty'
    ]

    return (
        <div className="bg-white border border-gray-100 rounded-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col md:flex-row gap-6 group relative">
            {/* Image Section */}
            <div className="relative w-full md:w-56 h-56 flex-shrink-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                    <Image
                        src={product.product_images?.[0]?.cloudinary_url || '/placeholder.png'}
                        alt={product.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                {/* Wishlist Icon */}
                <button className="absolute top-0 right-0 p-1 text-gray-300 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5 fill-current" />
                </button>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col md:flex-row gap-6">
                {/* Details */}
                <div className="flex-1 space-y-3">
                    <Link href={`/products/${product.slug}`} className="block">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {product.title}
                        </h3>
                    </Link>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-2">
                        <span className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                            4.5 <Star className="w-3 h-3 fill-current" />
                        </span>
                        <span className="text-gray-500 text-sm font-medium">2,854 Ratings & 450 Reviews</span>
                    </div>

                    {/* Features List (Bullet Points) */}
                    <ul className="text-sm text-gray-600 space-y-1 mt-2">
                        {features.slice(0, 4).map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 before:content-['•'] before:text-gray-400 before:mr-1">
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price Section */}
                <div className="w-full md:w-64 flex-shrink-0 md:border-l md:border-gray-100 md:pl-6 flex flex-col justify-start">
                    <div className="flex flex-col mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                            {product.status === 'active' && (
                                <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Assured</span>
                                </div>
                            )}
                        </div>
                        {discount > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500 line-through decoration-gray-400">{formatPrice(product.compare_at_price)}</span>
                                <span className="text-green-600 font-bold">{discount}% off</span>
                            </div>
                        )}
                        <span className="text-xs text-green-600 font-medium mt-1">Free delivery</span>
                        {discount > 50 && (
                            <span className="text-xs text-red-500 font-bold mt-1">Hot Deal</span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto space-y-2">
                        <button
                            onClick={() => addItem(product, 1)}
                            className="w-full bg-[#ff9f00] hover:bg-[#f39400] text-white font-medium py-3 rounded-sm shadow-sm transition-colors text-sm uppercase tracking-wide"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => {
                                addItem(product, 1)
                                router.push('/checkout')
                            }}
                            className="w-full bg-[#fb641b] hover:bg-[#f45f17] text-white font-medium py-3 rounded-sm shadow-sm transition-colors text-sm uppercase tracking-wide"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
