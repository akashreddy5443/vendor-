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
        <div className="bg-zinc-900 border-b border-zinc-800 py-12 px-6 text-center">
            <h1 className="text-4xl font-bold text-white mb-2 font-serif">Search Results</h1>
            <p className="text-gray-400 mb-8">Found {total} results for &quot;{query || 'All Products'}&quot;</p>

            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
                <input
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Search again..."
                    className="w-full rounded-full border border-zinc-700 bg-black/50 py-3 pl-12 pr-4 text-white focus:border-orange-500 focus:outline-none backdrop-blur-sm"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            </form>
        </div>
    )
}
