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
    const discount_percentage = formData.get('discount_percentage') ? parseFloat(formData.get('discount_percentage') as string) : null
    const gst_percentage = formData.get('gst_percentage') ? parseFloat(formData.get('gst_percentage') as string) : null
    const status = formData.get('status') as string
    const category_id = formData.get('category_id') as string || null
    const brand = formData.get('brand') as string || null
    const short_benefit = formData.get('short_benefit') as string || null
    const badgesString = formData.get('badges') as string
    const badges = badgesString ? JSON.parse(badgesString) : []
    const mediaString = formData.get('media') as string
    const media = mediaString ? JSON.parse(mediaString) : []
    const featuresString = formData.get('features') as string
    const features = featuresString ? JSON.parse(featuresString) : []

    // 1. Create Product
    console.log('[Action] Creating Product:', { title, price, status })

    const { data: product, error } = await supabase
        .from('products')
        .insert({
            title,
            slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), // Simple slugify
            description,
            price,
            stock,
            discount_percentage,
            gst_percentage,
            status,
            category_id,
            brand,
            short_benefit,
            badges,
            features
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating product:', error)
        return { error: 'Failed to create product' }
    }

    // 2. Create Product Images
    if (media.length > 0 && product) {
        const imagesData = media.map((item: any, index: number) => ({
            product_id: product.id,
            cloudinary_url: item.url,
            media_type: item.type,
            is_primary: index === 0 // First item is primary
        }))

        await supabase.from('product_images').insert(imagesData)
    }

    revalidatePath('/admin/products')
    redirect('/admin/products')
}

export async function deleteProduct(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
        console.error('Error deleting product:', error)
        return { error: 'Failed to delete product' }
    }

    revalidatePath('/admin/products')
}

export async function updateProduct(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const discount_percentage = formData.get('discount_percentage') ? parseFloat(formData.get('discount_percentage') as string) : null
    const gst_percentage = formData.get('gst_percentage') ? parseFloat(formData.get('gst_percentage') as string) : null
    const status = formData.get('status') as string
    const category_id = formData.get('category_id') as string || null
    const brand = formData.get('brand') as string || null
    const short_benefit = formData.get('short_benefit') as string || null
    const badgesString = formData.get('badges') as string
    const badges = badgesString ? JSON.parse(badgesString) : []
    const mediaString = formData.get('media') as string
    const media = mediaString ? JSON.parse(mediaString) : []
    const featuresString = formData.get('features') as string
    const features = featuresString ? JSON.parse(featuresString) : []

    // 1. Update Product
    const { error: updateError } = await supabase
        .from('products')
        .update({
            title,
            description,
            price,
            stock,
            discount_percentage,
            gst_percentage,
            status,
            category_id,
            brand,
            short_benefit,
            badges,
            features
        })
        .eq('id', id)

    if (updateError) {
        console.error('Error updating product:', updateError)
        return { error: 'Failed to update product' }
    }

    // 2. Update Media (Strategy: Delete Non-Primary/All and Re-insert? 
    // Or smarter diff? For simplicity, we delete all image entries for this product and re-add 
    // to match the form state exactly. This preserves order.)

    // First, delete existing
    await supabase.from('product_images').delete().eq('product_id', id)

    // Then insert new
    if (media.length > 0) {
        const imagesData = media.map((item: any, index: number) => ({
            product_id: id,
            cloudinary_url: item.url,
            media_type: item.type,
            is_primary: index === 0
        }))
        await supabase.from('product_images').insert(imagesData)
    }

    revalidatePath('/admin/products')
    redirect('/admin/products')
}
