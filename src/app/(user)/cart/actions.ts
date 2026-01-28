'use server'

import { createClient } from '@/lib/supabase/server'

export async function validateCoupon(code: string, cartTotal: number) {
    const supabase = await createClient()

    // 1. Fetch coupon
    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single()

    if (error || !coupon) {
        return { success: false, message: 'Invalid or inactive coupon code.' }
    }

    // 2. Check Expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { success: false, message: 'This coupon has expired.' }
    }

    // 3. Check Min Order Value
    // Note: cartTotal passed here should probably be the subtotal.
    if (coupon.min_order_value && cartTotal < coupon.min_order_value) {
        return { success: false, message: `Minimum order of ₹${coupon.min_order_value} required.` }
    }

    // 4. Return Discount Info
    return {
        success: true,
        message: 'Coupon applied successfully!',
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        code: coupon.code
    }
}
