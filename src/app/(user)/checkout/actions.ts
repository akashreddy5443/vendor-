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
    if (coupon.start_date && new Date(coupon.start_date) > now) {
        return { error: 'Coupon is not active yet' }
    }
    if (coupon.end_date && new Date(coupon.end_date) < now) {
        return { error: 'Coupon has expired' }
    }

    // Check usage limits
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        return { error: 'Coupon usage limit reached' }
    }

    // Check min order amount
    if (coupon.min_order_amount > cartTotal) {
        return { error: `Minimum order amount of ₹${coupon.min_order_amount} required` }
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

    // Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total_amount: total, // Logic: This should match the final total after discount
            status: 'pending',
            shipping_address: addressId, // Using JSONB or ID depending on your schema. Assuming ID based on conversation.
            payment_method: paymentMethod,
            coupon_id: couponId,
            discount_amount: discountAmount || 0
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
