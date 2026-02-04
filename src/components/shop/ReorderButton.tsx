'use client'

import { useCart } from '@/context/CartContext'
import { RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ReorderButtonProps {
    items: any[]
}

export function ReorderButton({ items }: ReorderButtonProps) {
    const { addToCart } = useCart()
    const router = useRouter()

    const handleReorder = () => {
        let addedCount = 0
        items.forEach(item => {
            if (item.product) {
                // Construct the cart item structure based on what addToCart expects
                // Assuming item.product contains necessary fields. 
                // We might need to map fields if the order item structure differs slightly from product structure.
                addToCart({
                    productId: item.product_id, // or item.product.id
                    title: item.product.title,
                    price: item.price, // Use the price from the order or current price? Usually valid to use current, but here we might just pass what we have. 
                    // Ideally we should fetch fresh product data, but for now lets use what's in the order item if it has product details.
                    image: item.product.product_images?.find((img: any) => img.is_primary)?.cloudinary_url || item.product.product_images?.[0]?.cloudinary_url,
                    maxStock: 10, // Fallback if not available, or we should fetch it.
                    // If we don't have maxStock, the cart might limit it.
                }, item.quantity)
                addedCount++
            }
        })

        if (addedCount > 0) {
            toast.success('Items added, proceeding to checkout')
            router.push('/checkout')
        } else {
            toast.error('Could not add items to cart')
        }
    }

    return (
        <button
            onClick={handleReorder}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
            <RefreshCcw className="h-4 w-4" />
            Reorder Products
        </button>
    )
}
