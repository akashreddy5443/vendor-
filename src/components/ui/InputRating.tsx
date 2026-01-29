'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function InputRating({ value, onChange }: { value: number, onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0)

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
                <button
                    key={s}
                    type="button"
                    onClick={() => onChange(s)}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                >
                    <Star
                        className={cn(
                            "w-6 h-6",
                            s <= (hover || value) ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300"
                        )}
                    />
                </button>
            ))}
            <span className="ml-2 text-sm text-gray-500 font-medium">
                {value ? `${value} Star${value > 1 ? 's' : ''}` : 'Select Rating'}
            </span>
        </div>
    )
}
