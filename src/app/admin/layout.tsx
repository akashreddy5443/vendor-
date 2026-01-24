import { AdminSidebar } from '@/components/admin/Sidebar'
import { AdminTopbar } from '@/components/admin/Topbar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-gray-950 text-white">
            <AdminSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminTopbar />
                <main className="flex-1 overflow-y-auto p-8 text-black">
                    {/* text-black reset for now, assuming pages will handle their own coloring or we use dark mode consistently. 
             Actually, let's keep it dark mode friendly base */}
                    <div className="text-white h-full">{children}</div>
                </main>
            </div>
        </div>
    )
}
