'use client'

import { useState } from 'react'
import { updateOrderStatus } from './actions'
import { Loader2 } from 'lucide-react'

export function StatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus)
    const [loading, setLoading] = useState(false)

    const handleChange = async (newStatus: string) => {
        setStatus(newStatus)
        setLoading(true)

        const res = await updateOrderStatus(orderId, newStatus)

        if (res?.error) {
            alert('Failed to update: ' + res.error)
            setStatus(currentStatus) // revert
        }

        setLoading(false)
    }

    // Styles for statuses
    const getStyle = (s: string) => {
        switch (s) {
            case 'pending': return 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20'
            case 'paid': return 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/20'
            case 'shipped': return 'bg-blue-400/10 text-blue-400 ring-blue-400/20'
            case 'delivered': return 'bg-green-400/10 text-green-400 ring-green-400/20'
            case 'cancelled': return 'bg-red-400/10 text-red-400 ring-red-400/20'
            default: return 'bg-gray-400/10 text-gray-400 ring-gray-400/20'
        }
    }

    return (
        <div className="relative inline-block">
            <select
                value={status}
                onChange={(e) => handleChange(e.target.value)}
                disabled={loading}
                className={`appearance-none rounded-full px-3 py-1 pr-8 text-xs font-medium ring-1 ring-inset border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 ${getStyle(status)}`}
                style={{ backgroundColor: 'transparent' }} // Let container style set bg color via class
            >
                <option value="pending" className="bg-zinc-900 text-yellow-400">Pending</option>
                <option value="paid" className="bg-zinc-900 text-emerald-400">Paid</option>
                <option value="shipped" className="bg-zinc-900 text-blue-400">Shipped</option>
                <option value="delivered" className="bg-zinc-900 text-green-400">Delivered</option>
                <option value="cancelled" className="bg-zinc-900 text-red-400">Cancelled</option>
            </select>
            {loading && (
                <div className="absolute right-2 top-1.5 pointer-events-none">
                    <Loader2 className="h-3 w-3 animate-spin text-white/50" />
                </div>
            )}
        </div>
    )
}
