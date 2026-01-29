'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Users, Settings, Image as ImageIcon, FileText, Palette, Mail, ShoppingCart, FolderTree, Home, Bell, Tag } from 'lucide-react'
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
    { label: 'About Page', href: '/admin/settings/about', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
    { label: 'Notifications', href: '/admin/settings/notifications', icon: Bell },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
]

import { ExternalLink } from 'lucide-react'

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname()

    return (
    return (
        <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white text-gray-900 h-full">
            <div className="flex h-16 items-center border-b border-gray-200 px-6">
                <h1 className="text-xl font-bold tracking-tight text-blue-600">TechDev Admin</h1>
            </div>
            <nav className="space-y-1 p-4">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-gray-400")} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <div className="mt-auto border-t border-gray-200 p-4">
                <Link
                    href="/admin/subscribers"
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 ${pathname === '/admin/subscribers' ? 'bg-zinc-100 text-gray-900' : 'text-gray-500'}`}
                >
                    <Mail className="h-5 w-5" />
                    Subscribers
                </Link>
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    <ExternalLink className="h-5 w-5" />
                    Open Live Site
                </Link>
            </div>
        </aside>
    )
}
