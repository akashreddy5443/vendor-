'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function LifestyleGrid({ items }: { items?: any[] }) {
    const gridItems = items || [
        {
            title: 'WORK ESSENTIALS',
            image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop', // Office/Desk
            link: '/search?category=laptops'
        },
        {
            title: 'AFTER HOURS',
            image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop', // Monitor/Gaming
            link: '/search?category=audio'
        },
        {
            title: 'EVERYDAY CARRY',
            image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=2070&auto=format&fit=crop', // Watch/Phone
            link: '/search?category=wearables'
        }
    ]

    return (
        <section className="py-20 bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-12 text-[#0B1026] dark:text-white">
                    Made For Every Moment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {gridItems.map((item) => (
                        <Link
                            href={item.link}
                            key={item.title}
                            className="group block relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">{item.title}</h3>
                                    <div className="flex items-center text-white/80 text-sm font-bold uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                        Shop Now <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
