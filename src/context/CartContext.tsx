'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
    subtotal: number
    taxTotal: number
    gstRate: number
    coupon: any | null // Changed type
    applyCoupon: (coupon: any) => void // Changed signature
    removeCoupon: () => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    taxLabel: string // Added
    taxBreakdownEnabled: boolean // Added
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) { // Changed React.ReactNode to ReactNode
    const [items, setItems] = useState<CartItem[]>([])
    const [coupon, setCoupon] = useState<any | null>(null) // Moved and changed type
    const [isOpen, setIsOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [defaultGst, setDefaultGst] = useState<number | null>(null)
    const [taxLabel, setTaxLabel] = useState('GST') // Added
    const [taxBreakdownEnabled, setTaxBreakdownEnabled] = useState(true) // Added

    // Load from local storage and fetch settings
    useEffect(() => {
        const initCart = async () => {
            // 1. Load Local Storage
            const saved = localStorage.getItem('techdev_cart')
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    const validItems = parsed.filter((i: CartItem) =>
                        i.productId &&
                        !isNaN(i.quantity) &&
                        i.quantity > 0 &&
                        !isNaN(i.price)
                    )
                    setItems(validItems)
                } catch (e) {
                    console.error('Failed to parse cart', e)
                    setItems([])
                }
            }
            setIsLoaded(true)

            // 2. Fetch Global GST Setting
            const supabase = createClient()
            const { data } = await supabase.from('site_settings').select('default_gst_percentage, tax_label, tax_breakdown_enabled').maybeSingle()
            // Default to 5 if DB setting is missing, as per user request
            setDefaultGst(data?.default_gst_percentage ?? 5)
            setTaxLabel(data?.tax_label || 'GST')
            if (data?.tax_breakdown_enabled !== undefined) {
                setTaxBreakdownEnabled(data.tax_breakdown_enabled)
            }
        }

        initCart()
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
        // STRICT FIX: Force all items to use the Global GST Rate.
        // We ignore 'item.gstPercentage' because some products (like MacBook) have corrupted DB values (e.g. 9.6%).
        // The user wants a consistent Dynamic GST across the site.
        const rate = defaultGst ?? 5
        const itemTax = (item.price * rate / 100) * item.quantity
        return total + itemTax
    }, 0)

    // Recalculate discount if subtotal changes
    const cartTotal = Math.max(0, subtotal + taxTotal - (coupon?.discountAmount || 0))

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            addToCart: (item, quantity = 1) => addItem(item, quantity),
            removeItem,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            subtotal,
            taxTotal,
            gstRate: defaultGst || 0, // Expose for UI
            coupon,
            applyCoupon,
            removeCoupon,
            isOpen,
            setIsOpen,
            taxLabel,
            taxBreakdownEnabled
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
