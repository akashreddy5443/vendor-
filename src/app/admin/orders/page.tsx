import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Eye, MapPin } from 'lucide-react'
import Link from 'next/link'
import { StatusSelector } from './StatusSelector'
import { OrderDeleteButton } from '@/components/admin/OrderDeleteButton'

// Define Address Interface for type safety
interface Address {
    full_name: string;
    city: string;
    state: string;
    postal_code: string;
}

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    // 1. Fetch Orders
    const { data: ordersData } = await supabase
        .from('orders')
        .select(`
      id,
      total_amount,
      status,
      created_at,
      shipping_address,
      users ( email )
    `)
        .order('created_at', { ascending: false })

    // 2. Fetch Order Items Separately (to avoid RLS filtering the entire order)
    const orderIds = ordersData?.map(o => o.id) || []
    let orderItemsMap: Record<string, any[]> = {}

    let debugError: any = null;
    let debugRawItems: any = null;

    if (orderIds.length > 0) {
        // Attempt 1: Full Fetch with Product Relation
        const { data: allItems, error } = await supabase
            .from('order_items')
            .select('order_id, quantity, price, product_id, product:products(title)')
            .in('order_id', orderIds)

        if (error) {
            console.error('Fetch Items Error:', error)
            debugError = error
        }

        if (allItems) {
            allItems.forEach(item => {
                if (!orderItemsMap[item.order_id]) orderItemsMap[item.order_id] = []
                orderItemsMap[item.order_id].push(item)
            })
        }

        // Debug Attempt 2: Simple Fetch (No Join) - to check if RLS on Products is the issue
        if (!allItems || allItems.length === 0) {
            const { data: rawItems, error: rawError } = await supabase
                .from('order_items')
                .select('*') // No join
                .in('order_id', orderIds)
            debugRawItems = rawItems
            if (rawError) debugError = rawError
        }
    }

    // Debug 3: Who am I? And can I see ANY items?
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    const { data: anyItems } = await supabase.from('order_items').select('id, order_id').limit(5);

    // Merge logic
    const orders = ordersData?.map(o => ({
        ...o,
        order_items: orderItemsMap[o.id] || []
    }))

    // 2. Extract Address IDs (Legacy check)
    const addressIds = orders?.map(o => o.shipping_address).filter(addr => typeof addr === 'string') || []

    // 3. Fetch Legacy Addresses
    let addressMap: Record<string, any> = {}
    if (addressIds.length > 0) {
        // ... (existing logic) ...
        const { data: addresses } = await supabase.from('addresses').select('*').in('id', addressIds)
        if (addresses) {
            addressMap = addresses.reduce((acc, addr) => { acc[addr.id] = addr; return acc }, {} as Record<string, any>)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Orders</h2>
                <p className="text-gray-400">Manage customer orders.</p>
                {/* Debug Info */}
                <div className="mt-2 p-2 bg-gray-900 border border-gray-700 rounded text-xs text-gray-400 font-mono">
                    DEBUG: Found {orders?.length || 0} orders.
                    Order IDs: {orders?.map(o => o.id.slice(0, 4)).join(', ')}.
                    Total Item Objects: {
                        orders?.reduce((sum, o) => {
                            const items = (o as any).order_items;
                            return sum + (Array.isArray(items) ? items.length : 0);
                        }, 0)
                    }
                    {' | '}
                    Last Error: {debugError ? JSON.stringify(debugError) : 'None'}
                    {' | '}
                    Raw Fallback Items: {debugRawItems ? debugRawItems.length : 'N/A'}
                    {' | '}
                    User: {currentUser?.email} (Role: {currentUser?.role})
                    {' | '}
                    Global Check: {anyItems?.length || 0} items visible in DB.
                </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="border-b border-gray-800 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Products</th>
                                <th className="px-4 py-3">Shipping To</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {orders?.map((order) => {
                                // Address Logic: Handle JSONB (Object) or ID (String)
                                let addr: Address | null = null
                                const sa = order.shipping_address as any

                                if (sa && typeof sa === 'object' && sa.full_name) {
                                    // New Format: Inline JSON
                                    addr = sa
                                } else if (typeof sa === 'string') {
                                    // Legacy Format: ID Lookup
                                    addr = addressMap[sa]
                                }

                                return (
                                    <tr key={order.id} className="hover:bg-gray-800/50">
                                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{order.id.slice(0, 8)}...</td>
                                        <td className="px-4 py-3 text-white">
                                            {(order.users as any)?.email || 'Guest'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                {!(order as any).order_items || (order as any).order_items.length === 0 ? (
                                                    <span className="text-xs text-red-400 italic">No items data</span>
                                                ) : (
                                                    (order as any).order_items.map((item: any) => (
                                                        <div key={item.product_id} className="text-xs text-gray-300">
                                                            <span className="font-bold text-white">{item.quantity}x</span> {item.product?.title ||
                                                                <span className="text-gray-500">Item #{item.product_id?.slice(0, 4)}...</span>}
                                                        </div>
                                                    )))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {addr ? (
                                                <div className="flex flex-col text-xs">
                                                    <span className="text-white font-medium">{addr.full_name}</span>
                                                    <span>{addr.city}, {addr.state}</span>
                                                    <span className="text-gray-500">{addr.postal_code}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-600 italic">No Address</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-white">
                                            {formatPrice(order.total_amount)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusSelector orderId={order.id} currentStatus={order.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <OrderDeleteButton orderId={order.id} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {(!orders || orders.length === 0) && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
