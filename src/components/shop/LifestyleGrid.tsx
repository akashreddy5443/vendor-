'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function LifestyleGrid({ items }: { items?: any[] }) {
    const gridItems = items || [
        {
            title: 'WORK ESSENTIALS',
            image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop',
            link: '/search?category=laptops'
        },
        {
            title: 'AFTER HOURS',
            image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop',
            link: '/search?category=audio'
        },
        {
            title: 'EVERYDAY CARRY',
            image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=2070&auto=format&fit=crop',
            link: '/search?category=wearables'
        }
    ]

    return (
        <section className="py-24 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-2 mb-16"
                >
                    <div className="flex items-center gap-2 text-blue-600">
                        <Zap className="h-4 w-4 fill-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Lifestyle Collections</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none font-heading">
                        Made For <span className="text-blue-600 font-serif normal-case italic">Every Moment</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {gridItems.map((item, idx) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                        >
                            <Link
                                href={item.link}
                                className="group block relative overflow-hidden rounded-[2rem] bg-white border border-blue-100/50 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.6 }}
                                    className="aspect-[4/5] relative overflow-hidden"
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                                    <div className="absolute bottom-0 left-0 p-10 w-full transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter leading-none">{item.title}</h3>
                                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:text-white transition-all delay-100 gap-2">
                                            Shop Collection <ArrowRight className="h-3 w-3" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
