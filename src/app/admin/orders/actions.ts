'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = await createClient()

    // Verify Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) {
        console.error('Update Status Error:', error)
        return { error: error.message }
    }

    // Trigger Email if Cancelled
    if (status === 'cancelled') {
        const { sendOrderEmail } = await import('@/app/actions/orderEmail')
        await sendOrderEmail(orderId, 'cancelled')
    }
    // Also trigger for shipped/delivered if needed later
    if (status === 'shipped') {
        const { sendOrderEmail } = await import('@/app/actions/orderEmail')
        await sendOrderEmail(orderId, 'shipped')
    }
    if (status === 'delivered') {
        const { sendOrderEmail } = await import('@/app/actions/orderEmail')
        await sendOrderEmail(orderId, 'delivered')
    }

    revalidatePath('/admin/orders')
    return { success: true }
}

export async function deleteOrder(orderId: string) {
    const supabase = await createClient()

    // Verify Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    // Delete - Cascade should handle items if configured, but let's be safe
    // Assuming 'order_items' has ON DELETE CASCADE constraint on order_id. 
    // If not, we should delete items first. Most Supabase setups do this by default.
    // If it fails, I'll update to delete items first.

    // Explicitly deleting items first is safer if unsure about FK schema
    await supabase.from('order_items').delete().eq('order_id', orderId)

    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)

    if (error) {
        console.error('Delete Order Error:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/orders')
    return { success: true }
}
