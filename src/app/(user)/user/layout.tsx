import { UserSidebar } from "@/components/user/UserSidebar"

export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <UserSidebar />

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 min-h-[600px] shadow-sm">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
