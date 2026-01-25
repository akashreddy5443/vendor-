'use client'

import { useComparison } from '@/context/ComparisonContext'
import { Scale } from 'lucide-react'

export function CompareToggle({ productId }: { productId: string }) {
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
            className={`p-2 rounded-full transition-all ${isSelected ? 'bg-orange-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-gray-500 hover:text-orange-500'}`}
            title={isSelected ? "Remove from Compare" : "Add to Compare"}
        >
            <Scale className="h-4 w-4" />
        </button>
    )
}
