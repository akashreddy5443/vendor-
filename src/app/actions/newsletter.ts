'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email is required' }
    }

    const supabase = await createClient()

    // Check if already subscribed
    // Note: We skip this SELECT if we trust the UNIQUE constraint, but for user feedback it's nice.
    // However, RLS might block SELECT if we didn't fix it fully for anon. 
    // Let's rely on the INSERT error or our fixed RLS. our fixed RLS allows SELECT for all, so this works.
    const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', email)
        .single()

    if (existing) {
        return { message: 'Already subscribed!' }
    }

    const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email })

    if (error) {
        if (error.code === '23505') {
            return { message: 'Already subscribed!' }
        }
        console.error('Newsletter error:', error)
        return { error: 'Failed to subscribe. Please try again.' }
    }

    // Send Welcome Email
    try {
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'TechDev Store <onboarding@resend.dev>', // Default testing domain
                to: email,
                subject: 'Welcome to TechDev Store! 🚀',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #ff4500;">Welcome to the Clan!</h1>
                        <p>Hey there,</p>
                        <p>Thanks for subscribing to the <strong>TechDev Store</strong> newsletter.</p>
                        <p>You're now on the list for exclusive drops, dev gear discounts, and setup inspiration.</p>
                        <br/>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Store</a>
                        <br/><br/>
                        <p>Happy Coding,<br/>The TechDev Team</p>
                    </div>
                `
            })
            console.log(`Welcome email sent to ${email}`)
        } else {
            console.log(`[DEV] Email would be sent to ${email} (Missing RESEND_API_KEY)`)
        }
    } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        // Don't fail the subscription just because email failed
    }

    revalidatePath('/admin/subscribers')

    return { success: true, message: 'Successfully subscribed! Check your inbox.' }
}

export async function deleteSubscriber(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: 'Failed to delete subscriber' }
    }

    revalidatePath('/admin/subscribers')
    return { success: true }
}
