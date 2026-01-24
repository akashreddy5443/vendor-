'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ShoppingCart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/context/CartContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

// ... imports

export function Navbar() {
    // ... code

    return (
        <div className="flex flex-col">
            {/* ... Announcement Bar ... */}

            <nav className="flex h-16 items-center justify-between border-b border-gray-800 bg-background px-6 text-foreground sticky top-0 z-40 transition-colors duration-300">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-orange-500">
                        <ShoppingBag />
                        TechDev Store
                    </Link>
                    <SpotlightSearch />
                </div>

                <div className="flex gap-6 text-sm font-medium items-center">
                    <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                    <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
                    <Link href="/cart" className="hover:text-primary transition-colors relative group">
                        <span className="sr-only">Cart</span>
                        <div className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </Link>
                    <ThemeToggle />
                </div>
            </nav>
        </div>
    )
}
