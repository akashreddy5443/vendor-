import { createClient } from '@/lib/supabase/server'
import { formatPrice, cn } from '@/lib/utils'
import { OrderTimeline } from '@/components/shop/OrderTimeline'
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: order, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                quantity,
                price,
                product_id,
                product:products(
                    title,
                    product_images(
                        cloudinary_url,
                        is_primary
                    )
                )
            )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error || !order) {
        console.error("Order Details Error:", error)
        return (
            <div className="p-8 text-center space-y-4">
                <h3 className="text-xl font-bold text-red-500">Order Not Found</h3>
                <p className="text-muted-foreground">Unable to load order details.</p>
                {error && (
                    <div className="p-4 bg-gray-100 rounded text-left overflow-auto max-w-lg mx-auto">
                        <code className="text-xs text-red-600 break-all">{JSON.stringify(error, null, 2)}</code>
                    </div>
                )}
                <Link href="/user/orders" className="text-blue-500 hover:underline">
                    Back to My Orders
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Link href="/user/orders" className="hover:text-foreground flex items-center gap-1">
                            <ArrowLeft className="h-3 w-3" /> Back to Orders
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold font-serif">Order #{order.id.slice(0, 8)}</h1>
                    <p className="text-muted-foreground text-sm">Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-blue-500">{formatPrice(order.total_amount)}</p>
                    <div className={cn(
                        "inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                        order.status === 'delivered' ? "bg-green-100 text-green-700" :
                            order.status === 'cancelled' ? "bg-red-100 text-red-700" :
                                order.status === 'shipped' ? "bg-yellow-100 text-yellow-700" :
                                    "bg-blue-100 text-blue-700"
                    )}>
                        {order.status}
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <h3 className="section-title text-base mb-6 border-b border-border pb-2">Order Status</h3>
                <OrderTimeline status={order.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="p-4 bg-muted/30 border-b border-border">
                            <h3 className="font-semibold text-foreground">Items Ordered</h3>
                        </div>
                        <div className="divide-y divide-border">
                            {order.items.map((item: any) => {
                                const product = item.product
                                const images = product?.product_images || []
                                const imageObj = images.find((img: any) => img.is_primary) || images[0]
                                const imageUrl = imageObj?.cloudinary_url

                                return (
                                    <div key={item.product_id} className="p-4 flex gap-4">
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-gray-50 relative">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={product?.title || "Product"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                    <Package className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <h4 className="font-medium text-foreground line-clamp-2">{product?.title || "Unknown Product"}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-blue-500">{formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Shipping Address */}
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-primary">
                            <MapPin className="h-5 w-5" />
                            <h3 className="font-semibold">Shipping Address</h3>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                            {typeof order.shipping_address === 'string' ? (
                                <p>{order.shipping_address}</p>
                            ) : (
                                <>
                                    <p className="font-medium text-foreground">{order.shipping_address?.full_name}</p>
                                    <p>{order.shipping_address?.line1}</p>
                                    {order.shipping_address?.line2 && <p>{order.shipping_address?.line2}</p>}
                                    <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
                                    <p>{order.shipping_address?.postal_code}</p>
                                    <p>{order.shipping_address?.country}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-primary">
                            <CreditCard className="h-5 w-5" />
                            <h3 className="font-semibold">Payment Info</h3>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p>Method: <span className="capitalize text-foreground font-medium">{order.payment_method}</span></p>
                            <p className="mt-2">Status: <span className={cn(
                                "capitalize font-medium",
                                order.status === 'paid' ? "text-green-500" : "text-yellow-500"
                            )}>
                                {order.payment_status || 'Pending'}
                            </span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
