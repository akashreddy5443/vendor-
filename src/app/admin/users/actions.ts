'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { createClient as createServerClient } from '@/lib/supabase/server'

// Note: To delete a user from Auth, we need the SERVICE_ROLE_KEY.
// The standard server client only has the user's context or anon key.
// We must verify the requester is an admin first.

export async function deleteUser(userId: string) {
    const supabase = await createServerClient()

    // 1. Verify Admin (Security Check)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: requesterData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (requesterData?.role !== 'admin') {
        return { error: 'Unauthorized: Only admins can delete users' }
    }

    // 2. Perform Deletion
    // We need the Service Role Key to delete from auth.users
    const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    // Delete from Auth (this should Cascade to public.users if set up, or we assume separate delete)
    // Actually, usually we delete from Auth and foreign keys handle the rest if defined with ON DELETE CASCADE.
    // If not, we might need to delete from public.users first or after.
    // Let's try deleting from Auth first.

    // Safety check: Don't delete self
    if (userId === user.id) {
        return { error: 'Cannot delete yourself' }
    }

    const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId)

    if (authError) {
        console.error('Error deleting auth user:', authError)
        return { error: 'Failed to delete user from Auth' }
    }

    // Explicitly delete from public details if not cascaded (safeguard)
    // Note: If Auth delete worked, the trigger usually handles public.users if standard setup.
    // If manual sync, we do it here.
    const { error: dbError } = await adminSupabase
        .from('users')
        .delete()
        .eq('id', userId)

    // We ignore dbError if it's "row not found" (already cascaded)
    if (dbError && dbError.code !== 'PGRST116') {
        console.warn('DB delete warning (might be cascaded):', dbError)
    }

    revalidatePath('/admin/users')
    return { success: true }
}
