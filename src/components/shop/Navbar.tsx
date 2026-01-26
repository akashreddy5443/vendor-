'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ShoppingCart, Heart, User, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/context/CartContext'
import { SpotlightSearch } from '@/components/ui/SpotlightSearch'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

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
                <div className="bg-blue-600 text-white text-xs font-bold py-2 text-center uppercase tracking-wider relative z-50">
                    {link && link !== '#' ? (
                        <Link href={link} className="hover:underline">
                            {text}
                        </Link>
                    ) : (
                        <span>{text}</span>
                    )}
                </div>
            )}

            <nav className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0B1026] px-6 text-white sticky top-0 z-40 shadow-lg">
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>

                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-500">
                        {settings?.logo_url ? (
                            <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-8 w-auto object-contain" />
                        ) : (
                            <ShoppingBag className="h-6 w-6 text-blue-500" />
                        )}
                        <span className="hidden min-[370px]:inline">{settings?.site_name || 'TechDev'}</span>
                    </Link>
                    <div className="hidden md:block">
                        <SpotlightSearch />
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex gap-6 text-sm font-medium items-center">
                    <Link href="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link>

                    <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">Categories</Link>
                    <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>

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
                            <Link href="/login" className="hover:text-primary transition-colors">Sign In</Link>
                            <Link href="/register" className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    )}

                    <Link href="/cart" className="hover:text-primary transition-colors relative group">
                        <span className="sr-only">Cart</span>
                        <div className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </Link>
                </div>

                {/* Mobile Right Icons (Cart + Theme Toggle) */}
                <div className="flex md:hidden items-center gap-4">
                    <Link href="/cart" className="relative text-gray-400 hover:text-white">
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-[8px] font-bold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
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
