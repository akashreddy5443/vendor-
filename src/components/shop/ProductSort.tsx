'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

export function ProductSort() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentSort = searchParams.get('sort') || 'newest'

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', e.target.value)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:block">
                Sort By
            </span>
            <div className="relative">
                <select
                    value={currentSort}
                    onChange={handleSortChange}
                    className="
                        appearance-none bg-white border border-slate-200 rounded-full px-4 py-2 pr-10
                        text-xs font-bold uppercase tracking-wide text-slate-700
                        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
                        cursor-pointer hover:border-slate-300 transition-colors
                    "
                >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="verified">Verified Hub</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
        </div>
    )
}
