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
                                <Link href={promo.href || '#'} className={`block h-full overflow-hidden rounded-2xl ${promo.color || 'bg-white border border-gray-100'} p-6 relative group transition-transform hover:scale-[1.02] shadow-sm hover:shadow-md`}>
                                    {/* Background Pattern - Subtle for white cards */}
                                    <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />

                                    <div className={`relative z-10 flex flex-col h-full justify-between ${promo.textColor || 'text-foreground'}`}>
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded backdrop-blur-sm">
                                                    {promo.title}
                                                </span>
                                                <IconComponent className="h-6 w-6 text-primary" />
                                            </div>
                                            <h3 className="text-2xl font-extrabold leading-tight mb-1 text-foreground">
                                                {promo.subtitle}
                                            </h3>
                                            <p className="text-muted-foreground text-sm font-medium leading-snug max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                                {promo.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary group-hover:gap-3 transition-all">
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
