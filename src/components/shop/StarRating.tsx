'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
    rating: number // Current rating (0-5)
    maxRating?: number
    size?: number
    editable?: boolean
    onRatingChange?: (rating: number) => void
    className?: string
}

export function StarRating({
    rating,
    maxRating = 5,
    size = 20,
    editable = false,
    onRatingChange,
    className
}: StarRatingProps) {
    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {[...Array(maxRating)].map((_, i) => {
                const isFilled = i < rating
                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!editable}
                        onClick={() => editable && onRatingChange?.(i + 1)}
                        className={cn(
                            "transition-colors",
                            editable ? "cursor-pointer hover:scale-110" : "cursor-default"
                        )}
                    >
                        <Star
                            size={size}
                            className={cn(
                                isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-600",
                                editable && "hover:fill-yellow-400 hover:text-yellow-400" // Simple hover effect logic would need state, keeping simple for now
                            )}
                        />
                    </button>
                )
            })}
        </div>
    )
}
