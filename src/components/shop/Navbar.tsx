'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ShoppingCart, Heart, User, Menu, X, ChevronDown, ArrowRight, Search, ChevronRight } from 'lucide-react'
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
    const [catalogSection, setCatalogSection] = useState<any>(null) // Dynamic Catalog Data

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

            // Fetch Catalog Menu Settings
            const { data: catalogData } = await supabase
                .from('homepage_sections')
                .select('content_json')
                .eq('section_type', 'catalog_menu')
                .single()

            if (catalogData) setCatalogSection(catalogData.content_json)

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

    // Dynamic Catalog Content with Fallback
    const catalogContent = catalogSection || {
        badge: "New Arrival",
        title: "Summer Tech Collection",
        subtitle: "Upgrade your setup today.",
        link: "/products",
        linkText: "Shop Now",
        background_url: "",
        text_color: "#0F172A"
    }

    return (
        <div className="flex flex-col w-full relative z-40">
            {/* Announcement Bar */}
            {(!loading && showAnnouncement) || true ? (
                <div className="bg-blue-600 text-white text-[10px] font-bold py-2.5 overflow-hidden relative z-50 tracking-wider">
                    <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] w-max">
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className="mx-12 inline-block uppercase tracking-widest select-none opacity-90">
                                {link && link !== '#' ? (
                                    <Link href={link} className="hover:text-white transition-colors hover:underline underline-offset-4">
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

            {/* Main Navigation - Modern Minimalist */}
            <nav className="flex h-20 items-center border-b border-slate-200 bg-white/95 backdrop-blur-3xl px-6 md:px-10 text-foreground sticky top-0 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 z-40">

                {/* Left: Brand & Nav */}
                <div className="flex items-center h-full">
                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden text-slate-900 hover:text-blue-600 transition-colors mr-4"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group mr-8">
                        {settings?.logo_url ? (
                            <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-8 w-auto object-contain" />
                        ) : (
                            <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-md hover:shadow-blue-500/30 transition-all">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        )}
                        <span className="text-xl font-heading font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">
                            {settings?.site_name || 'TechDev'}
                        </span>
                    </Link>

                    {/* Vertical Divider */}
                    <div className="hidden lg:block w-px h-8 bg-slate-200 mr-8" />

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                        <Link href="/" className="hover:text-blue-600 transition-colors py-8 border-b-2 border-transparent hover:border-blue-600">
                            Home
                        </Link>

                        {/* Mega Menu Trigger */}
                        <div className="group relative h-20 flex items-center">
                            <button className="hover:text-blue-600 transition-colors py-8 border-b-2 border-transparent group-hover:border-blue-600 flex items-center gap-1.5">
                                Catalog <ChevronDown className="h-3 w-3 mt-0.5 transition-transform duration-300 group-hover:rotate-180 opacity-50" />
                            </button>

                            {/* Dropdown Shim */}
                            <div className="absolute top-20 left-0 w-full h-1 bg-transparent invisible group-hover:visible" />

                            {/* Minimalist Dropdown - Expanded Width */}
                            <div className="absolute top-full -left-10 w-[800px] bg-white border border-slate-100 shadow-xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-6 z-50">
                                <div className="flex gap-8">
                                    {/* Column 1: Categories (20%) */}
                                    <div className="w-[180px] shrink-0">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Browse By</h3>
                                        <div className="flex flex-col gap-1">
                                            {categories.slice(0, 8).map(cat => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/products?category=${cat.slug || cat.id}`}
                                                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors group/item"
                                                >
                                                    {cat.name}
                                                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-transform text-blue-600" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Column 2: Popular Brands (30%) */}
                                    <div className="w-[240px] shrink-0 border-l border-slate-50 pl-8">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Popular Brands</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {catalogContent.brands?.slice(0, 8).map((brand: any, i: number) => (
                                                <Link
                                                    key={i}
                                                    href={brand.link || '#'}
                                                    className="aspect-[4/3] bg-slate-50 rounded-xl flex items-center justify-center p-4 border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all group/brand"
                                                >
                                                    {brand.logo ? (
                                                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover/brand:opacity-100 transition-opacity" />
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-slate-400">{brand.name || 'Brand'}</span>
                                                    )}
                                                </Link>
                                            ))}
                                            {(!catalogContent.brands || catalogContent.brands.length === 0) && (
                                                <div className="col-span-2 text-xs text-slate-400 italic py-4">
                                                    Add brands in Admin &gt; Homepage
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Column 3: Dynamic Promo Card (Remaining) */}
                                    <div className="flex-1 border-l border-slate-50 pl-8">
                                        <div
                                            className="h-full rounded-2xl p-6 flex flex-col justify-end items-start group/ad cursor-pointer hover:shadow-xl transition-all relative overflow-hidden"
                                            style={{
                                                backgroundColor: catalogContent.background_url ? 'transparent' : '#F8FAFC',
                                                color: catalogContent.text_color || '#0F172A'
                                            }}
                                        >
                                            {/* Background Image */}
                                            {catalogContent.background_url && (
                                                <>
                                                    <img
                                                        src={catalogContent.background_url}
                                                        alt="Promo"
                                                        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover/ad:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                                                </>
                                            )}

                                            <div className="relative z-20 w-full mb-2">
                                                <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg mb-3 shadow-sm ${catalogContent.background_url ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}>
                                                    {catalogContent.badge}
                                                </span>
                                                <h4 className="font-heading font-black text-2xl mb-2 leading-tight drop-shadow-sm">
                                                    {catalogContent.title}
                                                </h4>
                                                <p className={`text-sm mb-6 max-w-[90%] font-medium ${catalogContent.background_url ? 'text-white/90' : 'text-slate-500'}`}>
                                                    {catalogContent.subtitle}
                                                </p>
                                                <Link href={catalogContent.link || '#'} className={`inline-flex h-10 px-6 rounded-full items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${catalogContent.background_url ? 'bg-white text-slate-900 hover:bg-blue-50' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                                                    {catalogContent.linkText} <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/products" className="hover:text-blue-600 transition-colors py-8 border-b-2 border-transparent hover:border-blue-600">
                            Explore
                        </Link>
                        <Link href="/about" className="hover:text-blue-600 transition-colors py-8 border-b-2 border-transparent hover:border-blue-600">
                            Our Story
                        </Link>
                    </div>
                </div>

                {/* Center: Search Island */}
                <div className="hidden md:flex flex-1 items-center justify-center px-8">
                    <div className="w-full max-w-[480px] group relative z-10">
                        <div className="relative transform group-hover:scale-[1.01] transition-transform duration-300">
                            <InstantSearch />
                        </div>
                    </div>
                </div>

                {/* Right: Action Capsule */}
                <div className="flex items-center justify-end shrink-0 ml-auto">
                    <div className="flex items-center gap-1 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300">
                        {/* User */}
                        {user ? (
                            <Link href="/user" className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors" title="My Account">
                                <User className="h-4 w-4" />
                            </Link>
                        ) : (
                            <Link href="/login" className="px-4 h-9 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors text-[11px] font-bold uppercase tracking-wider bg-slate-50" title="Sign In">
                                Sign In
                            </Link>
                        )}

                        <div className="w-px h-4 bg-slate-200 mx-1"></div>

                        {/* Wishlist */}
                        <Link href="/user/wishlist" className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors" title="Wishlist">
                            <Heart className="h-4 w-4" />
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="w-9 h-9 rounded-full flex items-center justify-center text-slate-900 hover:text-blue-600 hover:bg-blue-50 transition-colors relative" title="Cart">
                            <ShoppingCart className="h-4 w-4" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-0 z-[100] bg-white flex flex-col animate-in slide-in-from-left duration-200">
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 h-20">
                        <span className="text-lg font-heading font-black text-slate-900 tracking-tight">Menu</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="h-6 w-6 text-slate-900" />
                        </button>
                    </div>

                    <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                        <nav className="flex flex-col gap-2">
                            {['Home', 'Products', 'Categories', 'About us'].map((item) => (
                                <Link
                                    key={item}
                                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-slate-900 py-3 border-b border-slate-50 hover:text-blue-600 hover:pl-2 transition-all"
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto pt-8 flex gap-4">
                            {!user ? (
                                <>
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-900 text-center font-bold rounded-xl text-sm">
                                        Log In
                                    </Link>
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-3 bg-blue-600 text-white text-center font-bold rounded-xl text-sm shadow-lg shadow-blue-500/20">
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <Link href="/user" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 bg-slate-900 text-white text-center font-bold rounded-xl text-sm">
                                    My Account
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
