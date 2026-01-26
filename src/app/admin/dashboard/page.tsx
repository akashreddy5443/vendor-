import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Fetch Orders Stats
    const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount, status')

    const totalOrders = orders?.length || 0
    // Sum revenue for all non-cancelled orders
    const totalRevenue = orders
        ?.filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0) || 0

    // 2. Fetch Products Count
    const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    // 3. Fetch Users Count
    const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    // 4. Fetch Recent Orders with User info
    const { data: recentOrders } = await supabase
        .from('orders')
        .select('*, users(email, full_name)')
        .order('created_at', { ascending: false })
        .limit(5)

    const stats = [
        {
            title: 'Total Revenue',
            value: formatPrice(totalRevenue),
            change: 'All time',
            icon: DollarSign,
        },
        {
            title: 'Orders',
            value: totalOrders.toString(),
            change: 'All time',
            icon: ShoppingCart,
        },
        {
            title: 'Products',
            value: (productsCount || 0).toString(),
            change: 'In catalog',
            icon: Package,
        },
        {
            title: 'Customers',
            value: (usersCount || 0).toString(),
            change: 'Registered users',
            icon: Users,
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                <p className="text-gray-400">Overview of your store's performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm"
                    >
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-gray-200">{stat.title}</h3>
                            <stat.icon className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-gray-500">{stat.change}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h3 className="mb-4 text-lg font-medium text-white">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentOrders && recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-white">
                                            {order.users?.full_name || order.users?.email || 'Guest User'}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-white">{formatPrice(order.total_amount)}</div>
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                            order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400">No recent orders found.</p>
                        )}
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h3 className="mb-4 text-lg font-medium text-white">Quick Actions</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400">Manage your store efficiently.</p>
                        <div className="grid grid-cols-2 gap-4">
                            {['Products', 'Orders', 'Users', 'Settings'].map((action) => (
                                <a href={`/admin/${action.toLowerCase()}`} key={action} className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-800/50 p-4 hover:bg-gray-800 transition-colors">
                                    <span className="text-sm font-medium text-white">{action}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
