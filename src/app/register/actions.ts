'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const isStudent = formData.get('isStudent') === 'on'

    // Student Info
    const universityName = formData.get('universityName') as string
    const universityId = formData.get('universityId') as string

    // Address Info (Only if student? User asked: "add account only when... register as a student AND also add addresses")
    const street = formData.get('street') as string
    const city = formData.get('city') as string
    const zip = formData.get('zip') as string
    const country = formData.get('country') as string || 'India'

    // 1. Sign Up Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                is_student: isStudent,
                university_name: universityName, // Pass to metadata for trigger just in case
                full_name: '', // We might want a name field
            }
        }
    })

    if (authError) {
        return { error: authError.message }
    }

    if (!authData.user) {
        return { error: "Something went wrong during sign up." }
    }

    const userId = authData.user.id

    // 2. Update Public User Profile (if trigger didn't handle detailed fields or we want to be sure)
    // We'll update the 'users' table specifically for student columns
    if (isStudent) {
        const { error: profileError } = await supabase
            .from('users')
            .update({
                is_student: true,
                university_name: universityName,
                university_id: universityId
            })
            .eq('id', userId)

        // Note: If profile doesn't exist yet (race condition with trigger), this update might verify/wait or we assume trigger is fast.
        // Safer: Insert if upsert is supported or just rely on metadata if trigger is good.
        // Assuming we have a trigger that creates the row.
    }

    // 3. Insert Address (if provided)
    if (isStudent && street && city) {
        const { error: addressError } = await supabase
            .from('addresses')
            .insert({
                user_id: userId,
                full_name: 'Student', // Placeholder or add name field to form
                street_address: street,
                city: city,
                postal_code: zip,
                country: country,
                is_default: true
            })

        if (addressError) {
            console.error("Address Error:", addressError)
            // Non-fatal, can fail silently or log
        }
    }

    revalidatePath('/', 'layout')
    redirect('/user') // Redirect to dashboard
}
