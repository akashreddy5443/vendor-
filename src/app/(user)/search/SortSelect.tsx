'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function SortSelect() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentSort = searchParams.get('sort') || 'relevance'

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', e.target.value)
        router.push(`/search?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
            <select
                value={currentSort}
                onChange={handleSortChange}
                className="bg-transparent text-sm font-medium text-foreground focus:outline-none cursor-pointer"
            >
                <option value="relevance" className="bg-background text-foreground">Relevance</option>
                <option value="price_asc" className="bg-background text-foreground">Price: Low to High</option>
                <option value="price_desc" className="bg-background text-foreground">Price: High to Low</option>
                <option value="newest" className="bg-background text-foreground">Newest Arrivals</option>
            </select>
        </div>
    )
}
