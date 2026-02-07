'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ShoppingCart, Heart, User, Menu, X, ChevronDown, ArrowRight, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/context/CartContext'
import { SpotlightSearch } from '@/components/ui/SpotlightSearch'
import { InstantSearch } from '@/components/shop/InstantSearch'

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
        <div className="flex flex-col w-full relative z-40">
            {/* TIER 1: Announcement Bar */}
            {(!loading && showAnnouncement) || true ? (
                <div className="bg-blue-600 text-white text-[10px] font-bold py-2 overflow-hidden relative z-50 tracking-wider">
                    <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] w-max">
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className="mx-12 inline-block uppercase tracking-widest select-none">
                                {link && link !== '#' ? (
                                    <Link href={link} className="hover:text-white/80 transition-colors">
                                        {text || "WELCOME TO TECHDEV STORE! FREE SHIPPING ON ORDERS OVER ₹2000"}
                                    </Link>
                                ) : (
                                    <span>{text || "WELCOME TO TECHDEV STORE! FREE SHIPPING ON ORDERS OVER ₹2000"}</span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            ) : null}

            {/* TIER 2: Utility Bar (New) */}
            <div className="hidden lg:flex h-9 bg-[#0f172a] text-slate-300 text-[10px] font-medium tracking-wide border-b border-white/5 px-12 items-center justify-between">
                <div className="flex items-center gap-6">
                    <span className="hover:text-white cursor-pointer transition-colors">Indias's Tech Hub</span>
                    <span className="w-px h-3 bg-white/20"></span>
                    <span className="hover:text-white cursor-pointer transition-colors">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-6 uppercase tracking-wider font-bold">
                    <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
                    <Link href="/track-order" className="hover:text-white transition-colors">Order Status</Link>
                    {!user && (
                        <Link href="/login" className="hover:text-white transition-colors text-blue-400">Sign In</Link>
                    )}
                </div>
            </div>

            {/* TIER 3: Main Navigation */}
            <nav className="flex h-20 items-center border-b border-slate-100 bg-white/95 backdrop-blur-3xl px-6 md:px-12 text-foreground sticky top-0 shadow-sm gap-8 transition-all duration-500 z-40">
                {/* Left: Logo & Mobile Menu */}
                <div className="flex items-center gap-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-slate-900 hover:text-blue-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>

                        <Link href="/" className="flex items-center gap-2.5 group">
                            {settings?.logo_url ? (
                                <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
                            ) : (
                                <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-all duration-500">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-xl font-heading font-black tracking-tighter text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                                    {settings?.site_name || 'TechDev'}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 group-hover:text-blue-400 transition-colors leading-none mt-0.5">
                                    Store
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.15em] text-slate-600">
                        <Link href="/" className="hover:text-blue-600 transition-all hover:-translate-y-0.5 relative group">
                            Home
                            <span className="absolute -bottom-8 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </Link>

                        {/* Mega Menu Trigger */}
                        <div className="group relative h-20 flex items-center">
                            <button className="hover:text-blue-600 transition-all hover:-translate-y-0.5 font-black flex items-center gap-1 group-hover:text-blue-600">
                                Catalog <ChevronDown className="h-3 w-3 mt-0.5 transition-transform duration-300 group-hover:rotate-180 text-slate-400 group-hover:text-blue-600" />
                            </button>

                            {/* Dropdown Backdrop Shim */}
                            <div className="absolute top-20 left-0 w-full h-4 bg-transparent invisible group-hover:visible" />

                            {/* Premium Dropdown */}
                            <div className="absolute top-[calc(100%-4px)] -left-4 w-[900px] bg-white/80 backdrop-blur-3xl border border-white/60 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.15)] rounded-3xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 p-2 z-50 ring-1 ring-slate-900/5">
                                <div className="flex bg-white/50 rounded-[1.2rem] overflow-hidden min-h-[400px]">
                                    {/* Sidebar: Categories */}
                                    <div className="w-64 bg-slate-50/50 border-r border-slate-100 p-6 flex flex-col gap-2">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-3">Departments</h3>
                                        {categories.slice(0, 6).map(cat => (
                                            <Link
                                                key={cat.id}
                                                href={`/products?category=${cat.slug || cat.id}`}
                                                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm hover:shadow-slate-200/50 group/item transition-all duration-300"
                                            >
                                                <span className="font-bold text-slate-600 text-sm group-hover/item:text-blue-600">{cat.name}</span>
                                                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-blue-600" />
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Content Area */}
                                    {/* Column 2: Featured */}
                                    <div className="flex-1 p-8 grid grid-cols-2 gap-8">
                                        <div className="col-span-2">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Trending Now</h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                {/* Mock Featured Items - Replace with real data later */}
                                                {[1, 2].map((i) => (
                                                    <Link key={i} href="/products" className="group/card flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100">
                                                        <div className="w-20 h-20 rounded-lg bg-slate-100 group-hover/card:bg-blue-50 transition-colors flex items-center justify-center text-2xl">
                                                            {i === 1 ? '🎧' : '⌨️'}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 group-hover/card:text-blue-600 mb-1">Premium Gear {i}</h4>
                                                            <p className="text-xs text-slate-500 mb-2 line-clamp-2">High performance equipment for professionals.</p>
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Shop Now</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3: Promo Banner */}
                                    <div className="w-72 bg-slate-900 text-white p-8 flex flex-col justify-end relative overflow-hidden group/promo cursor-pointer">
                                        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover/promo:opacity-20 transition-opacity duration-700 mix-blend-overlay" />
                                        <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover/promo:scale-110 transition-transform duration-700" />
                                        <div className="relative z-10">
                                            <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">New Arrival</span>
                                            <h3 className="text-2xl font-heading font-black leading-tight mb-2">Cyber Config<br />2026</h3>
                                            <p className="text-xs text-slate-300 font-medium mb-6">Experience the next generation of computing power.</p>
                                            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:gap-4 transition-all">
                                                Explore <ArrowRight className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/products" className="hover:text-blue-600 transition-all hover:-translate-y-0.5 relative group">
                            Explore
                            <span className="absolute -bottom-8 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </Link>
                        <Link href="/about" className="hover:text-blue-600 transition-all hover:-translate-y-0.5 relative group">
                            Our Story
                            <span className="absolute -bottom-8 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </Link>
                    </div>
                </div>

                {/* Middle: Centered Search */}
                <div className="hidden md:flex flex-1 max-w-xl mx-auto items-center justify-center px-8">
                    <InstantSearch />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 md:gap-4 shrink-0">
                    <div className="flex bg-slate-50 rounded-full p-1.5 border border-slate-100/80">
                        {user ? (
                            <Link href="/user" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-md transition-all group relative">
                                <User className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                            </Link>
                        ) : (
                            <Link href="/login" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-md transition-all">
                                <User className="h-5 w-5" />
                            </Link>
                        )}

                        <Link href="/user/wishlist" className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-slate-500 hover:bg-white hover:text-red-500 hover:shadow-md transition-all">
                            <Heart className="h-5 w-5" />
                        </Link>

                        <Link href="/cart" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-md transition-all relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown (Unchanged Logic, just wrapper if needed) */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-0 z-[100] bg-white flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <span className="text-xl font-heading font-black text-slate-900">Menu</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                            <X className="h-6 w-6 text-slate-900" />
                        </button>
                    </div>

                    <div className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto">
                        <div className="flex flex-col gap-6 text-2xl font-heading font-black text-slate-900">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>Catalog</Link>
                            <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
                            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
                        </div>

                        <div className="border-t border-slate-100 pt-8 flex flex-col gap-4">
                            <Link href="/help" className="flex items-center justify-between font-bold text-slate-500">
                                Help Center <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/track" className="flex items-center justify-between font-bold text-slate-500">
                                Track Order <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="p-8 border-t border-slate-100 bg-slate-50">
                        {!user ? (
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-4 bg-blue-600 text-white text-center font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20">
                                Sign In / Join
                            </Link>
                        ) : (
                            <Link href="/user" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-4 bg-slate-900 text-white text-center font-black uppercase tracking-widest rounded-xl">
                                My Account
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
