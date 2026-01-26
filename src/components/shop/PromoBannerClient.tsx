'use client'

import { Clock, ShieldCheck, Tag, Zap, ShoppingBag, Headphones, Camera, Gamepad } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const ICON_MAP: any = {
    Clock, ShieldCheck, Tag, Zap, ShoppingBag, Headphones, Camera, Gamepad
}

export function PromoBannerClient({ promos }: { promos: any[] }) {
    return (
        <section className="py-8 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {promos.map((promo, idx) => {
                        const IconComponent = ICON_MAP[promo.icon] || Tag

                        return (
                            <motion.div
                                key={promo.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link href={promo.href || '#'} className={`block h-full overflow-hidden rounded-xl ${promo.color} p-6 relative group transition-transform hover:scale-[1.02] shadow-lg`}>
                                    {/* Background Pattern */}
                                    <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors" />

                                    <div className="relative z-10 flex flex-col h-full justify-between text-white">
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                                                    {promo.title}
                                                </span>
                                                <IconComponent className="h-6 w-6 text-white/80" />
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
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
