'use client'

import { deleteSubscriber } from '@/app/actions/newsletter'
import { Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner' // Assuming sonner is installed

export function SubscriberActions({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to remove this subscriber?')) return

        setIsDeleting(true)
        const res = await deleteSubscriber(id)
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success('Subscriber removed')
        }
        setIsDeleting(false)
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 bg-red-900/20 text-red-500 rounded-md hover:bg-red-900/40 transition-colors disabled:opacity-50"
            title="Remove Subscriber"
        >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
    )
}
