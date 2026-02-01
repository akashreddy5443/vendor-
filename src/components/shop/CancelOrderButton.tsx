'use client'

import { useState } from 'react'
import { cancelUserOrder } from '@/app/(user)/user/orders/actions'
import { Loader2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner' // Assuming sonner is used, or alert

export function CancelOrderButton({ orderId, status }: { orderId: string, status: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    if (!['pending', 'processing'].includes(status)) {
        return null
    }

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return
        }

        setIsLoading(true)
        try {
            const result = await cancelUserOrder(orderId)
            if (result.error) {
                alert(result.error)
            } else {
                router.refresh()
                // If using a toast library: toast.success('Order cancelled')
            }
        } catch (error) {
            alert('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex items-center gap-2 text-red-600 text-sm font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <XCircle className="h-4 w-4" />
            )}
            Cancel Order
        </button>
    )
}
