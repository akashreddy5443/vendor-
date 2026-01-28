'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function TrendingSpotlight() {
    return (
        <section className="py-20 bg-[#F8F9FA] dark:bg-zinc-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#0B1026] dark:text-white">
                        In The Spotlight
                    </h2>
                    <Link href="/products" className="hidden md:flex items-center text-sm font-bold text-[#0B1026] dark:text-gray-300 hover:opacity-70 uppercase tracking-wider">
                        View All Collections <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Large Featured Item */}
                    <div className="relative aspect-[16/9] md:aspect-auto md:h-[500px] overflow-hidden group rounded-sm">
                        <Image
                            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" // Gaming/Esports
                            alt="Pro Gaming Layout"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-sm">
                            <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2 block">New Arrival</span>
                            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 uppercase leading-none">
                                The Pro Gamer Edit
                            </h3>
                            <Link href="/search?category=laptops" className="inline-block bg-white text-black px-8 py-3 font-bold uppercase text-sm hover:bg-gray-100 transition-colors">
                                Explore
                            </Link>
                        </div>
                    </div>

                    {/* Secondary Items */}
                    <div className="grid grid-rows-2 gap-8 h-[500px]">
                        <div className="relative overflow-hidden group rounded-sm">
                            <Image
                                src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2072&auto=format&fit=crop" // PS5/Console
                                alt="Console Gaming"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute bottom-6 left-6">
                                <h3 className="text-xl font-bold text-white uppercase mb-1">Console Ready</h3>
                                <Link href="/search?category=gaming" className="text-white text-xs font-bold uppercase tracking-widest border-b border-white pb-0.5 hover:opacity-80">Shop Now</Link>
                            </div>
                        </div>
                        <div className="relative overflow-hidden group rounded-sm">
                            <Image
                                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop" // Headphones
                                alt="Audio Gear"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute bottom-6 left-6">
                                <h3 className="text-xl font-bold text-white uppercase mb-1">Audiophile Grade</h3>
                                <Link href="/search?category=audio" className="text-white text-xs font-bold uppercase tracking-widest border-b border-white pb-0.5 hover:opacity-80">Shop Now</Link>
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
