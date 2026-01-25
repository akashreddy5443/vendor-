'use client'

import { useState, useEffect } from 'react'
import { createCoupon, deleteCoupon } from './actions'
import { createClient } from '@/lib/supabase/client' // Client-side fetch for list
import { Loader2, Trash2, Ticket, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CouponManagementPage() {
    const [coupons, setCoupons] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)

    useEffect(() => {
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
        if (data) setCoupons(data)
        setLoading(false)
    }

    const handleCreate = async (formData: FormData) => {
        setIsCreating(true)
        const res = await createCoupon(formData)
        if (res?.error) {
            alert(res.error)
        } else {
            // Reset form manually or refresh
            const form = document.getElementById('create-form') as HTMLFormElement
            form.reset()
            fetchCoupons()
        }
        setIsCreating(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return
        await deleteCoupon(id)
        fetchCoupons()
    }

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Ticket className="text-blue-500" /> Coupon Management
            </h1>

            {/* Create Form */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Create New Coupon
                </h2>
                <form id="create-form" action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Coupon Code</label>
                        <input name="code" placeholder="e.g. SAVE20" className="w-full rounded bg-black border border-zinc-700 p-2 text-white uppercase" required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Discount Type</label>
                        <select name="discountType" className="w-full rounded bg-black border border-zinc-700 p-2 text-white">
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Value</label>
                        <input name="discountValue" type="number" placeholder="20" className="w-full rounded bg-black border border-zinc-700 p-2 text-white" required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Min Order Amount</label>
                        <input name="minOrder" type="number" placeholder="0" className="w-full rounded bg-black border border-zinc-700 p-2 text-white" />
                    </div>
                    <div className="col-span-full md:col-span-1">
                        <button disabled={isCreating} className="w-full rounded bg-blue-600 p-2 font-bold text-white hover:bg-blue-500 disabled:opacity-50">
                            {isCreating ? <Loader2 className="animate-spin mx-auto" /> : 'Create Coupon'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.length === 0 && <p className="text-gray-500 col-span-full">No active coupons found.</p>}

                {coupons.map((coupon) => (
                    <div key={coupon.id} className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between group hover:border-blue-500/50 transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-2xl font-mono font-bold text-white">{coupon.code}</h3>
                                <div className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                                    ACTIVE
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-blue-500 mb-4">
                                {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                            </div>
                            <div className="space-y-1 text-sm text-gray-400">
                                <p>Min Order: {formatPrice(coupon.min_order_amount)}</p>
                                <p>Created: {new Date(coupon.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDelete(coupon.id)} className="p-2 text-gray-500 hover:text-red-500">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
