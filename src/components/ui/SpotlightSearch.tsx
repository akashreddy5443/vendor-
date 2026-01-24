'use client'

import * as React from 'react'
import { Search, X, Loader2, Command } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export function SpotlightSearch() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState('')
    const [results, setResults] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Toggle with Cmd+K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    // Focus input on open
    React.useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [open])

    // Search Logic
    React.useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (!query) {
                setResults([])
                return
            }

            setLoading(true)
            const supabase = createClient()
            const { data } = await supabase
                .from('products')
                .select('id, title, price, slug, product_images(cloudinary_url)')
                .ilike('title', `%${query}%`)
                .eq('status', 'active')
                .limit(5)

            setResults(data || [])
            setLoading(false)
        }, 300) // Debounce

        return () => clearTimeout(timeoutId)
    }, [query])

    const handleSelect = (id: string) => {
        setOpen(false)
        router.push(`/products/${id}`)
        setQuery('')
    }

    return (
        <>
            {/* Trigger Button (Visible on Desktop Navbar usually, or hidden if pure shortcut) */}
            <button
                onClick={() => setOpen(true)}
                className="hidden md:flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-4 py-1.5 text-sm text-gray-400 hover:border-gray-700 hover:text-white transition-colors"
            >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline-flex">Search...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-400 opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            {/* Mobile Search Icon */}
            <button
                onClick={() => setOpen(true)}
                className="flex md:hidden items-center justify-center p-2 text-gray-400 hover:text-white"
            >
                <Search className="h-5 w-5" />
            </button>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Search Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-gray-800 bg-black shadow-2xl shadow-orange-500/10 mx-4"
                        >
                            <div className="flex items-center border-b border-gray-800 px-4">
                                <Search className="mr-2 h-5 w-5 shrink-0 text-gray-500" />
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="flex h-14 w-full bg-transparent py-3 text-lg text-white placeholder:text-gray-500 focus:outline-none"
                                />
                                {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin text-orange-500" />}
                                <button onClick={() => setOpen(false)} className="ml-2 p-1 text-gray-500 hover:text-white">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {results.length === 0 && query && !loading && (
                                    <p className="p-4 text-center text-sm text-gray-500">No results found.</p>
                                )}

                                {results.length === 0 && !query && (
                                    <div className="p-4 text-center text-sm text-gray-500">
                                        Type to search...
                                    </div>
                                )}

                                {results.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleSelect(product.id)}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-gray-900 transition-colors group"
                                    >
                                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-800 bg-gray-900">
                                            {product.product_images?.[0]?.cloudinary_url ? (
                                                <Image
                                                    src={product.product_images[0].cloudinary_url}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Command className="h-4 w-4 text-gray-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-200 group-hover:text-white">{product.title}</h3>
                                            <p className="text-xs text-orange-500 font-mono">₹{product.price}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-gray-800 bg-gray-900/50 px-4 py-2">
                                <p className="text-[10px] text-gray-500 flex justify-end gap-2">
                                    <span>Search by TechDev</span>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
