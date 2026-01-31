'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export function AddToCart({ productId, price, stock, title, image }: { productId: string, price: number, stock: number, title: string, image?: string }) {
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const [buttonText, setButtonText] = useState('Add to Cart')
    const { addItem } = useCart()

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(prev => prev - 1)
    }

    const handleIncrease = () => {
        if (quantity < stock) setQuantity(prev => prev + 1)
    }

    const handleAddToCart = () => {
        setIsAdding(true)

        // Add to context
        addItem({ productId, price, title, image, maxStock: stock }, quantity)

        // Simulate feedback
        setTimeout(() => {
            setIsAdding(false)
            setButtonText('Added!')

            // Reset after 2 seconds
            setTimeout(() => setButtonText('Add to Cart'), 2000)
        }, 500)
    }

    if (stock === 0) {
        return (
            <div className="rounded-[2rem] bg-red-50 p-6 text-center text-red-600 font-bold border border-red-100 uppercase tracking-widest text-[10px]">
                Operational Status: Depleted
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-6">
                <div className="flex items-center rounded-full border border-slate-100 bg-slate-50 shadow-inner">
                    <button
                        onClick={handleDecrease}
                        className="p-4 text-slate-400 hover:text-primary transition-colors disabled:opacity-30"
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-heading font-black text-slate-900">{quantity}</span>
                    <button
                        onClick={handleIncrease}
                        className="p-4 text-slate-400 hover:text-primary transition-colors disabled:opacity-30"
                        disabled={quantity >= stock}
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="text-primary">{stock}</span> Units Logged
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-primary py-5 font-heading font-black text-white transition-all hover:bg-indigo-600 hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-70 active:scale-95 uppercase tracking-widest text-sm"
            >
                <ShoppingCart className="h-5 w-5" />
                {isAdding ? 'Syncing...' : buttonText}
            </button>
        </div>
    )
}
