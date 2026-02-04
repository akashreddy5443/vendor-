'use client'

import { useCart } from '@/context/CartContext'
import { RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ReorderButtonProps {
    items: any[]
}

export function ReorderButton({ items }: ReorderButtonProps) {
    const { addToCart, clearCart } = useCart()
    const router = useRouter()

    const handleReorder = () => {
        // Clear existing cart to ensure isolation as requested
        clearCart()

        let addedCount = 0
        items.forEach(item => {
            if (item.product) {
                addToCart({
                    productId: item.product_id,
                    title: item.product.title,
                    price: item.price,
                    image: item.product.product_images?.find((img: any) => img.is_primary)?.cloudinary_url || item.product.product_images?.[0]?.cloudinary_url,
                    maxStock: 10,
                }, item.quantity)
                addedCount++
            }
        })

        if (addedCount > 0) {
            toast.success('Proceeding to checkout')
            router.push('/checkout')
        } else {
            toast.error('Could not add items')
        }
    }

    return (
        <button
            onClick={handleReorder}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all shadow-sm hover:shadow"
        >
            <RefreshCcw className="h-4 w-4" />
            Buy Again
        </button>
    )
}
