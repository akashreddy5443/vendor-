'use client'

import React from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/shop/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '@/lib/utils'

interface ProductPageProps {
    searchParams: {
        category?: string
    }
}

export default function ProductsPage({ searchParams }: ProductPageProps) {
    const [products, setProducts] = React.useState<any[]>([])
    const [globalDiscount, setGlobalDiscount] = React.useState(0)
    const [globalGst, setGlobalGst] = React.useState(18)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient()
            setLoading(true)

            let query = supabase
                .from('products')
                .select('*, product_images(*)')
                .eq('status', 'active')
                .order('created_at', { ascending: false })

            if (searchParams.category && searchParams.category !== 'all') {
                const { data: categoryData } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('slug', searchParams.category)
                    .single()

                if (categoryData) {
                    query = query.eq('category_id', categoryData.id)
                }
            }

            const { data: productsData } = await query
            setProducts(productsData || [])

            const { data: settings } = await supabase.from('site_settings').select('global_discount_percentage, default_gst_percentage').single()
            setGlobalDiscount(settings?.global_discount_percentage || 0)
            setGlobalGst(settings?.default_gst_percentage || 18)
            setLoading(false)
        }
        fetchData()
    }, [searchParams.category])

    return (
        <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 mt-10">
                {/* Premium Header */}
                <div className="text-center mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center items-center gap-2 text-primary"
                    >
                        <span className="w-8 h-[2px] bg-primary/20" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Inventory</span>
                        <span className="w-8 h-[2px] bg-primary/20" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black font-heading text-slate-900 uppercase tracking-tight"
                    >
                        The <span className="text-primary">Collection</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 max-w-2xl mx-auto text-sm font-medium tracking-tight"
                    >
                        Explore our curated series of elite developer tools, professional hardware, and workspace essentials.
                    </motion.p>
                </div>

                {/* Filters & Sort Shell */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Showing {products?.length || 0} Results</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Placeholder for real filters */}
                        <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-100 italic">
                            Refinement Tools coming soon
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {loading ? (
                        // Skeleton Loaders
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] p-6 border border-slate-50 shadow-sm animate-pulse h-[480px]">
                                <div className="aspect-square bg-slate-100 rounded-3xl mb-6" />
                                <div className="h-2 w-24 bg-slate-100 rounded-full mb-4" />
                                <div className="h-6 w-full bg-slate-100 rounded-lg mb-2" />
                                <div className="h-4 w-3/4 bg-slate-100 rounded-lg mb-6" />
                                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between">
                                    <div className="h-8 w-24 bg-slate-100 rounded-lg" />
                                    <div className="h-10 w-10 bg-slate-100 rounded-xl" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <AnimatePresence>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <ProductCard product={product} globalDiscount={globalDiscount} globalGst={globalGst} />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest font-heading">No results found</h3>
                                    <p className="text-slate-500 mt-2 font-medium">Try adjusting your category or check back soon.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    )
}
