import { UserSidebar } from '@/components/user/UserSidebar'

export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-black text-white min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold font-serif mb-8">Dashboard</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    <UserSidebar />
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
