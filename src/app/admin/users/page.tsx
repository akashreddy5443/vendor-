import { createClient } from '@/lib/supabase/server'
import { Shield } from 'lucide-react'

// We need to make this a Client Component to use onClick handlers/state for UI
// Better approach for existing file:
// Import a new client component <UserDeleteButton userId={user.id} />
import { UserDeleteButton } from '@/components/admin/UserDeleteButton'

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const { data: users } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Users</h2>
                <p className="text-gray-500">View registered customers and admins.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="border-b border-gray-200 text-xs uppercase text-gray-500 bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Joined Date</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users?.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.role === 'admin'
                                                ? 'bg-purple-50 text-purple-700 ring-purple-600/20'
                                                : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                }`}
                                        >
                                            {user.role === 'admin' && <Shield className="h-3 w-3" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <UserDeleteButton userId={user.id} userRole={user.role} />
                                    </td>
                                </tr>
                            ))}
                            {(!users || users.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
