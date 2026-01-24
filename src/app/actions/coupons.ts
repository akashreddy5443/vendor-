'use server'

import { createClient } from '@/lib/supabase/server'

export async function validateCoupon(code: string, orderTotal: number) {
    const supabase = await createClient()
    const normalizedCode = code.toUpperCase()

    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', normalizedCode)
        .eq('is_active', true)
        .single()

    if (error || !coupon) {
        return { error: 'Invalid or expired coupon code' }
    }

    // Check dates
    const now = new Date()
    if (coupon.start_date && new Date(coupon.start_date) > now) return { error: 'Coupon is not active yet' }
    if (coupon.end_date && new Date(coupon.end_date) < now) return { error: 'Coupon has expired' }

    // Check usage limits
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) return { error: 'Coupon usage limit reached' }

    // Check minimum order
    if (coupon.min_order_amount && orderTotal < coupon.min_order_amount) {
        return { error: `Minimum order amount of ₹${coupon.min_order_amount} required` }
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discount_type === 'fixed') {
        discountAmount = coupon.discount_value
    } else {
        discountAmount = (orderTotal * coupon.discount_value) / 100
        if (coupon.max_discount_amount) {
            discountAmount = Math.min(discountAmount, coupon.max_discount_amount)
        }
    }

    return {
        success: true,
        coupon: {
            id: coupon.id,
            code: coupon.code,
            discountAmount: discountAmount
        }
    }
}
