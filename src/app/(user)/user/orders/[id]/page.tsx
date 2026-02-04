import { createClient } from '@/lib/supabase/server'
import { formatPrice, cn } from '@/lib/utils'
import { OrderTimeline } from '@/components/shop/OrderTimeline'
import { CancelOrderButton } from '@/components/shop/CancelOrderButton'
import { ReorderButton } from '@/components/shop/ReorderButton'
import { ArrowLeft, MapPin, CreditCard, Package, Download, ChevronRight, Truck } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { RecentlyViewed } from '@/components/shop/RecentlyViewed'

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

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
                    id,
                    slug,
                    title,
                    price,
                    sale_price,
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
        return (
            <div className="p-8 text-center space-y-4">
                <h3 className="text-xl font-bold text-red-500">Order Not Found</h3>
                <p className="text-muted-foreground">Unable to load order details.</p>
                <div className="p-2 bg-gray-100 rounded text-xs text-gray-500 max-w-xs mx-auto">
                    ID: {id}
                </div>
                <Link href="/user/orders" className="text-blue-500 hover:underline">
                    Back to My Orders
                </Link>
            </div>
        )
    }

    const currentStep = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status)
    const isCancelled = order.status === 'cancelled'

    // Calculate delivery date (Example: +7 days from creation)
    const deliveryDate = new Date(order.created_at)
    deliveryDate.setDate(deliveryDate.getDate() + 7)

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/user/orders" className="hover:text-foreground">My Orders</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">Order #{order.id.slice(0, 8)}</span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Items & Timeline */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Order Status Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {isCancelled ? 'Order Cancelled' : (order.status === 'delivered' ? 'Delivered' : 'Arriving by ' + deliveryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))}
                                </h1>
                                {!isCancelled && <p className="text-sm text-gray-500 mt-1">Your order is {order.status}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                                {!isCancelled && <CancelOrderButton orderId={order.id} status={order.status} />}
                                {isCancelled && <ReorderButton items={order.items} />}
                                {order.status === 'delivered' && (
                                    <button className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
                                        <Download className="h-4 w-4" /> Invoice
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="py-2">
                            <OrderTimeline status={order.status} created_at={order.created_at} />
                        </div>
                    </div>

                    {/* Products List */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        {order.items.map((item: any) => {
                            const product = item.product
                            const images = product?.product_images || []
                            const imageObj = images.find((img: any) => img.is_primary) || images[0]
                            const imageUrl = imageObj?.cloudinary_url

                            return (
                                <div key={item.product_id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white relative">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={product?.title || "Product"}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Link href={`/products/${product?.slug || product?.id}`} className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 text-lg">
                                                        {product?.title || "Unknown Product"}
                                                    </Link>
                                                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>

                                                    {/* Rating/Review Placeholder (Meesho style) */}
                                                    {order.status === 'delivered' && (
                                                        <div className="mt-3">
                                                            <span className="text-blue-600 text-sm font-medium cursor-pointer hover:underline">Write a Review</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg text-gray-900">{formatPrice(item.price)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Right Column: Address & Summary */}
                <div className="space-y-6">

                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-500 uppercase tracking-wide mb-4">Delivery Address</h3>
                        <div className="ml-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{order.shipping_address?.full_name || 'User'}</h4>
                            <div className="text-sm text-gray-600 space-y-0.5 leading-relaxed">
                                <p>{order.shipping_address?.line1}</p>
                                {order.shipping_address?.line2 && <p>{order.shipping_address?.line2}</p>}
                                <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
                                <p>{order.shipping_address?.postal_code}</p>
                                <p className="font-medium mt-2">Phone: {order.shipping_address?.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Details (Flipkart Style) */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-base font-bold text-gray-500 uppercase tracking-wide">Price Details</h3>
                        </div>
                        <div className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Price ({order.items.length} items)</span>
                                <span>{formatPrice(order.total_amount)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Charges</span>
                                <span className="text-green-600 font-medium">FREE</span>
                            </div>
                            <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center font-bold text-lg text-gray-900">
                                <span>Total Amount</span>
                                <span>{formatPrice(order.total_amount)}</span>
                            </div>
                        </div>
                        <div className="bg-green-50 p-3 text-xs text-green-700 font-medium text-center border-t border-green-100">
                            You saved ₹0 on this order
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <Package className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 text-sm">Need Help?</p>
                            <p className="text-xs text-gray-500">Contact customer support</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Recently Viewed Section */}
            <div className="md:p-0 pt-0 space-y-4">
                <RecentlyViewed />
            </div>

            {/* Bottom Bar Mobile (Optional) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center z-20">
                <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="font-bold text-gray-900">{formatPrice(order.total_amount)}</p>
                </div>
                <div className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    {order.payment_method === 'cod' ? 'Cash On Delivery' : 'Paid Online'}
                </div>
            </div>
        </div>
    )
}
