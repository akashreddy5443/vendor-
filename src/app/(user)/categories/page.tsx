'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('name')

            if (data) setCategories(data)
            setLoading(false)
        }
        fetchCategories()
    }, [])

    return (
        <div className="bg-white text-slate-900 min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 mt-8">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tight text-slate-900">
                        Browse <span className="text-indigo-600">Categories</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                        Explore our curated collection of elite developer tools, professional hardware, and workspace essentials.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] border border-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/search?category=${cat.slug || cat.id}`}
                                className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-200/40 hover:-translate-y-2"
                            >
                                {cat.image_url ? (
                                    <img
                                        src={cat.image_url}
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center p-6 text-center">
                                        <span className="text-4xl font-black text-slate-200 uppercase tracking-tighter group-hover:text-indigo-100 transition-colors">
                                            {cat.name}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors leading-tight">
                                        {cat.name}
                                    </h3>
                                    <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 group-hover:bg-indigo-600 transition-colors">
                                        Explore Collection
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {categories.length === 0 && !loading && (
                    <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No collections found</p>
                    </div>
                )}
            </div>
        </div>
    )
}
