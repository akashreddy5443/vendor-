'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle, MapPin, CreditCard, Trash2 } from 'lucide-react'
import { createOrder, validateCoupon } from './actions'

export default function CheckoutPage() {
    const { items: cart, cartTotal: total, clearCart } = useCart()
    const [addresses, setAddresses] = useState<any[]>([])
    const [selectedAddress, setSelectedAddress] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Coupon State
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<{ id: string, code: string, discountAmount: number } | null>(null)
    const [couponError, setCouponError] = useState('')
    const [validatingCoupon, setValidatingCoupon] = useState(false)

    const router = useRouter()

    async function handleApplyCoupon() {
        if (!couponCode.trim()) return
        setValidatingCoupon(true)
        setCouponError('')

        const res = await validateCoupon(couponCode, total)
        setValidatingCoupon(false)

        if (res.error) {
            setCouponError(res.error)
            setAppliedCoupon(null)
        } else if (res.coupon) {
            setAppliedCoupon(res.coupon)
            setCouponError('')
        }
    }

    const finalTotal = total - (appliedCoupon?.discountAmount || 0)

    useEffect(() => {
        const fetchAddresses = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login?message=Please login to checkout')
                return
            }

            const { data } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', user.id)

            if (data) {
                setAddresses(data)
                // Select default or first
                const def = data.find(a => a.is_default)
                if (def) setSelectedAddress(def.id)
                else if (data.length > 0) setSelectedAddress(data[0].id)
            }
            setLoading(false)
        }
        fetchAddresses()
    }, [router])

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert('Please select a shipping address')
            return
        }
        setSubmitting(true)

        // Simulate Payment Delay
        await new Promise(r => setTimeout(r, 1500))

        const res = await createOrder({
            addressId: selectedAddress,
            paymentMethod: 'cod', // Placeholder
            total: finalTotal,
            items: cart,
            couponId: appliedCoupon?.id,
            discountAmount: appliedCoupon?.discountAmount
        })

        if (res?.error) {
            alert(res.error)
            setSubmitting(false)
            return
        }

        clearCart()
        router.push(`/checkout/success?orderId=${res.orderId}`)
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white"><Loader2 className="animate-spin" /></div>

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white space-y-4">
                <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
                <Link href="/products" className="text-blue-500 hover:underline">Continue Shopping</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left Column: Details */}
                <div className="space-y-8">
                    {/* Address Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                                <MapPin className="text-blue-500" /> Shipping Address
                            </h2>
                            <Link href="/user/addresses" className="text-sm text-gray-400 hover:text-white">Manage Addresses</Link>
                        </div>

                        {addresses.length === 0 ? (
                            <Link href="/user/addresses" className="block p-6 rounded-xl border border-dashed border-zinc-700 hover:bg-zinc-900 text-center">
                                <span className="text-blue-500">+ Add New Address</span>
                            </Link>
                        ) : (
                            <div className="grid gap-4">
                                {addresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        onClick={() => setSelectedAddress(addr.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAddress === addr.id
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold">{addr.full_name}</span>
                                            {selectedAddress === addr.id && <CheckCircle className="h-5 w-5 text-blue-500" />}
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">{addr.street_address}, {addr.city}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h2 className="text-xl font-bold font-serif flex items-center gap-2 mb-4">
                            <CreditCard className="text-blue-500" /> Payment Method
                        </h2>
                        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900">
                            <div className="flex items-center gap-3">
                                <input type="radio" checked readOnly className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                                <span className="font-medium">Cash on Delivery / Pay on Arrival</span>
                            </div>
                            <p className="text-xs text-gray-500 ml-7 mt-1">Pay comfortably when your order arrives.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary */}
                <div className="lg:pl-12">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 lg:p-8 sticky top-24">
                        <h2 className="text-xl font-bold font-serif mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.productId} className="flex gap-4">
                                    <div className="h-16 w-16 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium line-clamp-1">{item.title}</h3>
                                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mb-6">
                            {/* Coupon Input */}
                            <div className="flex gap-2">
                                <input
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Coupon Code"
                                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-sm text-white focus:border-blue-500 focus:outline-none uppercase"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={validatingCoupon || !couponCode || !!appliedCoupon}
                                    className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 text-xs font-bold text-gray-300 hover:text-white hover:bg-zinc-700 disabled:opacity-50"
                                >
                                    {validatingCoupon ? <Loader2 className="h-3 w-3 animate-spin" /> : 'APPLY'}
                                </button>
                            </div>
                            {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                            {appliedCoupon && (
                                <div className="flex justify-between items-center text-xs text-green-500 bg-green-500/10 p-2 rounded border border-green-500/20">
                                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied!</span>
                                    <button onClick={() => { setAppliedCoupon(null); setCouponCode('') }} className="hover:text-green-400"><Trash2 className="h-3 w-3" /></button>
                                </div>
                            )}

                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Shipping</span>
                                <span className="text-green-500">Free</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-500 text-sm">
                                    <span>Discount</span>
                                    <span>- {formatPrice(appliedCoupon.discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-zinc-800 mt-2">
                                <span>Total</span>
                                <span className="text-blue-500">{formatPrice(finalTotal)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={submitting || !selectedAddress}
                            className="w-full mt-8 rounded-full bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500 hover:shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" /> Processing...
                                </span>
                            ) : (
                                `Pay ${formatPrice(finalTotal)}`
                            )}
                        </button>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            By placing your order, you agree to our Terms of Service.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
