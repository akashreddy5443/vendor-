'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const items = [
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

export function LifestyleGrid() {
    return (
        <section className="py-20 bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-12 text-[#0B1026] dark:text-white">
                    Made For Every Moment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <Link href={item.link} key={item.title} className="group relative block overflow-hidden aspect-[4/5] bg-gray-100 dark:bg-zinc-800">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-70" />

                            <div className="absolute bottom-8 left-8">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                                    {item.title}
                                </h3>
                                <span className="inline-flex items-center text-sm font-semibold text-white/90 group-hover:text-white group-hover:translate-x-1 transition-all">
                                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
