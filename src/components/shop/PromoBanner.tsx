'use client'

import { Clock, ShieldCheck, Tag, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const promos = [
    {
        id: 1,
        title: 'Limited Time',
        subtitle: 'Online Only!',
        description: 'Get free shipping on all orders over ₹2000.',
        icon: Clock,
        color: 'bg-orange-500',
        href: '/products?sort=newest',
        delay: 0
    },
    {
        id: 2,
        title: 'Extra Save',
        subtitle: '10% OFF',
        description: 'On all electronics this weekend.',
        icon: Tag,
        color: 'bg-blue-600',
        href: '/products?category=electronics',
        delay: 0.1
    },
    {
        id: 3,
        title: 'Security Network',
        subtitle: 'Cameras',
        description: 'Protect your home with smart tech.',
        icon: ShieldCheck,
        color: 'bg-red-600',
        href: '/search?category=security',
        delay: 0.2
    },
    {
        id: 4,
        title: 'Sale 50%',
        subtitle: 'Earbuds',
        description: 'Premium sound at half the price.',
        icon: Zap,
        color: 'bg-yellow-500',
        href: '/search?category=audio',
        delay: 0.3
    }
]

export function PromoBanner() {
    return (
        <section className="py-8 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {promos.map((promo) => (
                        <motion.div
                            key={promo.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: promo.delay }}
                            viewport={{ once: true }}
                        >
                            <Link href={promo.href} className={`block h-full overflow-hidden rounded-xl ${promo.color} p-6 relative group transition-transform hover:scale-[1.02] shadow-lg`}>
                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors" />

                                <div className="relative z-10 flex flex-col h-full justify-between text-white">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                                                {promo.title}
                                            </span>
                                            <promo.icon className="h-6 w-6 text-white/80" />
                                        </div>
                                        <h3 className="text-2xl font-extrabold leading-tight mb-1">
                                            {promo.subtitle}
                                        </h3>
                                        <p className="text-white/90 text-sm font-medium leading-snug">
                                            {promo.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                                        Shop Now <span>→</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
