'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
    const supabase = await createClient()

    // Validate session/admin role here if not handled by middleware
    // For now, assuming middleware covers /admin/*

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const status = formData.get('status') as string
    const imageUrl = formData.get('imageUrl') as string // From Cloudinary Widget

    // 1. Create Product
    const { data: product, error } = await supabase
        .from('products')
        .insert({
            title,
            slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), // Simple slugify
            description,
            price,
            stock,
            status,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating product:', error)
        return { error: 'Failed to create product' }
    }

    // 2. Create Product Image (Primary)
    if (imageUrl && product) {
        await supabase.from('product_images').insert({
            product_id: product.id,
            cloudinary_url: imageUrl,
            is_primary: true,
        })
    }

    revalidatePath('/admin/products')
    redirect('/admin/products')
}
