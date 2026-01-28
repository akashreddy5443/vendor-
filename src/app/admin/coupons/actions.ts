'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCoupon(formData: FormData) {
    const supabase = await createClient()

    const rawFormData = {
        code: (formData.get('code') as string).trim().toUpperCase(),
        discount_type: formData.get('discount_type') as string,
        discount_value: parseFloat(formData.get('discount_value') as string),
        min_order_value: parseFloat(formData.get('min_order_value') as string) || 0,
        expires_at: formData.get('expires_at') as string || null,
        is_active: formData.get('is_active') === 'on'
    }

    const { error } = await supabase
        .from('coupons')
        .insert([rawFormData])

    if (error) {
        console.error('Error creating coupon:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/coupons')
    return { success: true }
}

export async function deleteCoupon(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/coupons')
    return { success: true }
}

export async function toggleCouponStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', id)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/coupons')
    return { success: true }
}
