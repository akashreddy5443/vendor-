import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'

// Placeholder stats for now
const stats = [
    {
        title: 'Total Revenue',
        value: '$45,231.89',
        change: '+20.1% from last month',
        icon: DollarSign,
    },
    {
        title: 'Orders',
        value: '+2350',
        change: '+180.1% from last month',
        icon: ShoppingCart,
    },
    {
        title: 'Products',
        value: '12',
        change: '+2 new this week',
        icon: Package,
    },
    {
        title: 'Active Users',
        value: '+573',
        change: '+201 since last hour',
        icon: Users,
    },
]

export default function DashboardPage() {
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
                            <stat.icon className="h-4 w-4 text-orange-500" />
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
                    <div className="text-sm text-gray-400">No recent activity.</div>
                </div>
                <div className="col-span-3 rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <h3 className="mb-4 text-lg font-medium text-white">Recent Sales</h3>
                    <div className="text-sm text-gray-400">No recent sales.</div>
                </div>
            </div>
        </div>
    )
}
