'use client'

import { useState } from 'react'
import { AdminSidebar } from './Sidebar'
import { AdminTopbar } from './Topbar'
import { Menu } from 'lucide-react'

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen w-full bg-gray-950 text-white">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <AdminSidebar />
            </div>

            {/* Mobile Sidebar (Overlay) */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />

                    {/* Sidebar Content */}
                    <div className="relative h-full w-64 bg-black shadow-xl animate-in slide-in-from-left duration-200">
                        <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminTopbar onSidebarToggle={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-8 text-black bg-white">
                    <div className="text-black h-full">{children}</div>
                </main>
            </div>
        </div>
    )
}
