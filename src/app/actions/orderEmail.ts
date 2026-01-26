'use server'

import { createClient } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'
import { formatPrice } from '@/lib/utils'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD?.replace(/"/g, '').replace(/\s/g, '')
    }
})

export async function sendOrderConfirmationEmail(orderId: string) {
    const supabase = await createClient()

    // 1. Fetch Full Order Details with Items
    const { data: order, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                quantity,
                price,
                product:products(title)
            ),
            user:users(email)
        `)
        .eq('id', orderId)
        .single()

    if (error || !order) {
        console.error('Failed to fetch order for email:', error)
        return
    }

    const email = order.user?.email
    if (!email) return

    // 2. Fetch Template (Optional)
    const { data: template } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('template_key', 'order_confirmation')
        .single()

    // 3. Construct Email
    let subject = `Order Confirmed! #${order.id.slice(0, 8).toUpperCase()}`

    // Default HTML if template missing
    let htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #0B1026;">Order Confirmed! 🎉</h1>
            <p>Hi there,</p>
            <p>Thank you for your purchase! Your order <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> has been received and is being processed.</p>
            
            <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Order Summary</h3>
                <ul style="padding-left: 20px;">
                    ${order.items.map((item: any) => `
                        <li style="margin-bottom: 10px;">
                            <strong>${item.product?.title || 'Unknown Product'}</strong> (x${item.quantity}) - ${formatPrice(item.price)}
                        </li>
                    `).join('')}
                </ul>
                <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;">
                <p style="font-weight: bold; font-size: 1.1em; text-align: right;">Total: ${formatPrice(order.total_amount)}</p>
                ${order.payment_method === 'cod' ? '<p style="font-size: 0.9em; color: #666;">Payment Method: Cash on Delivery</p>' : ''}
            </div>

            <p>We'll notify you once your package ships!</p>
            <br/>
            <p>Best,<br/>TechDev Store Team</p>
        </div>
    `

    if (template) {
        subject = template.subject.replace('{{order_id}}', order.id.slice(0, 8).toUpperCase())
        // Advanced template replacement would go here (using Handlebars or simple replace)
        // For now, sticking to the robust default if template requires complex JSON parsing
        // But if template is simple HTML:
        // htmlContent = template.body_content ... 
        // Let's stick to the generated HTML above for guaranteed correctness with dynamic items list.
    }

    // 4. Send
    try {
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            await transporter.sendMail({
                from: '"TechDev Store" <' + process.env.GMAIL_USER + '>',
                to: email,
                subject: subject,
                html: htmlContent
            })
            console.log(`Order confirmation sent to ${email}`)
        } else {
            console.warn('Skipped email: Missing GMAIL credentials')
        }
    } catch (err) {
        console.error('Failed to send order email:', err)
    }
}
