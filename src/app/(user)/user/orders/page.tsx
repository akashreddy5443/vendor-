import { createClient } from '@/lib/supabase/server'
import { formatPrice, cn } from '@/lib/utils'
import { Package, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                *,
                product:products(
                    title,
                    product_images(
                        cloudinary_url,
                        is_primary
                    )
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold px-1">My Orders</h2>

            {!orders || orders.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-6">Looks like you haven't placed any orders yet.</p>
                    <Link href="/products" className="rounded-full bg-primary px-6 py-2 text-primary-foreground font-medium hover:bg-primary/90">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        // Get the first product to display as the main thumbnail
                        const firstItem = order.items?.[0]
                        const product = firstItem?.product

                        // Find primary image or first image from the relation
                        const productImages = product?.product_images as any[] | undefined
                        const imageObj = productImages?.find((img: any) => img.is_primary) || productImages?.[0]
                        const image = imageObj?.cloudinary_url

                        // Status Config
                        let statusColor = "text-blue-600"
                        let statusText = "Processing"
                        let statusBg = "bg-blue-50"

                        if (order.status === 'delivered') {
                            statusColor = "text-green-600"
                            statusText = "Delivered"
                            statusBg = "bg-green-50"
                        } else if (order.status === 'cancelled') {
                            statusColor = "text-red-600"
                            statusText = "Order Cancelled"
                            statusBg = "bg-red-50"
                        } else if (order.status === 'shipped') {
                            statusColor = "text-yellow-600"
                            statusText = "Shipped"
                            statusBg = "bg-yellow-50"
                        }

                        // Date Format
                        const dateObj = new Date(order.created_at)
                        const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })

                        return (
                            <Link href={`/user/orders/${order.id}`} key={order.id} className="block">
                                <div className="rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className="h-20 w-20 shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={product?.title || "Product"}
                                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                    <Package className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className={cn("font-medium text-base mb-1", statusColor)}>
                                                        {statusText}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 line-clamp-1">
                                                        {product?.title || "Order #" + order.id.slice(0, 6)}
                                                        {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                                                    </p>
                                                    {order.status === 'delivered' && (
                                                        <p className="text-xs text-gray-400 mt-1">Delivered on {dateStr}</p>
                                                    )}
                                                    {order.status !== 'delivered' && (
                                                        <p className="text-xs text-gray-400 mt-1">Order Date: {dateStr}</p>
                                                    )}
                                                </div>
                                                <div className="text-gray-400">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Optional "Review" prompting if needed, usually meesho prompts for rating */}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
