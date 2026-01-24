'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, User, MapPin, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'My Orders', href: '/user/orders', icon: Package },
    { name: 'Profile Settings', href: '/user/settings', icon: User },
    { name: 'Addresses', href: '/user/addresses', icon: MapPin },
]

export function UserSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col gap-2 w-full md:w-64 shrink-0">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <div className="font-bold text-lg mb-4 px-2">My Account</div>
                <nav className="flex flex-col gap-1">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-orange-600/10 text-orange-500'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        )
                    })}
                    <button
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/10 hover:text-red-300 mt-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </nav>
            </div>
        </div>
    )
}
