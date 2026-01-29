'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RatingStars({ rating, size = 'sm' }: { rating: number, size?: 'sm' | 'md' | 'lg' }) {
    const starSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={cn(
                        starSize,
                        s <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                    )}
                />
            ))}
        </div>
    )
}
