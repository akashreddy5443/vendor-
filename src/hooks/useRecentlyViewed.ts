'use client'

import { useState, useEffect } from 'react'

export interface RecentProduct {
    id: string
    title: string
    price: number
    image: string
    slug: string
}

const STORAGE_KEY = 'recently_viewed_techdev'
const MAX_ITEMS = 5

export function useRecentlyViewed() {
    const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([])

    useEffect(() => {
        // Load initial state
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                setRecentProducts(JSON.parse(stored))
            } catch (e) {
                console.error('Failed to parse recently viewed', e)
            }
        }
    }, [])

    const addToHistory = (product: RecentProduct) => {
        setRecentProducts(prev => {
            // Remove if exists (to move to top)
            const filtered = prev.filter(p => p.id !== product.id)
            // Add to front
            const updated = [product, ...filtered].slice(0, MAX_ITEMS)

            // Save to storage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated
        })
    }

    return {
        recentProducts,
        addToHistory
    }
}
