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
