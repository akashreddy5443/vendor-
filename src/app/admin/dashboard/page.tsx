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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h3 className="mb-4 text-lg font-medium text-white">Recent Activity</h3>
                    <div className="text-sm text-gray-400">
                        {/* Placeholder for now, could be recent orders list */}
                        Recent orders will appear here.
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h3 className="mb-4 text-lg font-medium text-white">Recent Sales</h3>
                    <div className="text-sm text-gray-400">
                        {/* Placeholder */}
                        Sales analytics coming soon.
                    </div>
                </div>
            </div>
        </div>
    )
}
