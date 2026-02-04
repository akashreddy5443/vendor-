import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
        return NextResponse.json([])
    }

    // Use Service Role to bypass RLS for public search
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log(`[Search API] Searching for: "${query}"`)

    // Perform a text search on title mainly (using SERVICE ROLE)
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
            description,
            product_images(
                cloudinary_url,
                is_primary
            )
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('status', 'active') // Only show active products
        .order('stock', { ascending: false }) // Prioritize in-stock items
        .limit(6)

    if (error) {
        console.error('Search API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
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
