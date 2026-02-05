'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Loader2, X, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface SearchResult {
    id: string
    title: string
    slug: string
    image: string | null
    price: number
    currentPrice: number
    stock: number
    discount: number
}

export function InstantSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true)
                setIsOpen(true)
                try {
                    console.log('🔍 Searching for:', query)

                    // Direct Public Client Query (Matches Main Page Logic)
                    const supabase = createClient()

                    const { data, error } = await supabase
                        .from('products')
                        .select(`
                            id,
                            title,
                            slug,
                            price,
                            discount_percentage,
                            stock,
                            description,
                            product_images(cloudinary_url, is_primary)
                        `)
                        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
                        .eq('status', 'active')
                        .limit(6)
                        .order('stock', { ascending: false })

                    console.log('📦 Search results:', data)
                    console.log('❌ Search error:', error)

                    if (error) {
                        console.error('Search error details:', {
                            message: error.message,
                            code: error.code,
                            details: error.details,
                            hint: error.hint
                        })
                        throw error
                    }

                    // Format data exactly as the component expects
                    const formattedResults: SearchResult[] = (data || []).map((p: any) => {
                        const image = p.product_images?.find((img: any) => img.is_primary)?.cloudinary_url
                            || p.product_images?.[0]?.cloudinary_url
                            || null

                        let currentPrice = p.price
                        if (p.discount_percentage > 0) {
                            currentPrice = p.price * (1 - p.discount_percentage / 100)
                        }

                        return {
                            id: p.id,
                            title: p.title,
                            slug: p.slug,
                            image,
                            price: p.price,
                            currentPrice,
                            stock: p.stock,
                            discount: p.discount_percentage
                        }
                    })

                    setResults(formattedResults)
                } catch (err) {
                    console.error('Search failed', err)
                    setResults([])
                } finally {
                    setLoading(false)
                }
            } else {
                setResults([])
                if (query.length === 0) setIsOpen(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            setIsOpen(false)
            router.push(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto hidden lg:block">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="Search for laptops, monitors..."
                    className="w-full pl-10 pr-12 py-2.5 rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
                />
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('')
                            setIsOpen(false)
                        }}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </form>

            {/* Results Dropdown */}
            {isOpen && (query.length >= 2) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    {loading ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            <h3 className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Products</h3>
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                <Package className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                            {product.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-bold text-slate-900">
                                                {formatPrice(product.currentPrice)}
                                            </span>
                                            {product.discount > 0 && (
                                                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">
                                                    -{Math.round(product.discount)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {product.stock === 0 && (
                                        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                                            Sold Out
                                        </span>
                                    )}
                                </Link>
                            ))}
                            <div className="border-t border-slate-100 mt-2 pt-2 pb-1 px-2">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full text-center py-2 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide"
                                >
                                    View all results for "{query}"
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No products found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
