'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
    const productId = formData.get('productId') as string
    const rating = Number(formData.get('rating'))
    const comment = formData.get('comment') as string

    if (!rating || rating < 1 || rating > 5) {
        return { error: 'Please provide a valid rating (1-5)' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to review' }
    }

    // Check if already reviewed? (Optional, skipping for now to allow multiple reviews or strict verify)
    // For now, let's allow 1 review per user per product logic if we wanted.
    const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

    if (existing) {
        // Update existing
        const { error } = await supabase
            .from('reviews')
            .update({ rating, comment, created_at: new Date().toISOString() })
            .eq('id', existing.id)

        if (error) return { error: error.message }
        revalidatePath(`/products/${productId}`)
        return { success: true, message: 'Review updated' }
    }

    const { error } = await supabase
        .from('reviews')
        .insert({
            user_id: user.id,
            product_id: productId,
            rating,
            comment
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/products/${productId}`)
    return { success: true, message: 'Review submitted' }
}
