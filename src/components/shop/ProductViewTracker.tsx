'use client'

import { useEffect } from 'react'
import { useRecentlyViewed, RecentProduct } from '@/hooks/useRecentlyViewed'

export function ProductViewTracker({ product }: { product: RecentProduct }) {
    const { addToHistory } = useRecentlyViewed()

    useEffect(() => {
        if (product && product.id) {
            addToHistory(product)
        }
    }, [product.id]) // Only trigger when product ID changes

    return null // Invisible component
}
