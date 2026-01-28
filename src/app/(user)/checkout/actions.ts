'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function validateCoupon(code: string, cartTotal: number) {
    const supabase = await createClient()

    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single()

    if (error || !coupon) {
        return { error: 'Invalid or expired coupon code' }
    }

    // Check dates
    const now = new Date()
    // No start_date in schema currently, removing or ignoring.
    // if (coupon.start_date && new Date(coupon.start_date) > now) { ... }

    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        return { error: 'Coupon has expired' }
    }

    // Check usage limits (Not in schema yet, ignoring)
    // if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) { ... }

    // Check min order amount
    if (coupon.min_order_value && coupon.min_order_value > cartTotal) {
        return { error: `Minimum order amount of ₹${coupon.min_order_value} required` }
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discount_type === 'percentage') {
        discountAmount = (cartTotal * coupon.discount_value) / 100
        if (coupon.max_discount_amount) {
            discountAmount = Math.min(discountAmount, coupon.max_discount_amount)
        }
    } else {
        discountAmount = coupon.discount_value
    }

    // Ensure discount doesn't exceed total (mostly relevant for fixed amount)
    discountAmount = Math.min(discountAmount, cartTotal)

    return {
        success: true,
        coupon: {
            id: coupon.id,
            code: coupon.code,
            discountAmount: discountAmount
        }
    }
}

export async function createOrder({
    addressId,
    paymentMethod,
    total,
    items,
    couponId,
    discountAmount
}: {
    addressId: string,
    paymentMethod: string,
    total: number,
    items: any[],
    couponId?: string,
    discountAmount?: number
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // 1. Fetch Address Snapshot
    const { data: addressData } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', addressId)
        .single()

    if (!addressData) return { error: 'Invalid shipping address' }

    // Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total_amount: total, // Logic: This should match the final total after discount
            status: 'pending',
            shipping_address: addressData, // Store full snapshot
            payment_method: paymentMethod,
            coupon_id: couponId,
            discount_amount: discountAmount || 0
        })
        .select()
        .single()

    if (orderError) {
        console.error("Order creation failed:", orderError)
        return { error: `Order Failed: ${orderError.message}` }
    }

    // 2. Insert Order Items & Decrease Stock
    // Note: ideally this should be a transaction or RPC, but for now doing it in loop or batch
    const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        console.error("Order items insertion failed:", itemsError)
        // Optionally revert order here (delete order)
        return { error: "Failed to add items to order" }
    }

    // 3. Decrease Stock
    for (const item of items) {
        // Fetch current stock first or use an atomic rpc if available. 
        // Simple update for now:
        const { error: stockError } = await supabase.rpc('decrement_stock', {
            product_id: item.productId,
            quantity: item.quantity
        })

        if (stockError) {
            // Fallback if RPC doesn't exist (creating it next) or fails
            console.error(`Failed to decrement stock for ${item.productId}`, stockError)
        }
    }

    // 2. Clear Cart (Client side usually does this)

    // 3. Send Confirmation Email (Async - don't block response)
    // We import this dynamically or call it safely
    try {
        const { sendOrderConfirmationEmail } = await import('@/app/actions/orderEmail')
        // Fire and forget (or await if critical)
        sendOrderConfirmationEmail(order.id)
    } catch (e) {
        console.error("Email trigger failed", e)
    }

    return { orderId: order.id }
}
