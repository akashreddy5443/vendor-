'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleWishlist(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Please login to add items to wishlist' }
    }

    // Check if exists
    const { data: existing } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

    if (existing) {
        // Remove
        await supabase.from('wishlist').delete().eq('id', existing.id)
        revalidatePath('/wishlist')
        revalidatePath('/')
        return { isWishlisted: false, message: 'Removed from wishlist' }
    } else {
        // Add
        await supabase.from('wishlist').insert({
            user_id: user.id,
            product_id: productId
        })
        revalidatePath('/wishlist')
        revalidatePath('/')
        return { isWishlisted: true, message: 'Added to wishlist' }
    }
}

export async function checkWishlistStatus(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

    return !!data
}
