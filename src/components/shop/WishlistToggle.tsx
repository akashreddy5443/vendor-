'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { toggleWishlist, checkWishlistStatus } from '@/app/actions/wishlist'
import { cn } from '@/lib/utils'

export function WishlistToggle({ productId, className }: { productId: string, className?: string }) {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        checkWishlistStatus(productId).then((status) => setIsWishlisted(!!status))
    }, [productId])

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent Link navigation
        e.stopPropagation() // Prevent bubbling
        if (loading) return

        // Optimistic update
        const previousState = isWishlisted
        setIsWishlisted(!previousState)
        setLoading(true)

        try {
            const result = await toggleWishlist(productId)
            if (result.error) {
                setIsWishlisted(previousState)
                // alert(result.error) 
            } else {
                setIsWishlisted(result.isWishlisted || false) // Ensure boolean
            }
        } catch (error) {
            setIsWishlisted(previousState)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "rounded-full p-2 transition-transform hover:scale-110 focus:outline-none",
                isWishlisted ? "text-red-500 fill-current" : "text-gray-400 hover:text-red-500",
                className
            )}
        >
            <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
        </button>
    )
}
