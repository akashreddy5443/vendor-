'use client'

import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <CartProvider>
                {children}
            </CartProvider>
        </ThemeProvider>
    )
}
