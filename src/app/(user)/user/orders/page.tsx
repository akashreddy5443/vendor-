import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Package, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Orders</h2>
            </div>

            {!orders || orders.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-12 text-center">
                    <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
                    <p className="text-gray-400 mb-6">Looks like you haven't placed any orders yet.</p>
                    <Link href="/products" className="rounded-full bg-white px-6 py-2 text-black font-medium hover:bg-gray-200">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <div className="text-sm text-gray-400">Order #{order.id.slice(0, 8)}...</div>
                                    <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 w-fit">
                                    {order.status === 'pending' && <Clock className="h-3 w-3 text-yellow-500" />}
                                    {order.status === 'paid' && <CheckCircle className="h-3 w-3 text-green-500" />}
                                    <span className="text-xs font-medium uppercase text-gray-300">{order.status}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                                <div className="font-medium text-white">
                                    Total: <span className="text-orange-500">{formatPrice(order.total_amount)}</span>
                                </div>
                                <Link
                                    href={`/user/orders/${order.id}`} // We will need to build this detail page next
                                    className="text-sm font-medium text-white hover:underline"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
