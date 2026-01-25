import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Eye, MapPin } from 'lucide-react'
import Link from 'next/link'

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    // 1. Fetch Orders
    const { data: orders } = await supabase
        .from('orders')
        .select(`
      id,
      total_amount,
      status,
      created_at,
      shipping_address,
      users ( email )
    `)
        .order('created_at', { ascending: false })

    // 2. Extract Address IDs (assuming shipping_address is atomic value ID or {id: ...})
    // Based on previous code, we stored just the ID string in the jsonb column.
    const addressIds = orders?.map(o => o.shipping_address).filter(id => typeof id === 'string') || []

    // 3. Fetch Addresses
    let addressMap: Record<string, any> = {}
    if (addressIds.length > 0) {
        const { data: addresses } = await supabase
            .from('addresses')
            .select('*')
            .in('id', addressIds)

        if (addresses) {
            addressMap = addresses.reduce((acc, addr) => {
                acc[addr.id] = addr
                return acc
            }, {} as Record<string, any>)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Orders</h2>
                <p className="text-gray-400">Manage customer orders.</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="border-b border-gray-800 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Shipping To</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {orders?.map((order) => {
                                const addr = typeof order.shipping_address === 'string' ? addressMap[order.shipping_address] : null
                                return (
                                    <tr key={order.id} className="hover:bg-gray-800/50">
                                        <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                        <td className="px-4 py-3 text-white">
                                            {(order.users as any)?.email || 'Guest'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {addr ? (
                                                <div className="flex flex-col text-xs">
                                                    <span className="text-white font-medium">{addr.full_name}</span>
                                                    <span>{addr.city}, {addr.state}</span>
                                                    <span className="text-gray-500">{addr.postal_code}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-600 italic">No Address</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-white">
                                            {formatPrice(order.total_amount)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${order.status === 'paid'
                                                    ? 'bg-green-400/10 text-green-400 ring-green-400/20'
                                                    : order.status === 'shipped'
                                                        ? 'bg-blue-400/10 text-blue-400 ring-blue-400/20'
                                                        : 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20'
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`} // We'll implement detail view later
                                                className="inline-block rounded p-1 hover:bg-gray-800 hover:text-white"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                            {(!orders || orders.length === 0) && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                        No orders found.
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
