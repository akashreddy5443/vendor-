'use client'

import { ShieldCheck, Truck, RotateCcw, Star, CheckCircle2 } from 'lucide-react'

const features = [
    {
        name: 'Fast & Secure Delivery',
        description: 'Reliable shipping with live tracking updates.',
        icon: Truck,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        name: 'Secure Payments',
        description: 'Your data is protected with 256-bit encryption.',
        icon: ShieldCheck,
        color: 'text-green-600',
        bg: 'bg-green-50'
    },
    {
        name: 'Easy 7-Day Returns',
        description: 'Not satisfied? Return it hassle-free.',
        icon: RotateCcw,
        color: 'text-purple-600',
        bg: 'bg-purple-50'
    },
    {
        name: 'Verified Products',
        description: '100% Authentic products directly from brands.',
        icon: CheckCircle2,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
    },
]

export default function TrustSection() {
    return (
        <section className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Why Customers Trust TechDev
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        We are committed to providing the best shopping experience for tech enthusiasts.
                    </p>

                    {/* Social Proof / Rating */}
                    <div className="mt-8 inline-flex items-center gap-4 bg-yellow-50 px-6 py-3 rounded-full border border-yellow-100 shadow-sm">
                        <div className="flex -space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-5 h-5 ${star === 5 ? 'text-gray-300' : 'text-yellow-400 fill-yellow-400'}`} />
                            ))}
                        </div>
                        <span className="font-bold text-gray-900">4.8/5</span>
                        <span className="text-gray-500 text-sm border-l border-yellow-200 pl-4">Based on 10,000+ Reviews</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div key={feature.name} className="relative group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-xl ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {feature.name}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
