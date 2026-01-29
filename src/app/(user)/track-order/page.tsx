'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

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
        // Note: For real security, tracking should maybe require email verification or login.
        // For now, we allow tracking by exact UUID.
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', orderId)
            .single()

        if (error || !data) {
            setError('Order not found. Please check your Order ID.')
        } else {
            setOrder(data)
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-[#191970] uppercase tracking-wide">Track Your Order</h1>
                    <p className="mt-2 text-gray-600">Enter your Order ID to see real-time updates.</p>
                </div>

                {/* Search Box */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <form onSubmit={handleTrack} className="flex gap-4">
                        <input
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="Enter Order ID (e.g., 550e8400...)"
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#191970] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#131355] disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Tracking...' : 'Track'}
                        </button>
                    </form>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}
                </div>

                {/* Tracking Result */}
                {order && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-[#191970] p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-white/60 text-xs uppercase font-bold tracking-widest mb-1">Order ID</p>
                                <p className="font-mono text-sm sm:text-base">{order.id}</p>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded text-sm font-bold capitalize">
                                Status: {order.status}
                            </div>
                        </div>

                        {/* Visual Timeline (Desktop) */}
                        <div className="p-8 hidden sm:block">
                            <div className="relative flex justify-between items-center z-0">
                                {/* Connector Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded-full"></div>
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transform -translate-y-1/2 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.max(0, (currentStep - 1)) * 33.33}%` }}
                                ></div>

                                {/* Steps */}
                                {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((label, index) => {
                                    const stepNum = index + 1
                                    const isActive = currentStep >= stepNum
                                    const isCurrent = currentStep === stepNum

                                    return (
                                        <div key={label} className="flex flex-col items-center gap-3 bg-white px-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive ? 'border-green-500 bg-green-500 text-white shadow-lg shadow-green-200' : 'border-gray-200 bg-white text-gray-400'}`}>
                                                {index === 0 && <CheckCircle className="w-5 h-5" />}
                                                {index === 1 && <Package className="w-5 h-5" />}
                                                {index === 2 && <Truck className="w-5 h-5" />}
                                                {index === 3 && <MapPin className="w-5 h-5" />}
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Timeline (Mobile) */}
                        <div className="p-6 sm:hidden space-y-6 relative ml-4 border-l-2 border-gray-100">
                            {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((label, index) => {
                                const stepNum = index + 1
                                const isActive = currentStep >= stepNum
                                return (
                                    <div key={label} className="relative pl-6">
                                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${isActive ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}></div>
                                        <p className={`font-bold ${isActive ? 'text-green-600' : 'text-gray-400'}`}>{label}</p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Order Details */}
                        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                            <h3 className="font-bold text-[#191970] mb-4">Items in Shipment</h3>
                            <div className="space-y-4">
                                {order.order_items?.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded border border-gray-100">
                                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-400">IMG</div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.name || 'Product'}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-gray-900 text-sm">{formatPrice(item.price)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-between items-center text-sm">
                                <span className="text-gray-500">Total Amount</span>
                                <span className="text-xl font-bold text-[#191970]">{formatPrice(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
