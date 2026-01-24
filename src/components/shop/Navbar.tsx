'use client'

import { SpotlightSearch } from '@/components/ui/SpotlightSearch'

// ... existing imports

export function Navbar() {
    // ... existing code

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

            <nav className="flex h-16 items-center justify-between border-b border-gray-800 bg-black px-6 text-white sticky top-0 z-40">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-orange-500">
                        <ShoppingBag />
                        TechDev Store
                    </Link>
                    <SpotlightSearch />
                </div>

                <div className="flex gap-6 text-sm font-medium text-gray-300 items-center">
                    <Link href="/products" className="hover:text-white transition-colors">Products</Link>
                    <Link href="/cart" className="hover:text-white transition-colors relative group">
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
                </div>
            </nav>
        </div>
    )
}
