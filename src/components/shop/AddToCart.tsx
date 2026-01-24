'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'

export function AddToCart({ productId, price, stock }: { productId: string, price: number, stock: number }) {
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const [buttonText, setButtonText] = useState('Add to Cart')

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(prev => prev - 1)
    }

    const handleIncrease = () => {
        if (quantity < stock) setQuantity(prev => prev + 1)
    }

    const handleAddToCart = () => {
        // Phase 5 will implement actual context/cart logic
        setIsAdding(true)

        // Simulate API call/processing
        setTimeout(() => {
            setIsAdding(false)
            setButtonText('Added!')

            // Reset after 2 seconds
            setTimeout(() => setButtonText('Add to Cart'), 2000)
        }, 800)
    }

    if (stock === 0) {
        return (
            <div className="rounded-lg bg-red-900/20 p-4 text-center text-red-500 font-medium border border-red-900/50">
                Out of Stock
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center rounded-md border border-gray-700 bg-gray-900">
                    <button
                        onClick={handleDecrease}
                        className="p-3 text-gray-400 hover:text-white transition-colors"
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-white">{quantity}</span>
                    <button
                        onClick={handleIncrease}
                        className="p-3 text-gray-400 hover:text-white transition-colors"
                        disabled={quantity >= stock}
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
                <div className="text-sm text-gray-400">
                    {stock} available
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 py-4 font-bold text-white transition-all hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-900/20 disabled:opacity-70 active:scale-95"
            >
                <ShoppingCart className="h-5 w-5" />
                {isAdding ? 'Adding...' : buttonText}
            </button>
        </div>
    )
}
