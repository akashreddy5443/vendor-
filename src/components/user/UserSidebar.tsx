'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Heart, Settings, LogOut, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
    { label: 'Overview', href: '/user', icon: LayoutDashboard },
    { label: 'My Orders', href: '/user/orders', icon: ShoppingBag },
    { label: 'Wishlist', href: '/user/wishlist', icon: Heart },
    { label: 'Addresses', href: '/user/settings', icon: MapPin }, // Using settings for now or dedicated address page
    { label: 'Settings', href: '/user/settings', icon: Settings },
]

export function UserSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <aside className="w-full lg:w-64 flex-shrink-0 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 h-fit">
            <div className="mb-6 px-4">
                <h2 className="text-lg font-bold text-white">My Account</h2>
            </div>
            <nav className="space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20"
                                    : "text-gray-400 hover:bg-zinc-800 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-500 group-hover:text-white")} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-8 border-t border-zinc-800 pt-4 px-2">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
