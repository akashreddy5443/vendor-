'use client'

import { Clock, ShieldCheck, Tag, Zap, ShoppingBag, Headphones, Camera, Gamepad, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const ICON_MAP: any = {
    Clock, ShieldCheck, Tag, Zap, ShoppingBag, Headphones, Camera, Gamepad
}

export function PromoBannerClient({ promos }: { promos: any[] }) {
    return (
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 flex flex-col items-start gap-4"
                >
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exclusive Offers</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-[-0.04em] leading-none font-heading text-left">
                            Limited <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Editions</span>
                        </h2>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[300px]">
                    {promos.map((promo, idx) => {
                        const IconComponent = ICON_MAP[promo.icon] || Tag
                        // Uniform grid: all items same size
                        const colSpan = ''

                        return (
                            <motion.div
                                key={promo.id || idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }}
                                viewport={{ once: true }}
                                className={`${colSpan} group relative overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500`}
                            >
                                <Link href={promo.href || '#'} className="block h-full w-full p-8 md:p-10 flex flex-col justify-between relative z-10">

                                    {/* Content Top */}
                                    <div className="relative z-20">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="bg-slate-50 rounded-2xl p-3 group-hover:bg-blue-50 transition-colors duration-500">
                                                <IconComponent className="h-8 w-8 text-slate-900 group-hover:text-blue-600 transition-colors duration-500" />
                                            </div>
                                            {promo.delay !== undefined && (
                                                <span className="bg-slate-900 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                                                    Hot
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-black text-slate-900 uppercase tracking-tight leading-[0.9] mb-3 group-hover:translate-x-1 transition-transform duration-500 text-3xl">
                                            {promo.subtitle || promo.title}
                                        </h3>
                                        <p className="text-slate-500 font-medium leading-relaxed max-w-[80%] group-hover:text-slate-700 transition-colors">
                                            {promo.description}
                                        </p>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex items-center gap-3 mt-6">
                                        <span className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                                            <ArrowRight className="h-4 w-4 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                        </span>
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                                            Shop Now
                                        </span>
                                    </div>
                                </Link>

                                {/* Animated Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50 group-hover:to-blue-50/50 transition-colors duration-700" />
                                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
