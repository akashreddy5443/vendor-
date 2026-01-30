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
        <div className="min-h-screen bg-[#0B1026] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 tracking-tight">
                        Track Your Order
                    </h1>
                    <p className="text-lg text-blue-200/60 font-medium">
                        Enter your Order ID to verify status and estimated delivery.
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl mb-12">
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter Order ID (e.g., 550e8400...)"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-mono tracking-wide"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                        >
                            {loading ? <Clock className="animate-spin h-5 w-5" /> : 'Track Package'}
                        </button>
                    </form>
                    {error && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}
                </div>

                {/* Tracking Result */}
                {order && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <p className="text-blue-200/60 text-xs uppercase font-bold tracking-widest mb-2">Order Reference</p>
                                <p className="font-mono text-lg md:text-xl text-white tracking-wide">{order.id}</p>
                            </div>
                            <div className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider border ${order.status === 'delivered' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                order.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                    'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                }`}>
                                {order.status}
                            </div>
                        </div>

                        {/* Visual Timeline (Desktop) */}
                        <div className="p-10 hidden sm:block">
                            <div className="relative flex justify-between items-center z-0">
                                {/* Background Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 transform -translate-y-1/2 rounded-full"></div>
                                {/* Progress Line */}
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 -z-10 transform -translate-y-1/2 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
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
                                                ? 'border-blue-500 bg-[#0B1026] text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-110'
                                                : 'border-white/10 bg-[#0B1026] text-white/20'
                                                }`}>
                                                {index === 0 && <CheckCircle className="w-6 h-6" />}
                                                {index === 1 && <Package className="w-6 h-6" />}
                                                {index === 2 && <Truck className="w-6 h-6" />}
                                                {index === 3 && <MapPin className="w-6 h-6" />}

                                                {/* Ripple Effect for Current Step */}
                                                {isCurrent && (
                                                    <span className="absolute inset-0 rounded-full animate-ping bg-blue-500/20"></span>
                                                )}
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-blue-300' : 'text-white/20'}`}>{label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Timeline (Mobile) */}
                        <div className="p-8 sm:hidden space-y-8 relative ml-2 border-l-2 border-white/10">
                            {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((label, index) => {
                                const stepNum = index + 1
                                const isActive = currentStep >= stepNum
                                return (
                                    <div key={label} className="relative pl-8">
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-colors duration-300 ${isActive ? 'bg-blue-500 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-[#0B1026] border-white/20'}`}></div>
                                        <p className={`font-bold text-lg ${isActive ? 'text-white' : 'text-white/30'}`}>{label}</p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Order Details */}
                        <div className="border-t border-white/10 p-8 bg-white/5">
                            <h3 className="font-heading font-bold text-xl text-white mb-6 flex items-center gap-2">
                                <Package className="text-purple-400" /> Package Contents
                            </h3>
                            <div className="space-y-4">
                                {order.order_items?.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="w-16 h-16 bg-white/10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs text-white/30">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover rounded-xl" />
                                            ) : (
                                                <Package className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-white text-base line-clamp-1">{item.name || 'Product'}</p>
                                            <p className="text-sm text-white/50 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-heading font-bold text-blue-300 text-lg">{formatPrice(item.price)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                                <span className="text-white/60 font-medium">Total Amount</span>
                                <span className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{formatPrice(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
