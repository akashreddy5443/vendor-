'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ShoppingCart, Heart, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/context/CartContext'
import { SpotlightSearch } from '@/components/ui/SpotlightSearch'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Navbar() {
    const [announcement, setAnnouncement] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const { cartCount } = useCart()

    useEffect(() => {
        const init = async () => {
            const supabase = createClient()

            // Fetch User
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            // Fetch Announcement
            const { data } = await supabase
                .from('homepage_sections')
                .select('content_json, is_active')
                .eq('section_type', 'announcement')
                .single()

            if (data) setAnnouncement(data)
            setLoading(false)
        }
        init()
    }, [])

    const showAnnouncement = announcement?.is_active && announcement?.content_json?.show !== false
    const text = announcement?.content_json?.text || ''
    const link = announcement?.content_json?.link || '#'

    return (
        <div className="flex flex-col">
            {!loading && showAnnouncement && (
                <div className="bg-orange-600 text-white text-xs font-bold py-2 text-center uppercase tracking-wider relative z-50">
                    {link && link !== '#' ? (
                        <Link href={link} className="hover:underline">
                            {text}
                        </Link>
                    ) : (
                        <span>{text}</span>
                    )}
                </div>
            )}

            <nav className="flex h-16 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-6 text-foreground sticky top-0 z-40 transition-colors duration-300 shadow-sm support-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-orange-500">
                        <ShoppingBag />
                        TechDev Store
                    </Link>
                    <SpotlightSearch />
                </div>

                <div className="flex gap-6 text-sm font-medium items-center">
                    <Link href="/products" className="hidden md:block hover:text-primary transition-colors">Products</Link>
                    <Link href="/categories" className="hidden md:block hover:text-primary transition-colors">Categories</Link>

                    {user ? (
                        <>
                            <Link href="/user/wishlist" className="hover:text-primary transition-colors">
                                <span className="sr-only">Wishlist</span>
                                <Heart className="h-5 w-5" />
                            </Link>
                            <Link href="/user" className="hover:text-primary transition-colors">
                                <span className="sr-only">Account</span>
                                <User className="h-5 w-5" />
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
                            <Link href="/register" className="px-4 py-2 rounded-full bg-orange-600 text-white hover:bg-orange-500 transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    )}

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
