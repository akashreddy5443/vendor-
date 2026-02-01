'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendOrderEmail } from '@/app/actions/orderEmail'

export async function cancelUserOrder(orderId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // 1. Verify ownership and status
    const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('id, status, user_id')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !order) {
        return { error: 'Order not found' }
    }

    if (!['pending', 'processing'].includes(order.status)) {
        return { error: 'Order cannot be cancelled at this stage' }
    }

    // 2. Cancel Order
    const { error: updateError } = await supabase
        .from('orders')
        .update({
            status: 'cancelled',
            updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

    if (updateError) {
        return { error: 'Failed to cancel order' }
    }

    // 3. Send Email
    try {
        await sendOrderEmail(order.id, 'cancelled')
    } catch (err) {
        console.error('Failed to send cancellation email:', err)
    }

    revalidatePath(`/user/orders/${orderId}`)
    revalidatePath('/user/orders')

    return { success: true }
}
