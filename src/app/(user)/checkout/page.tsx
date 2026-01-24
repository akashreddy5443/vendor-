'use client'

import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { placeOrder } from './actions'
import { useEffect, useState } from 'react'

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Redirect if cart empty? Or show message.

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        // Append cart items and total to formdata before submitting
        formData.append('cartItems', JSON.stringify(items))
        formData.append('total', cartTotal.toString())

        await placeOrder(formData)
        // Note: If redirect happens on server, we won't reach here. 
        // But if we want to clear cart on client, we strictly should wait or use effect on success page.
        // For simplicity, we'll let the server redirect, and the success page will expect cart to be cleared
        // OR we can clear it here if we use a client-side fetch wrapper.
        // Let's implement clearing in the success page for now or simply rely on "Ordering" state.
    }

    if (items.length === 0) {
        return <div className="p-10 text-center text-white">Your cart is empty.</div>
    }

    return (
        <div className="bg-black text-white min-h-screen py-16">
            <div className="mx-auto max-w-4xl px-6">
                <h1 className="text-3xl font-bold font-serif mb-8">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Form */}
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold border-b border-gray-800 pb-2">Shipping Details</h2>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <input name="name" required className="w-full bg-gray-900 border border-gray-800 rounded p-2 focus:border-orange-500 outline-none" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <input name="email" type="email" required className="w-full bg-gray-900 border border-gray-800 rounded p-2 focus:border-orange-500 outline-none" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Address</label>
                                <input name="address" required className="w-full bg-gray-900 border border-gray-800 rounded p-2 focus:border-orange-500 outline-none" placeholder="123 Street Name" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">City</label>
                                    <input name="city" required className="w-full bg-gray-900 border border-gray-800 rounded p-2 focus:border-orange-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Zip Code</label>
                                    <input name="zip" required className="w-full bg-gray-900 border border-gray-800 rounded p-2 focus:border-orange-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-full bg-orange-600 py-4 font-bold text-white transition-all hover:bg-orange-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Processing...' : `Pay ${formatPrice(cartTotal)}`}
                        </button>
                    </form>

                    {/* Summary */}
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 h-fit">
                        <h3 className="font-bold mb-4">Your Order</h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                            {items.map(item => (
                                <div key={item.productId} className="flex justify-between text-sm">
                                    <span className="text-gray-300">{item.title} x {item.quantity}</span>
                                    <span className="text-white font-medium">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-800 pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-orange-500">{formatPrice(cartTotal)}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
