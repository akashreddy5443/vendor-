'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function AdminTopbar() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-black px-6">
            <div className="text-sm text-gray-400">
                Welcome back, <span className="text-white">Admin</span>
            </div>
            <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
                <LogOut className="h-4 w-4" />
                Sign out
            </button>
        </header>
    )
}
