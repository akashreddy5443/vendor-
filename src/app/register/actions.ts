'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    // 1. Sign Up Auth User (Standard)
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vencortech17.vercel.app'}/auth/callback`,
        }
    })

    if (authError) {
        return { error: authError.message }
    }

    if (!authData.user) {
        return { error: "Something went wrong during sign up." }
    }

    // Note: We are no longer capturing extra student/address info during registration.
    // The user can add addresses later from their dashboard.

    revalidatePath('/', 'layout')
    redirect('/user') // Redirect to dashboard
}
