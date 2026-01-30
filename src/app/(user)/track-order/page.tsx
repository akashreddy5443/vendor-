'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('')
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orderId.trim()) return

        setLoading(true)
        setError('')
        setOrder(null)

        const supabase = createClient()

        // Try searching by partial ID using the RPC function
        const { data, error } = await supabase.rpc('get_order_by_partial_id', { lookup_id: orderId.trim() })

        if (error) {
            console.error('Tracking Error:', error)
            setError('Error tracking order. Please try again.')
        } else if (data && data.length > 0) {
            // Found it! Fetch the items for the first match
            const orderData = data[0]

            // We need to fetch items separately since RPC returns just the order row usually, 
            // OR we could have made the RPC return a joined structure, but standard join is easier here.

            const { data: fullOrder, error: itemsError } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .eq('id', orderData.id)
                .single()

            if (fullOrder) {
                setOrder(fullOrder)
            } else {
                setError('Order details not available.')
            }
        } else {
            setError('Order not found. Please check your Order ID.')
        }

        setLoading(false)
    }

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'pending': return 1
            case 'processing': return 2
            case 'shipped': return 3
            case 'delivered': return 4
            case 'cancelled': return -1
            default: return 0
        }
    }

    const currentStep = order ? getStatusStep(order.status) : 0

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading font-bold text-[#191970] mb-4 tracking-tight uppercase">
                        Track Your Order
                    </h1>
                    <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                        Enter your Order ID to verify status and estimated delivery.
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg shadow-blue-900/5 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#191970]" />
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 relative z-10">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#191970] transition-colors h-5 w-5" />
                            <input
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter Order ID (e.g., d394a345...)"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-12 py-4 text-[#191970] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] transition-all font-mono tracking-wide text-base"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#191970] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#131355] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                        >
                            {loading ? <Clock className="animate-spin h-5 w-5" /> : 'Track Package'}
                        </button>
                    </form>
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="font-medium text-sm">{error}</span>
                        </div>
                    )}
                </div>

                {/* Tracking Result */}
                {order && (
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl shadow-blue-900/5 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {/* Header */}
                        <div className="bg-gray-50 p-8 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-2">Order Reference</p>
                                <p className="font-mono text-xl text-[#191970] font-bold tracking-wide">{order.id}</p>
                            </div>
                            <div className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider border ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                    order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                        'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                {order.status}
                            </div>
                        </div>

                        {/* Visual Timeline (Desktop) */}
                        <div className="p-10 hidden sm:block">
                            <div className="relative flex justify-between items-center z-0">
                                {/* Background Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2 rounded-full"></div>
                                {/* Progress Line */}
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-[#191970] -z-10 transform -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.max(0, (currentStep - 1)) * 33.33}%` }}
                                ></div>

                                {/* Steps */}
                                {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((label, index) => {
                                    const stepNum = index + 1
                                    const isActive = currentStep >= stepNum
                                    const isCurrent = currentStep === stepNum

                                    return (
                                        <div key={label} className="flex flex-col items-center gap-4 relative group">
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 relative z-10 ${isActive
                                                    ? 'border-[#191970] bg-[#191970] text-white scale-110 shadow-lg'
                                                    : 'border-gray-200 bg-white text-gray-300'
                                                }`}>
                                                {index === 0 && <CheckCircle className="w-6 h-6" />}
                                                {index === 1 && <Package className="w-6 h-6" />}
                                                {index === 2 && <Truck className="w-6 h-6" />}
                                                {index === 3 && <MapPin className="w-6 h-6" />}

                                                {/* Ripple Effect for Current Step */}
                                                {isCurrent && (
                                                    <span className="absolute inset-0 rounded-full animate-ping bg-[#191970]/20"></span>
                                                )}
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-[#191970]' : 'text-gray-400'}`}>{label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Timeline (Mobile) */}
                        <div className="p-8 sm:hidden space-y-8 relative ml-2 border-l-2 border-gray-100">
                            {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((label, index) => {
                                const stepNum = index + 1
                                const isActive = currentStep >= stepNum
                                return (
                                    <div key={label} className="relative pl-8">
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-colors duration-300 ${isActive ? 'bg-[#191970] border-[#191970]' : 'bg-white border-gray-300'}`}></div>
                                        <p className={`font-bold text-lg ${isActive ? 'text-[#191970]' : 'text-gray-300'}`}>{label}</p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Order Details */}
                        <div className="border-t border-gray-200 p-8 bg-gray-50/30">
                            <h3 className="font-heading font-bold text-xl text-[#191970] mb-6 flex items-center gap-2">
                                <Package className="text-[#191970]" /> Package Contents
                            </h3>
                            <div className="space-y-4">
                                {order.order_items?.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-gray-400 relative overflow-hidden">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <Package className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-[#191970] text-base line-clamp-1">{item.name || 'Product'}</p>
                                            <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-heading font-bold text-[#191970] text-lg">{formatPrice(item.price)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-end">
                                <span className="text-gray-600 font-medium">Total Amount</span>
                                <span className="text-3xl font-heading font-bold text-[#191970]">{formatPrice(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
