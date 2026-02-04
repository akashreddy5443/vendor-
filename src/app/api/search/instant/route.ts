import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
        return NextResponse.json([])
    }

    // HARDCODED KEYS to rule out Vercel Env Var issues
    const SUPABASE_URL = "https://reokmwqcdzofbimdwcxp.supabase.co"
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlb2ttd3FjZHpvZmJpbWR3Y3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMjc5OTcsImV4cCI6MjA4NDgwMzk5N30.vC8jB0i9jc_g_jqiBD5ZlERbF0KaccyU4292QHZ9658"

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    console.log(`[Search API] Searching for: "${query}"`)

    // Simple, robust query: Title Only, Active Only
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            id,
            title,
            slug,
            price,
            sale_price,
            discount_percentage,
            stock,
            product_images(cloudinary_url, is_primary)
        `)
        .ilike('title', `%${query}%`)
        .eq('status', 'active')
        .limit(10)

    if (error) {
        console.error('[Search API] DB Error:', error)
        return NextResponse.json([]) // Return empty array on error to prevent crashes
    }

    // Format the response for the frontend
    const results = products.map((p: any) => {
        const image = p.product_images?.find((img: any) => img.is_primary)?.cloudinary_url
            || p.product_images?.[0]?.cloudinary_url
            || null

        // Calculate current price logic (same as standardized elsewhere)
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

    return NextResponse.json(results)
}
