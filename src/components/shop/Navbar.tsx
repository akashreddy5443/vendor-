'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ShoppingCart, Heart, User, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/context/CartContext'
import { SpotlightSearch } from '@/components/ui/SpotlightSearch'

export function Navbar() {
    const [announcement, setAnnouncement] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { cartCount } = useCart()

    const [settings, setSettings] = useState<any>(null)

    useEffect(() => {
        const supabase = createClient()

        const init = async () => {
            // Fetch Settings
            const { data: settingsData } = await supabase
                .from('site_settings')
                .select('logo_url, site_name')
                .single()
            setSettings(settingsData)

            // Fetch User
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            // ... existing announcement fetch logic

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

        // ... auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const showAnnouncement = announcement?.is_active && announcement?.content_json?.show !== false
    const text = announcement?.content_json?.text || ''
    const link = announcement?.content_json?.link || '#'

    return (
        <div className="flex flex-col">
            {!loading && showAnnouncement && (
                <div className="bg-primary text-primary-foreground text-xs font-bold py-2 text-center uppercase tracking-wider relative z-50">
                    {link && link !== '#' ? (
                        <Link href={link} className="hover:underline">
                            {text}
                        </Link>
                    ) : (
                        <span>{text}</span>
                    )}
                </div>
            )}

            <nav className="flex h-16 items-center justify-between border-b border-border bg-background px-6 text-foreground sticky top-0 z-40 shadow-sm relative">
                {/* Left: Logo */}
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>

                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground group">
                        {settings?.logo_url ? (
                            <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-8 w-auto object-contain" />
                        ) : (
                            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                        )}
                        <span className="hidden min-[370px]:inline group-hover:text-primary transition-colors">{settings?.site_name || 'TechDev'}</span>
                    </Link>
                </div>

                {/* Center: Navigation Links (Desktop) - Shifted left */}
                <div className="hidden md:flex absolute left-[42%] -translate-x-1/2 items-center gap-8 text-sm font-medium uppercase tracking-wide">
                    <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">Home</Link>
                    <Link href="/products" className="text-foreground/80 hover:text-primary transition-colors">All Products</Link>
                    <Link href="/categories" className="text-foreground/80 hover:text-primary transition-colors">Categories</Link>
                    <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors">About Us</Link>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    {/* Search - Pushed slightly right by structure */}
                    <div className="hidden md:block">
                        <SpotlightSearch />
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-3 pl-2 border-l border-border/50">
                        {user ? (
                            <Link href="/user" className="hidden md:flex flex-col items-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                                <User className="h-5 w-5 mb-0.5 text-primary" />
                            </Link>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-full">
                                <User className="h-4 w-4" />
                                <span>Sign In / Join</span>
                            </Link>
                        )}

                        <Link href="/user/wishlist" className="hidden md:flex flex-col items-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                            <Heart className="h-5 w-5 mb-0.5" />
                        </Link>

                        <Link href="/cart" className="relative flex flex-col items-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors group">
                            <div className="relative">
                                <ShoppingCart className="h-5 w-5 mb-0.5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-xl border-t border-border p-6 flex flex-col gap-6 animate-in slide-in-from-top-5 pb-20 overflow-y-auto">
                    <div className="flex flex-col gap-4 text-lg font-medium text-foreground/80">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">Home</Link>
                        <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">Products</Link>
                        <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">Categories</Link>
                        <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">About</Link>
                    </div>

                    <div className="border-t border-border pt-6 flex flex-col gap-4">
                        {user ? (
                            <>
                                <Link href="/user/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-foreground/80 hover:text-primary">
                                    <Heart className="h-5 w-5" /> My Wishlist
                                </Link>
                                <Link href="/user" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-foreground/80 hover:text-primary">
                                    <User className="h-5 w-5" /> My Account
                                </Link>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 rounded-lg border border-border hover:bg-muted text-foreground">
                                    Sign In
                                </Link>
                                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
