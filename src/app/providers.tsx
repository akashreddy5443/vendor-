'use client'

import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from 'next-themes'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { SpotlightCursor } from '@/components/ui/SpotlightCursor';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <ProgressBar
                height="3px"
                color="#ea580c"
                options={{ showSpinner: false }}
                shallowRouting
            />
            <SpotlightCursor />
            <CartProvider>
                {children}
            </CartProvider>
        </ThemeProvider>
    )
}
