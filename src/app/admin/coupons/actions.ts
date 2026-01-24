'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCoupon(formData: FormData) {
    const supabase = await createClient()

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Role check (optional but good)
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { error: 'Unauthorized' }

    const code = (formData.get('code') as string).toUpperCase()
    const discountType = formData.get('discountType') as string
    const discountValue = parseFloat(formData.get('discountValue') as string)
    const minOrder = parseFloat(formData.get('minOrder') as string || '0')
    const endDate = formData.get('endDate') as string

    if (!code || !discountValue) return { error: 'Missing required fields' }

    const { error } = await supabase.from('coupons').insert({
        code,
        discount_type: discountType,
        discount_value: discountValue,
        min_order_amount: minOrder,
        end_date: endDate || null,
        is_active: true
    })

    if (error) return { error: error.message }

    revalidatePath('/admin/coupons')
    return { success: true }
}

export async function deleteCoupon(couponId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('coupons').delete().eq('id', couponId)
    if (error) return { error: error.message }
    revalidatePath('/admin/coupons')
    return { success: true }
}
