'use client'

import { useState } from 'react'
import { updateOrderStatus } from './actions'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const STATUSES = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' },
    { value: 'processing', label: 'Processing', color: 'bg-orange-50 text-orange-800 ring-orange-600/20' },
    { value: 'shipped', label: 'Shipped', color: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-50 text-green-700 ring-green-600/20' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-50 text-red-700 ring-red-600/20' },
]

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value
        setStatus(newStatus)
        setIsLoading(true)

        const result = await updateOrderStatus(orderId, newStatus)

        if (result.error) {
            alert('Failed to update status')
            setStatus(currentStatus) // Revert
        } else {
            // Success
            router.refresh()
        }
        setIsLoading(false)
    }

    const activeColor = STATUSES.find(s => s.value === status)?.color || 'bg-gray-50 text-gray-600'

    return (
        <div className="relative flex items-center gap-2">
            <select
                value={status}
                onChange={handleChange}
                disabled={isLoading}
                className={`appearance-none cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold ring-1 ring-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors uppercase tracking-wider ${activeColor} pl-2 pr-8 disabled:opacity-50`}
            >
                {STATUSES.map(s => (
                    <option key={s.value} value={s.value} className="bg-white text-gray-900">
                        {s.label}
                    </option>
                ))}
            </select>
            {/* Custom Arrow or Spinner */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin text-current" />
                ) : (
                    <svg className="h-4 w-4 text-current opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </div>
        </div>
    )
}
