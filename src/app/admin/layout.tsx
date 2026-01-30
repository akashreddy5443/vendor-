import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Double-check role on the server side (Defense in Depth)
    const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userProfile?.role !== 'admin') {
        redirect('/')
    }

    return (
        <AdminLayoutShell>
            {children}
        </AdminLayoutShell>
    )
}
