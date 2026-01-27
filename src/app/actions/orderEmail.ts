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

export async function sendOrderEmail(orderId: string, type: 'confirmation' | 'shipped' | 'delivered' | 'cancelled' = 'confirmation') {
    const supabase = await createClient()

    // 1. Fetch Full Order Details with Items
    const { data: order, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                quantity,
                price,
                product:products(
                    title,
                    product_images(cloudinary_url, is_primary)
                )
            ),
            user:users(email, full_name)
        `)
        .eq('id', orderId)
        .single()

    if (error || !order) {
        console.error('Failed to fetch order for email:', error)
        return
    }

    const email = order.user?.email
    if (!email) return

    // 2. Determine Template Key
    const templateKeyMap = {
        'confirmation': 'order_confirmation',
        'shipped': 'order_shipped',
        'delivered': 'order_delivered',
        'cancelled': 'order_cancelled'
    }
    const templateKey = templateKeyMap[type]

    // 3. Fetch Template
    const { data: template } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('template_key', templateKey)
        .single()

    // 4. Construct Content
    let subject = ''
    let htmlContent = ''

    if (template) {
        subject = template.subject
            .replace('{{order_id}}', order.id.slice(0, 8).toUpperCase())

        let body = template.body_content
            .replace('{{user_name}}', order.user.full_name || 'Customer')
            .replace('{{order_id}}', order.id.slice(0, 8).toUpperCase())
            .replace('{{site_url}}', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')

        // Enhanced item list with images
        if (body.includes('{{order_details}}')) {
            const itemsHtml = `
                <div style="margin-top: 20px;">
                    ${order.items.map((item: any) => {
                // Find primary image or first image
                const img = item.product?.product_images?.find((i: any) => i.is_primary) || item.product?.product_images?.[0]
                const imgUrl = img?.cloudinary_url || 'https://via.placeholder.com/60?text=IMG'

                return `
                        <div style="display: flex; gap: 15px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                            <img src="${imgUrl}" alt="${item.product?.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
                            <div>
                                <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #333;">${item.product?.title}</h4>
                                <p style="margin: 0; font-size: 13px; color: #666;">
                                    Qty: ${item.quantity} | Price: ${formatPrice(item.price)}
                                </p>
                            </div>
                        </div>
                        `
            }).join('')}
                    <div style="text-align: right; margin-top: 10px;">
                        <p style="font-size: 16px; font-weight: bold; margin: 0;">Total: ${formatPrice(order.total_amount)}</p>
                    </div>
                </div>
            `
            body = body.replace('{{order_details}}', itemsHtml)
        }

        htmlContent = body
    } else {
        // Fallback hardcoded emails if template missing (Safety)
        subject = `Order Update: #${order.id.slice(0, 8).toUpperCase()}`
        if (type === 'cancelled') {
            subject = `Order Cancelled: #${order.id.slice(0, 8).toUpperCase()}`
            htmlContent = `<p>Your order #${order.id.slice(0, 8).toUpperCase()} has been cancelled.</p>`
        } else {
            // ... existing confirmation fallback ...
            htmlContent = `<p>Order update: ${type}</p>`
        }
    }

    // 5. Send
    try {
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            await transporter.sendMail({
                from: '"TechDev Store" <' + process.env.GMAIL_USER + '>',
                to: email,
                subject: subject,
                html: htmlContent
            })
            console.log(`[${type}] Email sent to ${email}`)
        } else {
            console.warn('Skipped email: Missing GMAIL credentials')
        }
    } catch (err) {
        console.error('Failed to send order email:', err)
    }
}

// Backwards compatibility alias
export async function sendOrderConfirmationEmail(id: string) {
    return sendOrderEmail(id, 'confirmation')
}
