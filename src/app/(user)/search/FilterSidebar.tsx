'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function FilterSidebar({ categories }: { categories: any[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initial State from URL
    const currentCategory = searchParams.get('category') || 'all'
    const currentMinPrice = searchParams.get('min_price') || ''
    const currentMaxPrice = searchParams.get('max_price') || ''

    const [minPrice, setMinPrice] = useState(currentMinPrice)
    const [maxPrice, setMaxPrice] = useState(currentMaxPrice)

    const handleCategoryChange = (catId: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (catId === 'all') params.delete('category')
        else params.set('category', catId)
        router.push(`/search?${params.toString()}`)
    }

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString())
        if (minPrice) params.set('min_price', minPrice)
        else params.delete('min_price')

        if (maxPrice) params.set('max_price', maxPrice)
        else params.delete('max_price')

        router.push(`/search?${params.toString()}`)
    }

    return (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-bold text-foreground mb-4">Categories</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => handleCategoryChange('all')}
                        className={`block text-sm ${currentCategory === 'all' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        All Products
                    </button>
                    {categories.map((cat) => {
                        const isActive = currentCategory === cat.slug || currentCategory === cat.id
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.slug || cat.id)}
                                className={`block text-sm ${isActive ? 'text-blue-500 font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {cat.name}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-bold text-foreground mb-4">Price Range</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₹</span>
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full pl-6 rounded-md bg-white border border-gray-200 p-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                        <span className="text-gray-300">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₹</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full pl-6 rounded-md bg-white border border-gray-200 p-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                    <button
                        onClick={applyPriceFilter}
                        className="w-full rounded-md bg-[#191970] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#131355] transition-colors uppercase tracking-wider"
                    >
                        Apply Price
                    </button>
                    {(minPrice || maxPrice) && (
                        <button
                            onClick={() => { setMinPrice(''); setMaxPrice(''); router.push(`/search?category=${currentCategory}`) }}
                            className="w-full text-xs text-gray-500 hover:text-red-500 underline decoration-gray-300 hover:decoration-bd-500"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
