'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteUser } from '@/app/admin/users/actions'
import { useRouter } from 'next/navigation'

interface UserDeleteButtonProps {
    userId: string
    userRole?: string
}

export function UserDeleteButton({ userId, userRole }: UserDeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return
        }

        setIsDeleting(true)
        try {
            const result = await deleteUser(userId)

            if (result.error) {
                alert(result.error)
            } else {
                // Success: Row will be removed by revalidation, but we can also refresh router
                router.refresh()
            }
        } catch (error) {
            alert('An unexpected error occurred')
            console.error(error)
        } finally {
            setIsDeleting(false)
        }
    }

    if (userRole === 'admin') {
        return null // Don't allow deleting admins from this simple button to prevent accidents/lockout
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Delete User"
        >
            {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </button>
    )
}
