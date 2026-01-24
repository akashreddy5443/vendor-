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
        <div className="bg-background text-foreground min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold font-serif mb-8 text-center">Shop by Category</h1>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading categories...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/products?category=${cat.id}`}
                                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                            >
                                <div className="flex flex-col items-center text-center gap-4">
                                    {/* Placeholder Icon/Image Logic - could be dynamic later */}
                                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <span className="text-2xl text-foreground font-bold group-hover:text-primary-foreground">{cat.name.charAt(0)}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground group-hover:text-card-foreground/80">
                                        {cat.description || 'Browse products'}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {categories.length === 0 && !loading && (
                    <div className="text-center py-20 text-gray-500">
                        No categories found.
                    </div>
                )}
            </div>
        </div>
    )
}
