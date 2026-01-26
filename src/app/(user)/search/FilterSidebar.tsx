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
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full rounded bg-background border border-border p-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none"
                        />
                        <span className="text-muted-foreground">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full rounded bg-background border border-border p-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={applyPriceFilter}
                        className="w-full rounded bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                    >
                        Apply Price
                    </button>
                </div>
            </div>
        </div>
    )
}
