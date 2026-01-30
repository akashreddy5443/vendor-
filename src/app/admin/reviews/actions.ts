'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveReview(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', id)

    if (error) {
        console.error('Error approving review:', error)
        return { error: 'Failed to approve review' }
    }

    revalidatePath('/admin/reviews')
    revalidatePath('/products') // Revalidate all products to show new review
    return { success: true }
}

export async function deleteReview(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting review:', error)
        return { error: 'Failed to delete review' }
    }

    revalidatePath('/admin/reviews')
    return { success: true }
}

export async function rejectReview(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('reviews')
        .update({ status: 'rejected' })
        .eq('id', id)

    if (error) {
        console.error('Error rejecting review:', error)
        return { error: 'Failed to reject review' }
    }

    revalidatePath('/admin/reviews')
    return { success: true }
}
