'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Ticket, Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AvailableCouponsProps {
    onApply?: (code: string) => void
}

export function AvailableCoupons({ onApply }: AvailableCouponsProps) {
    const [coupons, setCoupons] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        const fetchCoupons = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('coupons')
                .select('*')
                .eq('is_active', true)
                .eq('is_public', true)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })

            if (data) setCoupons(data)
            setLoading(false)
        }
        fetchCoupons()
    }, [])

    const handleAction = (code: string, id: string) => {
        if (onApply) {
            onApply(code)
        } else {
            navigator.clipboard.writeText(code)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        }
    }

    if (loading) return <div className="animate-pulse h-24 bg-gray-100 rounded-xl" />
    if (coupons.length === 0) return null

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 mt-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary mb-4">
                <Ticket className="h-4 w-4" /> Available Offers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                    <motion.div
                        key={coupon.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => onApply && onApply(coupon.code)}
                        className={`flex items-center justify-between p-3 bg-white rounded-lg border border-primary/10 shadow-sm group hover:border-primary/30 transition-colors ${onApply ? 'cursor-pointer hover:bg-primary/5' : ''}`}
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-heading font-black text-lg text-slate-800">{coupon.code}</span>
                                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">
                                    {coupon.discount_type === 'percent' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                                {coupon.description || `Save on orders above ₹${coupon.min_order_value}`}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleAction(coupon.code, coupon.id)
                            }}
                            className="p-2 hover:bg-gray-50 rounded-full transition-colors relative"
                            title={onApply ? "Apply Code" : "Copy Code"}
                        >
                            <AnimatePresence mode='wait'>
                                {copiedId === coupon.id ? (
                                    <motion.div
                                        key="check"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    >
                                        <Check className="h-4 w-4 text-green-500" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="copy"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    >
                                        {onApply ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-slate-400 group-hover:text-primary" />}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
