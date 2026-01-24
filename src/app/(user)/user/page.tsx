import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Package, User, MapPin, Clock, ArrowRight, CreditCard, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function UserDashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch recent orders to show stats
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    const totalOrders = orders?.length || 0
    const latestOrder = orders?.[0]

    // Calculate total spent (approximated from fetched orders, ideally aggregate query)
    // For precise total spent across ALL orders, we'd need a separate query or RPC. 
    // keeping it simple for now or just showing "Last Order" details.

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-900/40 to-black border border-orange-500/20 p-8">
                <div className="relative z-10">
                    <h2 className="text-3xl font-serif font-bold text-white mb-2">
                        Welcome back, User
                    </h2>
                    <p className="text-gray-400">
                        Manage your profile, check your orders, and update your preferences.
                    </p>
                </div>
                <div className="absolute top-0 right-0 -m-8 opacity-10">
                    <User className="h-64 w-64 text-orange-500" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 flex flex-col justify-between hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-4 text-gray-400 mb-2">
                        <div className="p-2 rounded-lg bg-gray-800 text-orange-500">
                            <Package className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">Total Orders</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{totalOrders}</div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 flex flex-col justify-between hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-4 text-gray-400 mb-2">
                        <div className="p-2 rounded-lg bg-gray-800 text-blue-500">
                            <Clock className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">Recent Activity</span>
                    </div>
                    <div className="text-lg font-medium text-white truncate">
                        {latestOrder ? `Order #${latestOrder.id.slice(0, 6)}` : 'No activity'}
                    </div>
                </div>

                <Link href="/products" className="rounded-xl border border-gray-800 bg-gray-900 p-6 flex flex-col justify-between hover:bg-orange-600 hover:border-orange-500 group transition-all cursor-pointer">
                    <div className="flex items-center gap-4 text-gray-400 group-hover:text-white mb-2">
                        <div className="p-2 rounded-lg bg-gray-800 group-hover:bg-white/20 text-green-500 group-hover:text-white">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">Continue Shopping</span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                        <span className="font-bold">Browse Store</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </div>

            {/* Recent Order Preview */}
            <h3 className="text-xl font-bold font-serif pt-4">Latest Order</h3>
            {latestOrder ? (
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="font-bold text-white">Order #{latestOrder.id}</div>
                            <div className="text-sm text-gray-400">Placed on {new Date(latestOrder.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase">Total</div>
                            <div className="font-bold text-orange-500">{formatPrice(latestOrder.total_amount)}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase">Status</div>
                            <div className="font-medium text-white capitalize">{latestOrder.status}</div>
                        </div>
                        <Link
                            href={`/user/orders/${latestOrder.id}`}
                            className="rounded-full border border-gray-700 bg-black px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-black transition-colors"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-gray-800 p-8 text-center text-gray-500">
                    You haven't placed any orders yet.
                </div>
            )}
        </div>
    )
}
