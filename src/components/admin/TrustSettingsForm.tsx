'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { RotateCcw, Save, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react'

// Icon Options for the dropdown
const ICON_OPTIONS = [
    { value: 'Truck', label: 'Truck (Delivery)' },
    { value: 'ShieldCheck', label: 'Shield (Security)' },
    { value: 'RotateCcw', label: 'Rotate (Returns)' },
    { value: 'CheckCircle2', label: 'Checkmark (Verified)' },
    { value: 'Star', label: 'Star' },
    { value: 'Heart', label: 'Heart' },
    { value: 'Zap', label: 'Zap (Fast)' },
]

export default function TrustSettingsForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    // Default State
    const [data, setData] = useState(initialData?.content_json || {
        title: "Why Customers Trust TechDev",
        subtitle: "We are committed to providing the best shopping experience.",
        rating: "4.8",
        reviewCount: "10,000+",
        features: [
            { name: "Fast Delivery", description: "Reliable shipping.", icon: "Truck" },
            { name: "Secure Payments", description: "Protected data.", icon: "ShieldCheck" },
            { name: "Easy Returns", description: "Hassle-free.", icon: "RotateCcw" },
            { name: "Verified", description: "Authentic products.", icon: "CheckCircle2" }
        ]
    })

    const handleFeatureChange = (index: number, field: string, value: string) => {
        const newFeatures = [...data.features]
        newFeatures[index] = { ...newFeatures[index], [field]: value }
        setData({ ...data, features: newFeatures })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase
            .from('homepage_sections')
            .upsert({
                section_type: 'trust_section',
                content_json: data,
                updated_at: new Date().toISOString()
            }, { onConflict: 'section_type' })

        if (error) {
            alert('Error updating settings')
            console.error(error)
        } else {
            router.refresh()
            alert('Settings saved successfully')
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Section Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Subtitle</label>
                        <input
                            type="text"
                            value={data.subtitle}
                            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Rating (out of 5)</label>
                        <input
                            type="text"
                            value={data.rating}
                            onChange={(e) => setData({ ...data, rating: e.target.value })}
                            className="w-full p-2 border rounded-md"
                            placeholder="4.8"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Review Count</label>
                        <input
                            type="text"
                            value={data.reviewCount}
                            onChange={(e) => setData({ ...data, reviewCount: e.target.value })}
                            className="w-full p-2 border rounded-md"
                            placeholder="10,000+"
                        />
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900">Trust Badges (Features)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.features.map((feature: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500">Badge Title</label>
                                <input
                                    type="text"
                                    value={feature.name}
                                    onChange={(e) => handleFeatureChange(index, 'name', e.target.value)}
                                    className="w-full p-2 border rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500">Message</label>
                                <textarea
                                    value={feature.description}
                                    onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                                    className="w-full p-2 border rounded-md text-sm h-20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500">Icon</label>
                                <select
                                    value={feature.icon}
                                    onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                                    className="w-full p-2 border rounded-md text-sm"
                                >
                                    {ICON_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-3 sticky bottom-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>
        </form>
    )
}
