'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ShoppingCart, Heart, User, Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
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

            // Hardcoded fallback if DB is empty (ensures UI always looks good)
            const STATIC_CATEGORIES = [
                { id: 'laptops', name: 'Laptops', slug: 'laptops', icon: '💻' },
                { id: 'accessories', name: 'Accessories', slug: 'accessories', icon: '🎧' },
                { id: 'monitors', name: 'Monitors', slug: 'monitors', icon: '🖥️' },
                { id: 'keyboards', name: 'Keyboards', slug: 'keyboards', icon: '⌨️' },
                { id: 'mice', name: 'Mice', slug: 'mice', icon: '🖱️' },
                { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', icon: '📱' },
            ]

            if (cats && cats.length > 0) {
                setCategories(cats)
            } else {
                setCategories(STATIC_CATEGORIES)
            }

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

            <nav className="flex h-16 items-center border-b border-white/5 bg-white/70 backdrop-blur-xl px-6 text-foreground sticky top-0 z-40 shadow-[0_2px_15px_-3px_rgba(59,130,246,0.08)] relative gap-8 transition-all duration-500">
                {/* Left: Logo & Navigation */}
                <div className="flex items-center gap-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-slate-500 hover:text-blue-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>

                        <Link href="/" className="flex items-center gap-2 text-2xl font-heading font-black tracking-tighter text-slate-900 group">
                            {settings?.logo_url ? (
                                <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
                            ) : (
                                <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-all duration-500">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                            )}
                            <span className="hidden min-[370px]:inline group-hover:text-blue-600 transition-colors duration-300">{settings?.site_name || 'TechDev'}</span>
                        </Link>
                    </div>

                    {/* Navigation Links (Desktop) - Enhanced with "Life" animations */}
                    <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
                        <Link href="/" className="hover:text-blue-600 transition-all hover:translate-y-[-1px] active:scale-95 transform">Home</Link>

                        {/* Mega Menu Trigger */}
                        <div className="group relative h-16 flex items-center">
                            <button className="hover:text-blue-600 transition-all hover:translate-y-[-1px] py-6 font-black flex items-center gap-1 group-hover:text-blue-600">
                                Categories <ChevronDown className="h-3 w-3 transition-transform duration-500 group-hover:rotate-180" />
                            </button>

                            {/* Premium Dropdown - Glassmorphism Refresh */}
                            <div className="absolute top-[calc(100%-4px)] left-0 w-[800px] bg-white/80 backdrop-blur-3xl border border-white/20 shadow-[0_20px_50px_-12px_rgba(59,130,246,0.15)] rounded-3xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 p-1 overflow-hidden z-50 ring-1 ring-blue-500/5">
                                <div className="flex bg-white/40 rounded-[1.4rem] overflow-hidden">
                                    {/* Column 1: Categories Grid */}
                                    <div className="w-2/3 p-10 grid grid-cols-2 gap-x-10 gap-y-6">
                                        <h3 className="col-span-2 text-[9px] font-black uppercase tracking-[0.25em] text-blue-600/40 mb-2">Shop by Category</h3>
                                        {categories.length > 0 ? categories.map(cat => (
                                            <Link
                                                key={cat.id}
                                                href={`/search?category=${cat.slug || cat.id}`}
                                                className="flex items-center gap-4 group/item"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-blue-50/50 flex items-center justify-center text-xl group-hover/item:scale-110 group-hover/item:shadow-blue-500/10 group-hover/item:border-blue-200 transition-all duration-500">
                                                    {cat.icon || '🛍️'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-heading font-black text-sm text-slate-900 group-hover/item:text-blue-600 transition-colors uppercase tracking-tight">{cat.name}</span>
                                                    <span className="text-[10px] font-medium text-slate-400 group-hover/item:text-slate-500">Explore Collection</span>
                                                </div>
                                            </Link>
                                        )) : (
                                            <div className="col-span-2 text-sm text-gray-400 py-4 italic">No categories found.</div>
                                        )}
                                    </div>

                                    {/* Column 2: Featured / Promo */}
                                    <div className="w-1/3 bg-blue-600 text-white p-10 flex flex-col justify-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                                        <div className="relative z-10 space-y-4">
                                            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">Winter Drop</span>
                                            <h3 className="text-3xl font-heading font-black leading-none tracking-tighter">ProDev<br />Series 2026</h3>
                                            <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all">
                                                Discover <ArrowRight className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/products" className="hover:text-blue-600 transition-all hover:translate-y-[-1px] active:scale-95 transform">Explore</Link>
                        <Link href="/about" className="hover:text-blue-600 transition-all hover:translate-y-[-1px] active:scale-95 transform">Our Story</Link>
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
