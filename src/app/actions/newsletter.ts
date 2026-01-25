'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD?.replace(/"/g, '').replace(/\s/g, '') // Remove quotes and spaces
    }
})

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email is required' }
    }

    const supabase = await createClient()

    // 1. Check duplicate locally
    const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', email)
        .single()

    if (existing) {
        return { message: 'Already subscribed!' }
    }

    // 2. Insert into DB
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

    // 3. Send Email (Gmail)
    try {
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            await transporter.sendMail({
                from: '"TechDev Store" <' + process.env.GMAIL_USER + '>',
                to: email,
                subject: 'Welcome to TechDev Store! 🚀',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #ff4500;">Welcome to the Clan!</h1>
                        <p>Hey there,</p>
                        <p>Thanks for subscribing to the <strong>TechDev Store</strong> newsletter.</p>
                        <p>You're now on the list for exclusive drops, dev gear discounts, and setup inspiration.</p>
                        <br/>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost') ? 'http://localhost:3000' : 'https://vendortech17.vercel.app'}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Store</a>
                        <br/><br/>
                        <p>Happy Coding,<br/>The TechDev Team</p>
                    </div>
                `
            })
            console.log(`Welcome email sent to ${email} via Gmail`)
        } else {
            console.log(`[DEV] Email would be sent to ${email} (Missing Gmail Creds)`)
        }
    } catch (err) {
        console.error('GMAIL ERROR:', err)
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
