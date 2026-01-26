import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, Activity } from 'lucide-react'
import { DashboardCharts } from '@/components/admin/DashboardCharts'
import { format, subDays } from 'date-fns'

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Fetch Orders Stats
    const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at')

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

    // 5. Aggregate Data for Charts
    // Revenue Last 7 Days (Mocking gaps with 0 if needed, or just raw data)
    const revenueMap = new Map<string, number>()
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
        revenueMap.set(format(subDays(new Date(), i), 'MMM dd'), 0)
    }

    orders?.forEach(order => {
        if (order.status !== 'cancelled') {
            const date = format(new Date(order.created_at || new Date()), 'MMM dd')
            if (revenueMap.has(date)) {
                revenueMap.set(date, (revenueMap.get(date) || 0) + (Number(order.total_amount) || 0))
            }
        }
    })

    const revenueData = Array.from(revenueMap.entries()).map(([date, amount]) => ({ date, amount }))

    // Status Distribution
    const statusCounts: Record<string, number> = {}
    orders?.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

    const stats = [
        {
            title: 'Total Revenue',
            value: formatPrice(totalRevenue),
            change: '+12.5% from last month',
            icon: DollarSign,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            title: 'Orders',
            value: totalOrders.toString(),
            change: '+5% from last month',
            icon: ShoppingCart,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
        {
            title: 'Products',
            value: (productsCount || 0).toString(),
            change: 'Active catalog',
            icon: Package,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            title: 'Customers',
            value: (usersCount || 0).toString(),
            change: '+15 new this week',
            icon: Users,
            color: 'text-pink-500',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20'
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
                        className={`rounded-xl border ${stat.border} ${stat.bg} p-6 shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02]`}
                    >
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-gray-200">{stat.title}</h3>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="pt-2">
                            <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                {stat.change}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <DashboardCharts revenueData={revenueData} statusData={statusData} />

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
