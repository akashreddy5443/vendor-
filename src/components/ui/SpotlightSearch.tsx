'use client'

import * as React from 'react'
import { Search, X, Loader2, Command, ArrowRight } from 'lucide-react'
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

    const handleSearchAll = () => {
        setOpen(false)
        router.push(`/search?q=${encodeURIComponent(query)}`)
        setQuery('')
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchAll()
        }
    }

    return (
        <>
            {/* Trigger Button (Visible on Desktop Navbar usually, or hidden if pure shortcut) */}
            <button
                onClick={() => setOpen(true)}
                className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 hover:border-primary hover:ring-1 hover:ring-primary transition-all w-full shadow-sm"
            >
                <Search className="h-4 w-4 text-primary" />
                <span className="flex-grow text-left">Search products...</span>
                <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
                    <span className="text-xs text-gray-400">All Categories</span>
                    <div className="bg-gray-100 rounded px-1.5 py-0.5">
                        <span className="text-[10px] text-gray-500">⌘K</span>
                    </div>
                </div>
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
                            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/40 bg-white/90 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(45,92,247,0.25)] mx-4 text-foreground ring-1 ring-primary/5"
                        >
                            <div className="flex items-center border-b border-slate-100 px-6">
                                <Search className="mr-3 h-5 w-5 shrink-0 text-primary" />
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    placeholder="Search the TechDev inventory..."
                                    className="flex h-16 w-full bg-transparent py-4 text-lg font-heading font-black placeholder:text-slate-400 placeholder:font-medium focus:outline-none tracking-tight"
                                />
                                {loading && <Loader2 className="ml-2 h-5 w-5 animate-spin text-primary" />}
                                <button onClick={() => setOpen(false)} className="ml-2 p-2 text-slate-400 hover:text-primary transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
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
                                        className="flex w-full items-center gap-4 rounded-3xl px-4 py-3 text-left hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                                    >
                                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white group-hover:scale-110 transition-transform duration-500">
                                            {product.product_images?.[0]?.cloudinary_url ? (
                                                <Image
                                                    src={product.product_images[0].cloudinary_url}
                                                    alt={product.title}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Command className="h-5 w-5 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-heading font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight line-clamp-1">{product.title}</h3>
                                            <p className="text-xs text-primary font-bold uppercase tracking-widest mt-0.5">₹{product.price}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-slate-50 bg-slate-50/30 px-6 py-4 flex items-center justify-between">
                                <button
                                    onClick={handleSearchAll}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-indigo-600 transition-colors"
                                >
                                    Press Enter for full specifications
                                </button>
                                <div className="flex items-center gap-2 opacity-30 select-none">
                                    <span className="text-[9px] font-black uppercase tracking-tighter">Powered by</span>
                                    <div className="bg-primary text-white h-4 w-4 rounded flex items-center justify-center text-[8px] font-black">T</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
        </>
    )
}
