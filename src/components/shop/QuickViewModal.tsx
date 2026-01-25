'use client'

import { useEffect, useState } from 'react'
import { X, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

interface QuickViewModalProps {
    isOpen: boolean
    onClose: () => void
    product: {
        id: string
        title: string
        price: number
        description: string
        image: string
        stock: number
    }
}

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
    const { addItem } = useCart()
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'unset'
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    if (!isOpen) return null

    const handleAddToCart = () => {
        setAdding(true)
        addItem({
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            maxStock: product.stock
        })
        setTimeout(() => setAdding(false), 500)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-20">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 p-2 text-gray-400 hover:text-white bg-black/50 rounded-full"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image */}
                    <div className="relative aspect-square md:aspect-auto h-full max-h-[500px] bg-white/5">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-500">No Image</div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="p-8 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold font-serif text-white mb-2">{product.title}</h2>
                            <p className="text-2xl font-medium text-orange-500 mb-6">{formatPrice(product.price)}</p>

                            <p className="text-gray-400 leading-relaxed max-h-40 overflow-y-auto mb-8 pr-2 custom-scrollbar">
                                {product.description || "No description available."}
                            </p>

                            {product.stock <= 5 && product.stock > 0 && (
                                <p className="text-red-500 text-sm font-bold mb-4 animate-pulse">
                                    Only {product.stock} left in stock!
                                </p>
                            )}

                            {product.stock === 0 && (
                                <p className="text-gray-500 text-sm font-bold mb-4">
                                    Out of Stock
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`w-full flex items-center justify-center gap-2 rounded-full py-4 font-bold transition-all
                                ${adding
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-black hover:bg-gray-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {adding ? (
                                <span>Added to Cart!</span>
                            ) : (
                                <>
                                    <ShoppingCart className="h-5 w-5" />
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
