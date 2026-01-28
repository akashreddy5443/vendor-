'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
    productId: string
    title: string
    price: number
    image?: string
    quantity: number
    maxStock: number
    gstPercentage?: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
    subtotal: number
    taxTotal: number
    coupon: { id: string, code: string, discountAmount: number } | null
    applyCoupon: (data: { id: string, code: string, discountAmount: number }) => void
    removeCoupon: () => void
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

    const [coupon, setCoupon] = useState<{ id: string, code: string, discountAmount: number } | null>(null)

    // ... (existing UseEffects)

    const applyCoupon = (data: { id: string, code: string, discountAmount: number }) => {
        setCoupon(data)
    }

    const removeCoupon = () => {
        setCoupon(null)
    }

    const cartCount = items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)

    // Calculate Tax per item
    const taxTotal = items.reduce((total, item) => {
        // GST is typically exclusive of share price in this context, or inclusive? 
        // User asked to "add gst rate... 18%". Usually add-on.
        // Assuming Price is Base, Tax is extra.
        const itemTax = (item.price * (item.gstPercentage || 18) / 100) * item.quantity
        return total + itemTax
    }, 0)

    // Recalculate discount if subtotal changes (optional: strictly usually we should re-validate with server, but for UI we assume valid for now)
    // Note: If discount is fixed, it's fine. If percentage, we might need to store the raw coupon data. 
    // For simplicity, we just trust the passed amount or clear it if 0.
    const cartTotal = Math.max(0, subtotal + taxTotal - (coupon?.discountAmount || 0))

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            subtotal,
            taxTotal,
            coupon,
            applyCoupon,
            removeCoupon,
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
