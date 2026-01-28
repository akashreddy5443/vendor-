'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function TrendingSpotlight({ data }: { data?: any }) {
    // Default fallback if no data
    const content = data || {
        hero: { image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', title: 'THE PRO GAMER EDIT', tag: 'New Arrival', link: '/search?category=laptops' },
        sub1: { image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2072&auto=format&fit=crop', title: 'CONSOLE READY', link: '/search?category=gaming' },
        sub2: { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop', title: 'AUDIOPHILE GRADE', link: '/search?category=audio' }
    }

    return (
        <section className="py-20 bg-[#F1F3F6] text-foreground">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#0B1026] dark:text-black">
                        In The Spotlight
                    </h2>
                    <Link href="/products" className="hidden md:flex items-center text-sm font-bold text-[#0B1026] dark:text-gray-600 hover:opacity-70 uppercase tracking-wider">
                        View All Collections <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Large Featured Item */}
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 transition-shadow hover:shadow-md">
                        <div className="relative aspect-[16/9] md:aspect-auto md:h-[500px] overflow-hidden group rounded-xl">
                            <Image
                                src={content.hero.image}
                                alt="Pro Gaming Layout"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-colors" />
                            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-sm">
                                <span className="text-white/90 text-xs font-bold uppercase tracking-widest mb-2 block">{content.hero.tag}</span>
                                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 uppercase leading-none shadow-sm">
                                    {content.hero.title}
                                </h3>
                                <Link href={content.hero.link} className="inline-block bg-white text-black px-8 py-3 font-bold uppercase text-sm rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                                    Explore
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Items */}
                    <div className="grid grid-rows-2 gap-4 h-[500px] md:h-auto">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 transition-shadow hover:shadow-md">
                            <div className="relative h-full w-full overflow-hidden group rounded-xl min-h-[230px]">
                                <Image
                                    src={content.sub1.image}
                                    alt="Console Gaming"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-colors" />
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-xl font-bold text-white uppercase mb-1 shadow-sm">{content.sub1.title}</h3>
                                    <Link href={content.sub1.link} className="text-white text-xs font-bold uppercase tracking-widest border-b border-white pb-0.5 hover:opacity-80">Shop Now</Link>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 transition-shadow hover:shadow-md">
                            <div className="relative h-full w-full overflow-hidden group rounded-xl min-h-[230px]">
                                <Image
                                    src={content.sub2.image}
                                    alt="Audio Gear"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-colors" />
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-xl font-bold text-white uppercase mb-1 shadow-sm">{content.sub2.title}</h3>
                                    <Link href={content.sub2.link} className="text-white text-xs font-bold uppercase tracking-widest border-b border-white pb-0.5 hover:opacity-80">Shop Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:hidden mt-8 text-center">
                    <Link href="/products" className="inline-flex items-center text-sm font-bold text-[#0B1026] hover:opacity-70 uppercase tracking-wider">
                        View All Collections <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
