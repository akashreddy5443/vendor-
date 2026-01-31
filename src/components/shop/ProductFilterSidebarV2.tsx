'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, Filter, Search, X } from 'lucide-react'

interface FilterSidebarProps {
    minPrice: number
    maxPrice: number
    brands: string[]
    categories: { id: string, name: string, slug: string }[]
    isOpen?: boolean
    onClose?: () => void
}

export function ProductFilterSidebarV2({
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
                    <h3 className="font-heading font-bold text-lg">Filter Products</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="mb-8 relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        defaultValue={searchParams.get('q') || ''}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const params = new URLSearchParams(searchParams.toString())
                                params.set('q', e.currentTarget.value)
                                params.delete('page')
                                router.push(`?${params.toString()}`, { scroll: false })
                            }
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <h4 className="flex items-center gap-2 font-heading font-bold text-sm uppercase tracking-wider text-slate-900 mb-4">
                        All Categories
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

                    {/* Price Presets */}
                    <div className="space-y-2 mb-6">
                        {[
                            { label: 'Under ₹20,000', min: 0, max: 20000 },
                            { label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
                            { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
                            { label: 'Over ₹1,00,000', min: 100000, max: maxPrice }
                        ].map((preset, idx) => (
                            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`
                                    w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                                    ${(priceRange[0] === preset.min && priceRange[1] === preset.max)
                                        ? 'border-primary'
                                        : 'border-slate-300 group-hover:border-primary'}
                                `}>
                                    {(priceRange[0] === preset.min && priceRange[1] === preset.max) && (
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    name="pricePreset"
                                    className="hidden"
                                    checked={priceRange[0] === preset.min && priceRange[1] === preset.max}
                                    onChange={() => setPriceRange([preset.min, preset.max])}
                                />
                                <span className={`text-sm transition-colors ${(priceRange[0] === preset.min && priceRange[1] === preset.max) ? 'text-primary font-medium' : 'text-slate-600'}`}>
                                    {preset.label}
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* Manual Range */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                            <span>Custom Range</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                                <input
                                    type="number"
                                    min={minPrice}
                                    max={priceRange[1]}
                                    value={priceRange[0]}
                                    onChange={(e) => {
                                        const raw = Number(e.target.value);
                                        // Prevent negative inputs and clamp to valid range
                                        const val = Math.max(minPrice, Math.min(raw, priceRange[1] - 100));
                                        setPriceRange([val, priceRange[1]]);
                                    }}
                                    className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                                />
                            </div>
                            <span className="text-slate-300">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                                <input
                                    type="number"
                                    min={priceRange[0]}
                                    max={maxPrice}
                                    value={priceRange[1]}
                                    onChange={(e) => {
                                        const raw = Number(e.target.value);
                                        // Prevent negative inputs and clamp to valid range
                                        const val = Math.min(maxPrice, Math.max(raw, priceRange[0] + 100));
                                        setPriceRange([priceRange[0], val]);
                                    }}
                                    className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        {/* Visual Slider (Pseudo) */}
                        <div className="relative h-1 bg-slate-200 rounded-full mt-2">
                            <div
                                className="absolute h-full bg-primary rounded-full transition-all duration-300"
                                style={{
                                    left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                                    right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`
                                }}
                            />
                        </div>
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
