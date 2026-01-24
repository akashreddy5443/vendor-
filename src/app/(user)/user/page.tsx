import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Package, Heart, CreditCard, User } from 'lucide-react'
import Link from 'next/link'

export default async function UserDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch Stats
    const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const { count: wishlistCount } = await supabase
        .from('wishlist')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    // Fetch Recent Orders
    const { data: recentOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-serif mb-2">Welcome back, User</h1>
                <p className="text-gray-400">Here's what's happening with your account today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500/10 rounded-lg">
                            <Package className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Orders</p>
                            <p className="text-2xl font-bold text-white">{orderCount || 0}</p>
                        </div>
                    </div>
                </div>

                <Link href="/user/wishlist" className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors hover:border-zinc-700 block">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-pink-500/10 rounded-lg">
                            <Heart className="h-6 w-6 text-pink-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Wishlist Items</p>
                            <p className="text-2xl font-bold text-white">{wishlistCount || 0}</p>
                        </div>
                    </div>
                </Link>

                <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <User className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Account Status</p>
                            <p className="text-xl font-bold text-white">Active Member</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                    <Link href="/user/orders" className="text-sm text-orange-500 hover:text-orange-400">View All Orders</Link>
                </div>

                {recentOrders && recentOrders.length > 0 ? (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                                <div>
                                    <p className="font-medium text-white">Order #{order.id.slice(0, 8)}</p>
                                    <p className="text-sm text-gray-500">{new Date(order.created_at).toDateString()}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-zinc-800 text-xs font-medium uppercase text-gray-300">
                                    {order.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed">
                        <p className="text-gray-500">No recent activity.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
