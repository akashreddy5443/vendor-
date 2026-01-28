'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { ProductCard } from './ProductCard'

export function CartRecommendations() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecommendations = async () => {
            const supabase = createClient()
            // Simple random-ish selection: just take first 4 for now, 
            // improved logic would use 'random()' or specific tags
            const { data } = await supabase
                .from('products')
                .select(`
                    *,
                    product_images (
                        cloudinary_url,
                        is_primary
                    )
                `)
                .limit(4)
                .order('created_at', { ascending: false }) // Just get newest for now

            // Also fetch global settings for pricing logic if needed, 
            // but ProductCard might default them. 
            // Ideally we pass them, but for speed let's rely on ProductCard's defaults or fetch them too.
            // Actually ProductCard defaults to 0 and 18 if not passed. 
            // Let's fetch settings to be precise.
            const { data: settings } = await supabase.from('site_settings').select('global_discount_percentage, default_gst_percentage').single()

            if (data) {
                const productsWithSettings = data.map(p => ({
                    ...p,
                    globalDiscount: settings?.global_discount_percentage || 0,
                    globalGst: settings?.default_gst_percentage || 18
                }))
                setProducts(productsWithSettings)
            }
            setLoading(false)
        }

        fetchRecommendations()
    }, [])

    if (loading) return null
    if (products.length === 0) return null

    return (
        <div className="mt-16 pt-10 border-t border-[#191970]/10">
            <h3 className="text-2xl font-extrabold uppercase text-[#191970] mb-8 tracking-tight">You Might Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        globalDiscount={product.globalDiscount}
                        globalGst={product.globalGst}
                    />
                ))}
            </div>
        </div>
    )
}
