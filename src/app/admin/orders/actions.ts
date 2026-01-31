'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendOrderEmail } from '@/app/actions/orderEmail'

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const supabase = await createClient()

    try {
        // 1. Update Status in DB
        const { error } = await supabase
            .from('orders')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId)

        if (error) {
            console.error('Error updating order status:', error)
            return { error: 'Failed to update status' }
        }

        // 2. Trigger Email Notification (Non-blocking)
        // We catch errors here so the UI still shows success even if email fails
        try {
            if (['shipped', 'delivered', 'cancelled'].includes(newStatus)) {
                await sendOrderEmail(orderId, newStatus as any)
            }
        } catch (emailError) {
            console.error('Failed to send status email:', emailError)
        }

        revalidatePath('/admin/orders')
        revalidatePath(`/admin/orders/${orderId}`)
        return { success: true }
    } catch (e) {
        return { error: 'Unexpected error' }
    }
}
