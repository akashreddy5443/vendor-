'use client'

import { useComparison } from '@/context/ComparisonContext'
import { X, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function CompareFloatingBar() {
    const { selectedIds, clearCompare } = useComparison()

    if (selectedIds.length === 0) return null

    return (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5 fade-in">
            <div className="bg-zinc-900 border border-zinc-700 text-white shadow-xl rounded-full px-6 py-3 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="bg-orange-600 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                        {selectedIds.length}
                    </span>
                    <span className="text-sm font-medium">Products to Compare</span>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/compare"
                        className="flex items-center gap-2 text-sm font-bold text-white hover:text-orange-400 transition-colors"
                    >
                        Compare
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <div className="h-4 w-px bg-zinc-700"></div>
                    <button
                        onClick={clearCompare}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Clear all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
