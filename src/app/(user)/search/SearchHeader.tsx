'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

export function SearchHeader({ query, total }: { query: string, total: number }) {
    const router = useRouter()
    const [localQuery, setLocalQuery] = useState(query)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(window.location.search)
        if (localQuery) {
            params.set('q', localQuery)
        } else {
            params.delete('q')
        }
        router.push(`/search?${params.toString()}`)
    }

    return (
        <div className="bg-secondary/50 border-b border-border py-12 px-6 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2 font-serif">Search Results</h1>
            <p className="text-muted-foreground mb-8">Found {total} results for &quot;{query || 'All Products'}&quot;</p>

            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
                <input
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Search again..."
                    className="w-full rounded-full border border-input bg-background/50 py-3 pl-12 pr-4 text-foreground focus:border-primary focus:outline-none backdrop-blur-sm placeholder:text-muted-foreground"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            </form>
        </div>
    )
}
