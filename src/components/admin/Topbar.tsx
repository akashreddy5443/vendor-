import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Menu } from 'lucide-react'

interface AdminTopbarProps {
    onSidebarToggle?: () => void
}

export function AdminTopbar({ onSidebarToggle }: AdminTopbarProps) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onSidebarToggle}
                    className="md:hidden text-gray-500 hover:text-gray-900"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="text-sm text-gray-500">
                    Welcome back, <span className="text-gray-900 font-medium">Admin</span>
                </div>
            </div>
            <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
                <LogOut className="h-4 w-4" />
                Sign out
            </button>
        </header>
    )
}
