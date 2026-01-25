'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ComparisonContextType {
    selectedIds: string[]
    addToCompare: (id: string, product: any) => void // We might just need ID, but keeping product optional for optimisitc UI if needed later
    removeFromCompare: (id: string) => void
    clearCompare: () => void
    isInCompare: (id: string) => boolean
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('compare_ids')
        if (saved) {
            try {
                setSelectedIds(JSON.parse(saved))
            } catch (e) {
                console.error(e)
            }
        }
    }, [])

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('compare_ids', JSON.stringify(selectedIds))
    }, [selectedIds])

    const addToCompare = (id: string) => {
        if (selectedIds.length >= 3) {
            alert('You can only compare up to 3 products at a time.')
            return
        }
        if (!selectedIds.includes(id)) {
            setSelectedIds(prev => [...prev, id])
        }
    }

    const removeFromCompare = (id: string) => {
        setSelectedIds(prev => prev.filter(item => item !== id))
    }

    const clearCompare = () => {
        setSelectedIds([])
    }

    const isInCompare = (id: string) => {
        return selectedIds.includes(id)
    }

    return (
        <ComparisonContext.Provider value={{ selectedIds, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
            {children}
        </ComparisonContext.Provider>
    )
}

export function useComparison() {
    const context = useContext(ComparisonContext)
    if (context === undefined) {
        throw new Error('useComparison must be used within a ComparisonProvider')
    }
    return context
}
