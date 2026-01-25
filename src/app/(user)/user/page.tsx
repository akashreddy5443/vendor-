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

    // Fetch Profile
    const { data: profile } = await supabase
        .from('users')
        .select('full_name') // Select fields we need
        .eq('id', user.id)
        .single()

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
                <h1 className="text-3xl font-bold font-serif mb-2 text-primary">Welcome back, <span className="text-brand-orange">{profile?.full_name || 'User'}</span></h1>
                <p className="text-muted-foreground">Here's what's happening with your account today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                            <p className="text-2xl font-bold text-foreground">{orderCount || 0}</p>
                        </div>
                    </div>
                </div>

                <Link href="/user/wishlist" className="p-6 rounded-xl bg-card border border-border shadow-sm transition-all hover:shadow-md hover:border-blue-200 block">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-pink-100 rounded-lg">
                            <Heart className="h-6 w-6 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Wishlist Items</p>
                            <p className="text-2xl font-bold text-foreground">{wishlistCount || 0}</p>
                        </div>
                    </div>
                </Link>

                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Account Status</p>
                            <p className="text-xl font-bold text-foreground">Active Member</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
                    <Link href="/user/orders" className="text-sm text-blue-600 hover:text-blue-500 font-medium">View All Orders</Link>
                </div>

                {recentOrders && recentOrders.length > 0 ? (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <p className="font-medium text-foreground">Order #{order.id.slice(0, 8)}</p>
                                    <p className="text-sm text-muted-foreground">{new Date(order.created_at).toDateString()}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium uppercase text-secondary-foreground">
                                    {order.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-card/50 rounded-lg border border-border border-dashed">
                        <p className="text-muted-foreground">No recent activity.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
