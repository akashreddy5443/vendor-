'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, Filter, X } from 'lucide-react'

interface FilterSidebarProps {
    minPrice: number
    maxPrice: number
    brands: string[]
    categories: { id: string, name: string, slug: string }[]
    isOpen?: boolean
    onClose?: () => void
}

export function ProductFilterSidebar({
    minPrice,
    maxPrice,
    brands,
    categories,
    isOpen,
    onClose
}: FilterSidebarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Local state for UI feedback, synced with URL
    const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
        searchParams.get('category')?.split(',').filter(Boolean) || []
    )
    const [selectedBrands, setSelectedBrands] = React.useState<string[]>(
        searchParams.get('brand')?.split(',').filter(Boolean) || []
    )
    const [priceRange, setPriceRange] = React.useState<[number, number]>([
        Number(searchParams.get('min_price')) || minPrice,
        Number(searchParams.get('max_price')) || maxPrice
    ])
    const [inStockOnly, setInStockOnly] = React.useState(
        searchParams.get('stock') === 'true'
    )

    // Debounce price updates
    React.useEffect(() => {
        const timer = setTimeout(() => {
            updateFilters()
        }, 500)
        return () => clearTimeout(timer)
    }, [priceRange])

    const updateFilters = (override?: any) => {
        const params = new URLSearchParams(searchParams.toString())

        // Categories
        if (selectedCategories.length > 0) {
            params.set('category', selectedCategories.join(','))
        } else {
            params.delete('category')
        }

        // Brands
        if (selectedBrands.length > 0) {
            params.set('brand', selectedBrands.join(','))
        } else {
            params.delete('brand')
        }

        // Price
        if (priceRange[0] > minPrice || priceRange[1] < maxPrice) {
            params.set('min_price', priceRange[0].toString())
            params.set('max_price', priceRange[1].toString())
        } else {
            params.delete('min_price')
            params.delete('max_price')
        }

        // Stock
        if (inStockOnly) {
            params.set('stock', 'true')
        } else {
            params.delete('stock')
        }

        // Reset page to 1 on filter change
        params.delete('page')

        router.push(`?${params.toString()}`, { scroll: false })
    }

    const toggleCategory = (slug: string) => {
        const newCats = selectedCategories.includes(slug)
            ? selectedCategories.filter(c => c !== slug)
            : [...selectedCategories, slug]
        setSelectedCategories(newCats)
        // Trigger update immediately
        const params = new URLSearchParams(searchParams.toString())
        if (newCats.length > 0) params.set('category', newCats.join(','))
        else params.delete('category')
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const toggleBrand = (brand: string) => {
        const newBrands = selectedBrands.includes(brand)
            ? selectedBrands.filter(b => b !== brand)
            : [...selectedBrands, brand]
        setSelectedBrands(newBrands)
        // Trigger update immediately
        const params = new URLSearchParams(searchParams.toString())
        if (newBrands.length > 0) params.set('brand', newBrands.join(','))
        else params.delete('brand')
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block lg:w-64 lg:shadow-none lg:bg-transparent
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="h-full overflow-y-auto p-6 lg:p-0">
                <div className="flex items-center justify-between lg:hidden mb-6">
                    <h3 className="font-heading font-bold text-lg">Filters</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <h4 className="flex items-center gap-2 font-heading font-bold text-sm uppercase tracking-wider text-slate-900 mb-4">
                        Categories
                    </h4>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`
                                    w-4 h-4 rounded-md border flex items-center justify-center transition-colors
                                    ${selectedCategories.includes(cat.slug)
                                        ? 'bg-primary border-primary text-white'
                                        : 'border-slate-300 group-hover:border-primary'}
                                `}>
                                    {selectedCategories.includes(cat.slug) && <Check className="w-3 h-3" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedCategories.includes(cat.slug)}
                                    onChange={() => toggleCategory(cat.slug)}
                                />
                                <span className={`text-sm transition-colors ${selectedCategories.includes(cat.slug) ? 'text-primary font-medium' : 'text-slate-600'}`}>
                                    {cat.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Brands */}
                <div className="mb-8">
                    <h4 className="flex items-center gap-2 font-heading font-bold text-sm uppercase tracking-wider text-slate-900 mb-4">
                        Brands
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {brands.map(brand => (
                            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`
                                    w-4 h-4 rounded-md border flex items-center justify-center transition-colors
                                    ${selectedBrands.includes(brand)
                                        ? 'bg-primary border-primary text-white'
                                        : 'border-slate-300 group-hover:border-primary'}
                                `}>
                                    {selectedBrands.includes(brand) && <Check className="w-3 h-3" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                />
                                <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">
                                    {brand}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                    <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 mb-4">
                        Price Range
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                            <span>₹{priceRange[0]}</span>
                            <span>₹{priceRange[1]}</span>
                        </div>
                        <input
                            type="range"
                            min={minPrice}
                            max={maxPrice}
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>

                {/* Availability */}
                <div className="mb-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`
                            w-10 h-5 rounded-full border transition-colors relative
                            ${inStockOnly ? 'bg-primary border-primary' : 'bg-slate-200 border-slate-200'}
                        `}>
                            <div className={`
                                w-3 h-3 bg-white rounded-full absolute top-1 transition-all
                                ${inStockOnly ? 'left-6' : 'left-1'}
                            `} />
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={inStockOnly}
                            onChange={(e) => {
                                setInStockOnly(e.target.checked);
                                // Trigger update manually since it's not in debounce
                                const params = new URLSearchParams(searchParams.toString())
                                if (e.target.checked) params.set('stock', 'true')
                                else params.delete('stock')
                                router.push(`?${params.toString()}`, { scroll: false })
                            }}
                        />
                        <span className="text-sm font-medium text-slate-700">In Stock Only</span>
                    </label>
                </div>
            </div>
        </aside>
    )
}
