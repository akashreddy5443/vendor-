'use client'

import React from 'react'
import { ShieldCheck, Truck, RotateCcw, CreditCard, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const iconMap: any = {
    ShieldCheck, Truck, RotateCcw, CreditCard, CheckCircle
}

export default function TrustSection({ data, variant = 'default' }: { data?: any, variant?: 'default' | 'overlay' }) {
    const defaultFeatures = [
        {
            icon: 'ShieldCheck',
            title: "Authorized Hub",
            description: "Official dealer for all featured brands. 100% genuine guarantees."
        },
        {
            icon: 'Truck',
            title: "Express Delivery",
            description: "Same-day shipping for orders before 2PM. Global tracking included."
        },
        {
            icon: 'RotateCcw',
            title: "Easy Returns",
            description: "Change your mind? Return within 30 days, no questions asked."
        },
        {
            icon: 'CreditCard',
            title: "Secure Checkout",
            description: "Encrypted payments via Stripe & PayPal. Your data is safe."
        }
    ]

    const features = data?.features || defaultFeatures

    const renderIcon = (icon: any, isOverlay: boolean) => {
        const IconComp = (typeof icon === 'string' ? iconMap[icon] : icon) || ShieldCheck
        return <IconComp className={isOverlay ? "w-5 h-5 md:w-6 md:h-6" : "w-8 h-8"} />
    }

    if (variant === 'overlay') {
        return (
            <div className="w-full bg-slate-950/80 backdrop-blur-md border-t border-white/5 py-6 md:py-8">
                <div className="max-w-[1800px] mx-auto px-4 md:px-12 lg:px-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                        {features.map((feature: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (idx * 0.1) }}
                                className="flex items-center gap-4 group cursor-default"
                            >
                                <div className="hidden md:flex w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                                    {renderIcon(feature.icon, true)}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1 group-hover:text-blue-400 transition-colors">
                                        {feature.name || feature.title}
                                    </h3>
                                    <p className="text-xs text-zinc-400 font-medium leading-relaxed hidden xl:block">
                                        {feature.description.split('.')[0]}.
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="w-full max-w-[1800px] mx-auto px-4 md:px-12 lg:px-16 relative z-10">

                {/* Section Header (Optional, adds weight) */}
                <div className="mb-16 md:mb-20 text-center max-w-3xl mx-auto">
                    <span className="text-indigo-500 font-bold tracking-[0.2em] uppercase text-[10px] mb-3 block">
                        The Vendor Standard
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight font-heading">
                        Premium Service, <span className="text-slate-400">Standard.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                        >
                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                                    {renderIcon(feature.icon, false)}
                                </div>

                                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                    {feature.name || feature.title}
                                </h3>

                                <p className="text-sm leading-relaxed text-slate-500 font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
