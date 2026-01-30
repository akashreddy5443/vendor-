'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
    const productId = formData.get('productId') as string
    const rating = parseInt(formData.get('rating') as string)
    const comment = formData.get('comment') as string
    const authorName = formData.get('authorName') as string

    if (!productId || !rating || !comment) {
        return { error: 'Missing required fields' }
    }

    const supabase = await createClient()

    // Check if user is logged in to associate with user_id
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Please sign in to leave a review' }

    // Verify Purchase
    const { data: purchase } = await supabase
        .from('order_items')
        .select('id, orders!inner(status, user_id)')
        .eq('product_id', productId)
        .eq('orders.user_id', user.id)
        .eq('orders.status', 'delivered')
        .maybeSingle()

    if (!purchase) {
        return { error: 'Only verified purchasers of this item can leave a review.' }
    }

    const { error } = await supabase
        .from('reviews')
        .insert({
            product_id: productId,
            user_id: user.id,
            rating,
            comment,
            author_name: authorName,
            is_verified_purchase: true,
            status: 'pending' // Default to pending for moderation
        })

    if (error) {
        console.error('Error submitting review:', error)
        return { error: 'Failed to submit review' }
    }

    revalidatePath(`/products/${productId}`)
    return { success: true }
}
