import { createClient } from '@/lib/supabase/server'
import { createCoupon, deleteCoupon, toggleCouponStatus } from './actions'
import { Trash2, Check, X, Tag } from 'lucide-react'

export default async function AdminCouponsPage() {
    const supabase = await createClient()
    const { data: coupons } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="p-6 text-white min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Tag className="text-[#3B82F6]" /> Coupons & Discounts
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CREATE FORM */}
                <div className="bg-[#0F172A] p-6 rounded-lg border border-gray-800 h-fit">
                    <h2 className="text-xl font-bold mb-4 text-[#3B82F6]">Create New Coupon</h2>
                    <form action={createCoupon} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Coupon Code</label>
                            <input
                                name="code"
                                type="text"
                                required
                                placeholder="e.g. SUMMER25"
                                className="w-full bg-[#1E293B] border border-gray-700 rounded p-2 text-white uppercase font-bold tracking-widest focus:border-[#3B82F6] focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    name="discount_type"
                                    className="w-full bg-[#1E293B] border border-gray-700 rounded p-2 text-white focus:border-[#3B82F6] focus:outline-none"
                                >
                                    <option value="percent">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₹)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Value</label>
                                <input
                                    name="discount_value"
                                    type="number"
                                    required
                                    step="0.01"
                                    placeholder="10"
                                    className="w-full bg-[#1E293B] border border-gray-700 rounded p-2 text-white focus:border-[#3B82F6] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Min. Order Value (₹)</label>
                            <input
                                name="min_order_value"
                                type="number"
                                defaultValue="0"
                                className="w-full bg-[#1E293B] border border-gray-700 rounded p-2 text-white focus:border-[#3B82F6] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Expiration Date (Optional)</label>
                            <input
                                name="expires_at"
                                type="datetime-local"
                                className="w-full bg-[#1E293B] border border-gray-700 rounded p-2 text-white/50 focus:border-[#3B82F6] focus:outline-none [color-scheme:dark]"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                name="is_active"
                                type="checkbox"
                                id="is_active"
                                defaultChecked
                                className="h-4 w-4 rounded border-gray-700 bg-[#1E293B] text-[#3B82F6] focus:ring-[#3B82F6]"
                            />
                            <label htmlFor="is_active" className="text-sm">Active immediately</label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 rounded transition-colors"
                        >
                            Create Coupon
                        </button>
                    </form>
                </div>

                {/* LIST */}
                <div className="lg:col-span-2">
                    <div className="bg-[#0F172A] rounded-lg border border-gray-800 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#1E293B] text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="p-4">Code</th>
                                    <th className="p-4">Discount</th>
                                    <th className="p-4">Min Spend</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {coupons?.map((coupon: any) => (
                                    <tr key={coupon.id} className="hover:bg-[#1E293B]/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white uppercase tracking-wider">{coupon.code}</div>
                                            <div className="text-xs text-gray-500">Expires: {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-bold">
                                                {coupon.discount_type === 'percent' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">
                                            {coupon.min_order_value > 0 ? `₹${coupon.min_order_value}` : '-'}
                                        </td>
                                        <td className="p-4">
                                            <form action={toggleCouponStatus.bind(null, coupon.id, coupon.is_active)}>
                                                <button className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${coupon.is_active ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                                    {coupon.is_active ? 'ACTIVE' : 'INACTIVE'}
                                                </button>
                                            </form>
                                        </td>
                                        <td className="p-4 text-right">
                                            <form action={deleteCoupon.bind(null, coupon.id)}>
                                                <button className="text-gray-500 hover:text-red-500 transition-colors p-2">
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
