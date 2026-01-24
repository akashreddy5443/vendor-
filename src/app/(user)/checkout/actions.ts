'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function placeOrder(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name')
    const email = formData.get('email')
    const address = formData.get('address')
    const city = formData.get('city')
    const zip = formData.get('zip')
    const country = formData.get('country')
    const cartItemsString = formData.get('cartItems') as string
    const totalAmount = parseFloat(formData.get('total') as string)

    if (!cartItemsString) {
        return { error: 'Cart is empty' }
    }

    const cartItems = JSON.parse(cartItemsString)

    // Construct Shipping Address JSON
    const shipping_address = {
        name,
        address,
        city,
        zip,
        country
    }

    // Get User (Optional, can be guest)
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user?.id || null, // Allow null for guest checkout if policy permits
            email: email,
            status: 'pending',
            total_amount: totalAmount,
            shipping_address: shipping_address
        })
        .select()
        .single()

    if (orderError) {
        console.error('Order creation failed:', orderError)
        return { error: 'Failed to place order' }
    }

    // 2. Create Order Items
    const orderItemsData = cartItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData)

    if (itemsError) {
        console.error('Order items failed:', itemsError)
        // Ideally rollback order here, keeping simple for now
        return { error: 'Failed to save order items' }
    }

    // Success - Redirect
    redirect(`/order-confirmation/${order.id}`)
}
