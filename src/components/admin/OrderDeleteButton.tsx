'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteOrder } from '@/app/admin/orders/actions'

export function OrderDeleteButton({ orderId }: { orderId: string }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) return

        setLoading(true)
        const res = await deleteOrder(orderId)
        if (res?.error) {
            alert('Failed to delete: ' + res.error)
            setLoading(false)
        }
        // If success, server revalidates and this component unmounts, or we can stay loading
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Delete Order"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </button>
    )
}
