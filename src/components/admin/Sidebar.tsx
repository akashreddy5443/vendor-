'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Users, Settings, Image as ImageIcon, FileText, Palette, Mail, ShoppingCart, FolderTree, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Media', href: '/admin/media', icon: ImageIcon },
    { label: 'Homepage', href: '/admin/homepage', icon: Home },
    { label: 'Pages', href: '/admin/pages', icon: FileText },
    { label: 'Site Layout', href: '/admin/layout-site', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
]

import { ExternalLink } from 'lucide-react'

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 flex-shrink-0 border-r border-gray-800 bg-black text-white">
            <div className="flex h-16 items-center border-b border-gray-800 px-6">
                <h1 className="text-xl font-bold tracking-tight text-orange-500">TechDev Admin</h1>
            </div>
            <nav className="space-y-1 p-4">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-orange-600 text-white"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <div className="mt-auto border-t border-gray-800 p-4">
                <Link
                    href="/admin/subscribers"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white ${pathname === '/admin/subscribers' ? 'bg-zinc-800 text-white' : 'text-gray-400'}`}
                >
                    <Mail className="h-5 w-5" />
                    Subscribers
                </Link>
            </div>
        </aside>
    )
}
