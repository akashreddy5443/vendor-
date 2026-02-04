'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle, MapPin, CreditCard, Trash2 } from 'lucide-react'
import { createOrder, validateCoupon } from './actions'

import { AvailableCoupons } from '@/components/shop/AvailableCoupons'
import { useSearchParams } from 'next/navigation'

export default function CheckoutPage() {
    const { items: cartItems, cartTotal: normalTotal, subtotal: normalSubtotal, taxTotal: normalTax, clearCart, gstRate, taxLabel, buyNowItems } = useCart()
    const searchParams = useSearchParams()
    const isBuyNow = searchParams.get('source') === 'buy_now'

    // Determine which items to show
    const cart = isBuyNow ? buyNowItems : cartItems

    // Recalculate totals if in Buy Now mode (since context totals are for the main cart)
    const calculateTotals = (items: any[]) => {
        const sub = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const tax = items.reduce((sum, item) => {
            // STRICT MATCH with CartContext: Ignore item.gstPercentage, use global gstRate only
            const taxRate = gstRate || 5
            return sum + ((item.price * item.quantity * taxRate) / 100)
        }, 0)
        return { subtotal: sub, taxTotal: tax, total: sub + tax }
    }

    const { subtotal, taxTotal, total } = isBuyNow ? calculateTotals(buyNowItems) : { subtotal: normalSubtotal, taxTotal: normalTax, total: normalTotal }

    const [addresses, setAddresses] = useState<any[]>([])
    const [selectedAddress, setSelectedAddress] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Coupon State
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<{ id: string, code: string, discountAmount: number, discountType?: string, discountValue?: number } | null>(null)
    const [couponError, setCouponError] = useState('')
    const [validatingCoupon, setValidatingCoupon] = useState(false)
    const [showTaxDetails, setShowTaxDetails] = useState(false)

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
            setCouponCode('') // Optional: clear code input on success? or keep it
            setCouponError('')
        }
    }
    // ... (rest of file)

    {
        appliedCoupon && (
            <div className="flex justify-between text-green-600 text-sm font-bold animate-pulse">
                <span>
                    Discount
                    {appliedCoupon.discountType === 'percent' && (
                        <span className="ml-1 text-xs bg-green-100 px-1 rounded">
                            {appliedCoupon.discountValue}%
                        </span>
                    )}
                </span>
                <span>- {formatPrice(appliedCoupon.discountAmount)}</span>
            </div>
        )
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
        <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left Column: Details */}
                <div className="space-y-8">
                    {/* Address Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-wide text-slate-900">
                                <MapPin className="text-primary" /> Shipping Address
                            </h2>
                            <Link href="/user/addresses" className="text-sm text-[#191970]/60 hover:text-[#191970] font-bold">Manage Addresses</Link>
                        </div>

                        {addresses.length === 0 ? (
                            <Link href="/user/addresses" className="block p-6 rounded-sm border-2 border-dashed border-slate-200 hover:bg-slate-50 text-center transition-colors">
                                <span className="text-primary font-bold">+ Add New Address</span>
                            </Link>
                        ) : (
                            <div className="grid gap-4">
                                {addresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        onClick={() => setSelectedAddress(addr.id)}
                                        className={`p-4 rounded-sm border cursor-pointer transition-all ${selectedAddress === addr.id
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-slate-200 bg-white hover:border-primary/50'
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
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 uppercase tracking-wide text-slate-900">
                            <CreditCard className="text-primary" /> Payment Method
                        </h2>
                        <div className="p-4 rounded-sm border border-[#191970]/10 bg-white shadow-sm">
                            <div className="flex items-center gap-3">
                                <input type="radio" checked readOnly className="h-4 w-4 text-primary focus:ring-primary" />
                                <span className="font-bold text-slate-900">Cash on Delivery / Pay on Arrival</span>
                            </div>
                            <p className="text-xs text-[#191970]/60 ml-7 mt-1 font-medium">Pay comfortably when your order arrives.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary */}
                <div className="lg:pl-12">
                    <div className="rounded-sm border border-slate-200 bg-white p-6 lg:p-8 sticky top-24 shadow-xl">
                        <h2 className="text-xl font-extrabold mb-6 uppercase tracking-tight border-b-2 border-slate-900 pb-2 text-slate-900">Order Summary</h2>

                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.productId} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 p-2 rounded transition-colors">
                                    <div className="h-16 w-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img src={item.image} alt={item.title} className="h-full w-full object-contain p-2" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Qty: {item.quantity}</p>
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
                                    className="flex-1 rounded-sm border border-slate-200 bg-gray-50 p-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none uppercase font-bold tracking-wide"
                                />
                                <button
                                    id="apply-coupon-btn"
                                    onClick={handleApplyCoupon}
                                    disabled={validatingCoupon || !couponCode || !!appliedCoupon}
                                    className="rounded-sm bg-slate-900 px-4 text-xs font-bold text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors tracking-wide"
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

                            {/* Available Public Coupons */}
                            <div className="pt-2">
                                <AvailableCoupons onApply={(code) => {
                                    setCouponCode(code)
                                    // Hack to trigger useEffect or just call function after state update? 
                                    // Better to just call validate directly or wrapped
                                    // But handleApplyCoupon depends on state couponCode. 
                                    // So we set state, wait a tick, or just refactor.
                                    // Let's refactor handleApplyCoupon to accept optional code.
                                    setTimeout(() => document.getElementById('apply-coupon-btn')?.click(), 100)
                                }} />
                            </div>

                            <div className="flex justify-between text-slate-500 text-sm font-medium pt-4 border-t border-gray-100">
                                <span>Subtotal (Base Price)</span>
                                <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                            </div>

                            {/* Tax Breakdown */}
                            <div className="py-2">
                                <div
                                    className="flex justify-between text-slate-500 text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => setShowTaxDetails(!showTaxDetails)}
                                >
                                    <span className="flex items-center gap-1">
                                        {taxLabel} ({gstRate > 0 ? `${gstRate}%` : '5%'})
                                        <div className="text-[10px] bg-slate-100 px-1 rounded border border-slate-200">?</div>
                                    </span>
                                    <span className="font-bold text-slate-900">{formatPrice(taxTotal)}</span>
                                </div>
                                {showTaxDetails && (
                                    <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 space-y-1">
                                        <div className="flex justify-between">
                                            <span>CGST ({(gstRate || 5) / 2}%)</span>
                                            <span>{formatPrice(taxTotal / 2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>SGST ({(gstRate || 5) / 2}%)</span>
                                            <span>{formatPrice(taxTotal / 2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between text-slate-500 text-sm font-medium">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold">Free</span>
                            </div>

                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600 text-sm font-bold animate-pulse">
                                    <span>
                                        Discount
                                        {appliedCoupon.discountType === 'percent' && (
                                            <span className="ml-1 text-xs bg-green-100 px-1 rounded">
                                                {appliedCoupon.discountValue}%
                                            </span>
                                        )}
                                    </span>
                                    <span>- {formatPrice(appliedCoupon.discountAmount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-xl font-extrabold text-slate-900 pt-4 border-t-2 border-slate-900">
                                <span>Total</span>
                                <span>{formatPrice(finalTotal)}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={submitting || !selectedAddress}
                                className="w-full mt-8 rounded-sm bg-gradient-brand py-4 font-bold text-lg text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wider block"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin h-5 w-5" /> Processing...
                                    </span>
                                ) : (
                                    `Pay ${formatPrice(finalTotal)}`
                                )}
                            </button>

                            <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
                                Secure Checkout • Terms Apply
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
