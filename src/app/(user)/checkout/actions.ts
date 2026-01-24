'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createOrder(data: { addressId: string, paymentMethod: string, total: number, items: any[] }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "User not authenticated" }
    }

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            status: 'pending', // paid if payment succeeds instantly
            total_amount: data.total,
            shipping_address: data.addressId, // We might want to store JSON of address snapshot instead of ID in production
            payment_status: 'pending',
            items: data.items // If we have a jsonb items column, otherwise likely separate order_items table
        })
        .select()
        .single()

    if (orderError) {
        console.error("Order creation failed:", orderError)
        return { error: "Failed to create order" }
    }

    // 2. Clear Cart (Client side usually does this, but we can do it if cart is in DB)
    // For local storage cart, client must clear it.

    return { orderId: order.id }
}
