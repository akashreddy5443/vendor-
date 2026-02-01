'use client'

import { ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

const iconMap: any = {
    ShieldCheck, Truck, RotateCcw, CreditCard
}

export default function TrustSection({ data }: { data?: any }) {
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

    const renderIcon = (icon: any) => {
        if (React.isValidElement(icon)) return icon
        if (typeof icon === 'string') {
            const IconComp = iconMap[icon] || ShieldCheck
            return <IconComp className="w-6 h-6" />
        }
        return <ShieldCheck className="w-6 h-6" />
    }

    return (
        <section className="py-24 bg-white border-t border-slate-100">
            <div className="w-full max-w-[1800px] mx-auto px-4 md:px-12 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {features.map((feature: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col items-start gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all duration-500">
                                {renderIcon(feature.icon)}
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-500 font-medium max-w-[250px]">
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
