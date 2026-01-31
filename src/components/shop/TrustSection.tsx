'use client'

import { ShieldCheck, Truck, RotateCcw, Star, CheckCircle2, Heart, Zap } from 'lucide-react'

// Icon Map for dynamic rendering
const ICON_MAP: any = {
    Truck,
    ShieldCheck,
    RotateCcw,
    CheckCircle2,
    Star,
    Heart,
    Zap
}

export default function TrustSection({ data }: { data?: any }) {
    // Fallback if no data provided
    const content = data || {
        title: "Why Customers Trust TechDev",
        subtitle: "We are committed to providing the best shopping experience.",
        rating: "4.8",
        reviewCount: "10,000+",
        features: [
            { name: "Fast Delivery", description: "Reliable shipping.", icon: "Truck" },
            { name: "Secure Payments", description: "Protected data.", icon: "ShieldCheck" },
            { name: "Easy Returns", description: "Hassle-free.", icon: "RotateCcw" },
            { name: "Verified Products", description: "Authentic products.", icon: "CheckCircle2" }
        ]
    }

    return (
        <section className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {content.title}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        {content.subtitle}
                    </p>

                    {/* Social Proof / Rating */}
                    <div className="mt-8 inline-flex items-center gap-4 bg-yellow-50 px-6 py-3 rounded-full border border-yellow-100 shadow-sm">
                        <div className="flex -space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-5 h-5 ${star === 5 ? 'text-gray-300' : 'text-yellow-400 fill-yellow-400'}`} />
                            ))}
                        </div>
                        <span className="font-bold text-gray-900">{content.rating}/5</span>
                        <span className="text-gray-500 text-sm border-l border-yellow-200 pl-4">Based on {content.reviewCount} Reviews</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {content.features?.map((feature: any, index: number) => {
                        const Icon = ICON_MAP[feature.icon] || CheckCircle2
                        // Generate dynamic colors based on index for variety
                        const colors = [
                            { bg: 'bg-blue-50', text: 'text-blue-600' },
                            { bg: 'bg-green-50', text: 'text-green-600' },
                            { bg: 'bg-purple-50', text: 'text-purple-600' },
                            { bg: 'bg-indigo-50', text: 'text-indigo-600' }
                        ]
                        const color = colors[index % colors.length]

                        return (
                            <div key={index} className="relative group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-xl ${color.bg} ${color.text} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {feature.name}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
