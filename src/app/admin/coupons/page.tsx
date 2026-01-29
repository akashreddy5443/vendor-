import { createClient } from '@/lib/supabase/server'
import { deleteCoupon, toggleCouponStatus } from './actions'
import { Trash2, Check, X, Tag } from 'lucide-react'
import { CreateCouponForm } from './CreateCouponForm'

export default async function AdminCouponsPage() {
    const supabase = await createClient()
    const { data: coupons } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="p-6 text-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
                    <Tag className="text-blue-600" /> Coupons & Discounts
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CREATE FORM */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 h-fit shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Coupon</h2>
                    <CreateCouponForm />
                </div>

                {/* LIST */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                                <tr>
                                    <th className="p-4">Code</th>
                                    <th className="p-4">Discount</th>
                                    <th className="p-4">Min Spend</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {coupons?.map((coupon: any) => (
                                    <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 uppercase tracking-wider">{coupon.code}</div>
                                            <div className="text-xs text-gray-500">Expires: {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                                                {coupon.discount_type === 'percent' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {coupon.min_order_value > 0 ? `₹${coupon.min_order_value}` : '-'}
                                        </td>
                                        <td className="p-4">
                                            <form action={async () => {
                                                'use server'
                                                await toggleCouponStatus(coupon.id, coupon.is_active)
                                            }}>
                                                <button className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${coupon.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                    {coupon.is_active ? 'ACTIVE' : 'INACTIVE'}
                                                </button>
                                            </form>
                                        </td>
                                        <td className="p-4 text-right">
                                            <form action={async () => {
                                                'use server'
                                                await deleteCoupon(coupon.id)
                                            }}>
                                                <button className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-100 rounded">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                                {(!coupons || coupons.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            No coupons created yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
