'use client'

import { createCoupon } from '@/app/admin/coupons/actions'
import { useRef, useState } from 'react'

// If createCoupon returns simple { success: boolean, error?: string }, we can handle it here.
// But technically server actions passed to 'action' prop expect FormData as only arg.
// To use standard form action, we should wrap the server action if needed, or simply call it onSubmit.
// Calling onSubmit gives us more control over the return value type check.

export function CreateCouponForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    async function handleSubmit(formData: FormData) {
        setStatus('idle')
        setMessage('')

        try {
            const result = await createCoupon(formData)
            if (result.success) {
                setStatus('success')
                setMessage('Coupon created successfully!')
                formRef.current?.reset()
            } else {
                setStatus('error')
                setMessage(result.error || 'Failed to create coupon')
            }
        } catch (e) {
            console.error(e)
            setStatus('error')
            setMessage('An unexpected error occurred')
        }
    }

    return (
        <form
            ref={formRef}
            action={handleSubmit}
            className="space-y-4"
        >
            {status === 'success' && <p className="text-green-500 text-sm font-bold">{message}</p>}
            {status === 'error' && <p className="text-red-500 text-sm font-bold">{message}</p>}

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
    )
}
