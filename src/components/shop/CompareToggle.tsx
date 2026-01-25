'use client'

import { useComparison } from '@/context/ComparisonContext'
import { Scale } from 'lucide-react'

import { cn } from '@/lib/utils'

export function CompareToggle({ productId, className }: { productId: string, className?: string }) {
    const { isInCompare, addToCompare, removeFromCompare } = useComparison()
    const isSelected = isInCompare(productId)

    const toggle = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigating if inside a Link
        e.stopPropagation()

        if (isSelected) {
            removeFromCompare(productId)
        } else {
            addToCompare(productId, null)
        }
    }

    return (
        <button
            onClick={toggle}
            className={cn(
                "p-2 rounded-full transition-all",
                isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-gray-500 hover:text-blue-500',
                className
            )}
            title={isSelected ? "Remove from Compare" : "Add to Compare"}
        >
            <Scale className="h-4 w-4" />
        </button>
    )
}
