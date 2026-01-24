'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { FilterSidebar } from './FilterSidebar'

export function MobileFilter({ categories }: { categories: any[] }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-white bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800"
            >
                <Filter className="h-4 w-4" /> Filters
            </button>

            {/* Mobile Sheet/Overlay */}
            {open && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    {/* Content */}
                    <div className="relative w-80 h-full bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white">Filters</h2>
                            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <FilterSidebar categories={categories} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
