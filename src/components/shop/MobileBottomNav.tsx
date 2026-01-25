'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export function MobileBottomNav() {
    const pathname = usePathname()
    const { cartCount } = useCart()

    // Hide on admin routes or if hidden by other logic
    if (pathname.startsWith('/admin')) return null

    const navItems = [
        { label: 'Home', href: '/', icon: Home },
        { label: 'Search', href: '/search', icon: Search },
        { label: 'Wishlist', href: '/user/wishlist', icon: Heart },
        { label: 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
        { label: 'Profile', href: '/user', icon: User },
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <div className="relative">
                                <item.icon className="h-5 w-5" />
                                {item.badge ? (
                                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
