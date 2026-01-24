'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
    productId: string
    title: string
    price: number
    image?: string
    quantity: number
    maxStock: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('techdev_cart')
        if (saved) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse cart', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('techdev_cart', JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = (newItem: Omit<CartItem, 'quantity'>, quantity: number) => {
        setItems((currentItems) => {
            const existing = currentItems.find((i) => i.productId === newItem.productId)

            if (existing) {
                // Update quantity
                const updatedQuantity = Math.min(existing.quantity + quantity, existing.maxStock)
                return currentItems.map((i) =>
                    i.productId === newItem.productId
                        ? { ...i, quantity: updatedQuantity }
                        : i
                )
            } else {
                // Add new
                return [...currentItems, { ...newItem, quantity }]
            }
        })
        setIsOpen(true) // Open cart/drawer on add (optional UI choice)
    }

    const removeItem = (productId: string) => {
        setItems((current) => current.filter((i) => i.productId !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        setItems((current) =>
            current.map((i) => {
                if (i.productId === productId) {
                    const newQty = Math.max(1, Math.min(quantity, i.maxStock))
                    return { ...i, quantity: newQty }
                }
                return i
            })
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const cartCount = items.reduce((total, item) => total + item.quantity, 0)
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isOpen,
            setIsOpen
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
