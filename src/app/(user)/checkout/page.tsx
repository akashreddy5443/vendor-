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
        <div className="min-h-screen bg-[#f8f9fa] text-[#191970] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left Column: Details */}
                <div className="space-y-8">
                    {/* Address Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-wide">
                                <MapPin className="text-[#191970]" /> Shipping Address
                            </h2>
                            <Link href="/user/addresses" className="text-sm text-[#191970]/60 hover:text-[#191970] font-bold">Manage Addresses</Link>
                        </div>

                        {addresses.length === 0 ? (
                            <Link href="/user/addresses" className="block p-6 rounded-sm border-2 border-dashed border-[#191970]/20 hover:bg-[#191970]/5 text-center transition-colors">
                                <span className="text-[#191970] font-bold">+ Add New Address</span>
                            </Link>
                        ) : (
                            <div className="grid gap-4">
                                {addresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        onClick={() => setSelectedAddress(addr.id)}
                                        className={`p-4 rounded-sm border cursor-pointer transition-all ${selectedAddress === addr.id
                                            ? 'border-[#191970] bg-[#191970]/5 ring-1 ring-[#191970]'
                                            : 'border-gray-200 bg-white hover:border-[#191970]/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-[#191970]">{addr.full_name}</span>
                                            {selectedAddress === addr.id && <CheckCircle className="h-5 w-5 text-[#191970]" />}
                                        </div>
                                        <p className="text-sm text-[#191970]/70 mt-1 font-medium">{addr.street_address}, {addr.city}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 uppercase tracking-wide">
                            <CreditCard className="text-[#191970]" /> Payment Method
                        </h2>
                        <div className="p-4 rounded-sm border border-[#191970]/10 bg-white shadow-sm">
                            <div className="flex items-center gap-3">
                                <input type="radio" checked readOnly className="h-4 w-4 text-[#191970] focus:ring-[#191970]" />
                                <span className="font-bold text-[#191970]">Cash on Delivery / Pay on Arrival</span>
                            </div>
                            <p className="text-xs text-[#191970]/60 ml-7 mt-1 font-medium">Pay comfortably when your order arrives.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary */}
                <div className="lg:pl-12">
                    <div className="rounded-sm border border-[#191970]/10 bg-white p-6 lg:p-8 sticky top-24 shadow-xl">
                        <h2 className="text-xl font-extrabold mb-6 uppercase tracking-tight border-b-2 border-[#191970] pb-2 text-[#191970]">Order Summary</h2>

                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.productId} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 p-2 rounded transition-colors">
                                    <div className="h-16 w-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img src={item.image} alt={item.title} className="h-full w-full object-contain p-2" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-[#191970] line-clamp-1">{item.title}</h3>
                                        <p className="text-xs text-[#191970]/60 font-medium mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-bold text-[#191970]">{formatPrice(item.price * item.quantity)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mb-6">
                            {/* Coupon Input */}
                            <div className="flex gap-2">
                                <input
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="COUPON CODE"
                                    className="flex-1 rounded-sm border border-[#191970]/20 bg-gray-50 p-2 text-sm text-[#191970] placeholder-[#191970]/30 focus:border-[#191970] focus:outline-none uppercase font-bold tracking-wide"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={validatingCoupon || !couponCode || !!appliedCoupon}
                                    className="rounded-sm bg-[#191970] px-4 text-xs font-bold text-white hover:bg-[#131355] disabled:opacity-50 disabled:cursor-not-allowed transition-colors tracking-wide"
                                >
                                    {validatingCoupon ? <Loader2 className="h-3 w-3 animate-spin" /> : 'APPLY'}
                                </button>
                            </div>
                            {couponError && <p className="text-xs text-red-500 font-bold flex items-center gap-1"><span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span> {couponError}</p>}
                            {appliedCoupon && (
                                <div className="flex justify-between items-center text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200 font-bold">
                                    <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Coupon <strong>{appliedCoupon.code}</strong> applied!</span>
                                    <button onClick={() => { setAppliedCoupon(null); setCouponCode('') }} className="hover:text-green-900"><Trash2 className="h-3 w-3" /></button>
                                </div>
                            )}

                            <div className="flex justify-between text-[#191970]/70 text-sm font-medium pt-4 border-t border-gray-100">
                                <span>Subtotal</span>
                                <span className="font-bold text-[#191970]">{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between text-[#191970]/70 text-sm font-medium">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold">Free</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600 text-sm font-bold animate-pulse">
                                    <span>Discount</span>
                                    <span>- {formatPrice(appliedCoupon.discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-extrabold text-[#191970] pt-4 border-t-2 border-[#191970]">
                                <span>Total</span>
                                <span>{formatPrice(finalTotal)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={submitting || !selectedAddress}
                            className="w-full mt-8 rounded-sm bg-[#191970] py-4 font-bold text-lg text-white shadow-lg shadow-[#191970]/20 hover:bg-[#131355] hover:shadow-[#191970]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wider block"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" /> Processing...
                                </span>
                            ) : (
                                `Pay ${formatPrice(finalTotal)}`
                            )}
                        </button>

                        <p className="text-[10px] text-center text-[#191970]/40 mt-4 font-bold uppercase tracking-widest">
                            Secure Checkout • Terms Apply
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
