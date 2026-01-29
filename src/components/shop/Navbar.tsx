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
    const [categories, setCategories] = useState<any[]>([])
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

            // Fetch Categories (for Mega Menu)
            const { data: cats } = await supabase
                .from('categories')
                .select('id, name, slug, icon')
                .limit(10)
            if (cats) setCategories(cats)

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
                <div className="bg-[#0B1026] text-white text-[11px] font-bold py-2 overflow-hidden relative z-50">
                    <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] w-max">
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className="mx-8 inline-block uppercase tracking-widest select-none">
                                {link && link !== '#' ? (
                                    <Link href={link} className="hover:text-blue-200 transition-colors">
                                        {text}
                                    </Link>
                                ) : (
                                    <span>{text}</span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <nav className="flex h-16 items-center border-b border-white/10 bg-background/80 backdrop-blur-md px-6 text-foreground sticky top-0 z-40 shadow-sm relative gap-8 transition-all duration-300">
                {/* Left: Logo & Navigation */}
                <div className="flex items-center gap-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-muted-foreground hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>

                        <Link href="/" className="flex items-center gap-2 text-2xl font-heading font-bold tracking-tight text-foreground group">
                            {settings?.logo_url ? (
                                <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-8 w-auto object-contain" />
                            ) : (
                                <div className="bg-primary text-primary-foreground p-1.5 rounded-xl shadow-lg shadow-blue-500/20">
                                    <ShoppingBag className="h-6 w-6" />
                                </div>
                            )}
                            <span className="hidden min-[370px]:inline group-hover:text-primary transition-colors">{settings?.site_name || 'TechDev'}</span>
                        </Link>
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
                        <Link href="/" className="text-foreground/70 hover:text-primary transition-colors font-heading hover:scale-105 transform duration-200">Home</Link>

                        {/* Mega Menu Trigger */}
                        <div className="group relative h-16 flex items-center">
                            <Link href="/categories" className="text-foreground/70 hover:text-primary transition-colors py-6 font-heading flex items-center gap-1">
                                Categories <span className="text-[10px] opacity-50">▼</span>
                            </Link>

                            {/* Premium Dropdown */}
                            <div className="absolute top-full left-0 w-[800px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-2 p-0 overflow-hidden z-50 ring-1 ring-black/5">
                                <div className="flex">
                                    {/* Column 1: Categories Grid */}
                                    <div className="w-2/3 p-8 grid grid-cols-2 gap-x-8 gap-y-4 bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800/50">
                                        <h3 className="col-span-2 text-xs font-bold uppercase tracking-widest text-[#191970]/50 dark:text-white/40 mb-2">Shop by Category</h3>
                                        {categories.map(cat => (
                                            <Link
                                                key={cat.id}
                                                href={`/search?category=${cat.slug || cat.id}`}
                                                className="flex items-center gap-4 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group/item border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg shadow-inner group-hover/item:scale-110 transition-transform">
                                                    {cat.icon || '🛍️'}
                                                </div>
                                                <span className="font-heading font-semibold text-sm text-foreground group-hover/item:translate-x-1 transition-transform">{cat.name}</span>
                                            </Link>
                                        ))}
                                        <Link href="/categories" className="col-span-2 mt-4 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 hover:underline">
                                            View All Categories →
                                        </Link>
                                    </div>

                                    {/* Column 2: Featured / Promo */}
                                    <div className="w-1/3 bg-[#191970] text-white p-8 flex flex-col justify-between relative overflow-hidden">
                                        {/* Abstract BG Shapes */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                                        <div className="relative z-10">
                                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/10">New Arrival</span>
                                            <h3 className="text-2xl font-heading font-bold leading-tight mb-2">ProDev Gear 2026</h3>
                                            <p className="text-white/70 text-sm mb-6">Upgrade your setup with the latest mechanical keyboards and ergonomic mice.</p>
                                            <Link href="/products" className="inline-block px-6 py-2 bg-white text-[#191970] rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg">
                                                Shop Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/products" className="text-foreground/70 hover:text-primary transition-colors font-heading hover:scale-105 transform duration-200">Products</Link>
                        <Link href="/about" className="text-foreground/70 hover:text-primary transition-colors font-heading hover:scale-105 transform duration-200">About</Link>
                    </div>
                </div>

                {/* Middle: Expanding Search Bar */}
                <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
                    <SpotlightSearch />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4 shrink-0 ml-auto md:ml-0">
                    {/* Mobile Search Icon (visible only on mobile) */}
                    <div className="md:hidden">
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
