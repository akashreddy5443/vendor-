import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/client'

// Since this is a server-side file in app directory, we can use fetch or Supabase directly if we want
// But for static generation, we should be careful with env vars if running at build time against prod DB.
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vencortech17.vercel.app' // Fallback to provided domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient()

    // Fetch Products
    const { data: products } = await supabase
        .from('products')
        .select('id, slug, updated_at')
        .eq('status', 'active')

    const productUrls = products?.map((product) => ({
        url: `${baseUrl}/products/${product.id}`, // or slug if we had it fully enforced
        lastModified: new Date(product.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    })) || []

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...productUrls,
    ]
}
