'use client'

import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

export function RecentlyViewed() {
    const { recentProducts } = useRecentlyViewed()

    if (recentProducts.length === 0) return null

    return (
        <div className="w-full space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Recently Viewed</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recentProducts.map((product) => (
                    <Link
                        href={`/products/${product.id}`} // Assuming ID for now based on current routing, or slug if updated
                        key={product.id}
                        className="group bg-white border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow block"
                    >
                        <div className="relative aspect-square mb-2 overflow-hidden rounded bg-gray-50 border border-gray-100">
                            <Image
                                src={product.image || '/placeholder.png'}
                                alt={product.title}
                                fill
                                className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[2.5em]">
                            {product.title}
                        </h4>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                            {formatPrice(product.price)}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
