'use client'

import { useCart } from '@/context/CartContext'
import { RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ReorderButtonProps {
    items: any[]
}

export function ReorderButton({ items }: ReorderButtonProps) {
    const { setBuyNowItems } = useCart()
    const router = useRouter()

    const handleReorder = () => {
        const itemsToBuy: any[] = []

        if (item.product) {
            // Use current sale price if available, else current price, else historical order price
            const currentPrice = item.product.sale_price || item.product.price || item.price

            itemsToBuy.push({
                productId: item.product_id,
                title: item.product.title,
                price: currentPrice,
                image: item.product.product_images?.find((img: any) => img.is_primary)?.cloudinary_url || item.product.product_images?.[0]?.cloudinary_url,
                maxStock: 10,
                quantity: item.quantity
            })
        }
    })

    if (itemsToBuy.length > 0) {
        setBuyNowItems(itemsToBuy)
        toast.success('Proceeding to fast checkout')
        router.push('/checkout?source=buy_now')
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
