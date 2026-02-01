'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ShoppingCart, Heart, User, Menu, X, ChevronDown, ArrowRight, Search } from 'lucide-react'
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

            if (cats) {
                setCategories(cats)
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

            <nav className="flex h-16 items-center border-b border-slate-100 bg-white/80 backdrop-blur-2xl px-6 md:px-12 text-foreground sticky top-0 z-40 shadow-[0_4px_30px_-10px_rgba(45,92,247,0.15)] gap-8 transition-all duration-500">
                {/* Vibrant Identity Line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-indigo-500 to-indigo-600 z-50" />

                {/* Left: Logo & Navigation */}
                <div className="flex items-center gap-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-slate-500 hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>

                        <Link href="/" className="flex items-center gap-2 text-2xl font-heading font-black tracking-tighter text-slate-900 group">
                            {settings?.logo_url ? (
                                <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
                            ) : (
                                <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30 group-hover:rotate-6 transition-all duration-500">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                            )}
                            <span className="hidden min-[370px]:inline group-hover:text-primary transition-colors duration-300">{settings?.site_name || 'TechDev'}</span>
                        </Link>
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <Link href="/" className="hover:text-primary transition-all hover:translate-y-[-1px] active:scale-95 transform">Home</Link>

                        {/* Mega Menu Trigger */}
                        <div className="group relative h-16 flex items-center">
                            <button className="hover:text-primary transition-all hover:translate-y-[-1px] py-6 font-black flex items-center gap-1 group-hover:text-primary">
                                Catalog <ChevronDown className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
                            </button>

                            {/* Dropdown Backdrop Shim - To prevent closing when moving between button and menu */}
                            <div className="absolute top-16 left-0 w-full h-4 bg-transparent invisible group-hover:visible" />

                            {/* Premium Dropdown */}
                            <div className="absolute top-[calc(100%-4px)] left-0 w-[840px] bg-white/70 backdrop-blur-3xl border border-white/40 shadow-[0_40px_80px_-15px_rgba(45,92,247,0.15)] rounded-[2.5rem] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 transform translate-y-6 group-hover:translate-y-0 p-1.5 z-50 ring-1 ring-primary/5">
                                <div className="flex bg-white/40 rounded-[2.2rem] overflow-hidden">
                                    {/* Column 1: Categories */}
                                    <div className="w-2/3 p-12 grid grid-cols-2 gap-x-12 gap-y-8">
                                        <h3 className="col-span-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-50">Industrial Categories</h3>
                                        {categories.map(cat => (
                                            <Link
                                                key={cat.id}
                                                href={`/products?category=${cat.slug || cat.id}`}
                                                className="flex items-center gap-5 group/item cursor-pointer"
                                            >
                                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100/50 flex items-center justify-center text-2xl group-hover/item:scale-110 group-hover/item:shadow-primary/10 group-hover/item:border-primary/20 transition-all duration-700">
                                                    {cat.icon || '🛍️'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-heading font-black text-base text-slate-900 group-hover/item:text-primary transition-colors tracking-tight leading-none mb-1">{cat.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 group-hover/item:text-slate-500 uppercase tracking-widest">In Stock</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {/* Column 2: Promo */}
                                    <div className="w-1/3 bg-gradient-to-br from-primary to-indigo-900 text-white p-10 flex flex-col justify-center relative overflow-hidden">
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

                        <Link href="/products" className="hover:text-primary transition-all hover:translate-y-[-1px] active:scale-95 transform">Explore</Link>
                        <Link href="/about" className="hover:text-primary transition-all hover:translate-y-[-1px] active:scale-95 transform">Our Story</Link>
                    </div>
                </div>

                {/* Middle: Centered Search */}
                <div className="hidden md:flex flex-1 max-w-xl mx-auto items-center justify-center">
                    <SpotlightSearch variant="default" />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4 md:gap-6 shrink-0">
                    {/* Mobile Search Icon */}
                    {/* Mobile Search Icon */}
                    <div className="flex md:hidden">
                        <SpotlightSearch variant="icon" />
                    </div>

                    <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
                        {user ? (
                            <Link href="/user" className="hidden md:flex flex-col items-center text-xs font-medium text-slate-500 hover:text-primary transition-colors">
                                <User className="h-5 w-5 mb-0.5 text-primary" />
                            </Link>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 text-sm font-black text-primary hover:text-primary/80 transition-colors bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                                <User className="h-4 w-4 shrink-0" />
                                <span className="uppercase tracking-widest text-[9px]">Sign In</span>
                            </Link>
                        )}

                        <Link href="/user/wishlist" className="hidden md:flex flex-col items-center text-xs font-medium text-slate-500 hover:text-primary transition-colors">
                            <Heart className="h-5 w-5 mb-0.5" />
                        </Link>

                        <Link href="/cart" className="relative flex flex-col items-center text-xs font-medium text-slate-500 hover:text-primary transition-colors">
                            <div className="relative">
                                <ShoppingCart className="h-5 w-5 mb-0.5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-lg shadow-primary/20">
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
                <div className="lg:hidden fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-xl border-t border-slate-100 p-8 flex flex-col gap-8 animate-in slide-in-from-top-10 pb-24 overflow-y-auto">
                    <div className="flex flex-col gap-6 text-xl font-black font-heading uppercase tracking-tight text-slate-900">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>All Products</Link>
                        <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
                        <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>Our Legacy</Link>
                    </div>

                    <div className="border-t border-slate-100 pt-8 flex flex-col gap-6">
                        {user ? (
                            <>
                                <Link href="/user/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-slate-600 font-bold">
                                    <Heart className="h-6 w-6" /> Favorites
                                </Link>
                                <Link href="/user" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-slate-600 font-bold">
                                    <User className="h-6 w-6" /> Private Vault
                                </Link>
                            </>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-4 rounded-2xl bg-slate-50 text-slate-900 font-black tracking-widest text-[10px]">
                                    Sign In
                                </Link>
                                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-4 rounded-2xl bg-primary text-white font-black tracking-widest text-[10px] shadow-lg shadow-primary/20">
                                    Join the Hub
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
