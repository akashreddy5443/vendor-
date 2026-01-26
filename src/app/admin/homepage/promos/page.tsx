'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, RefreshCw, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_PROMOS = [
    {
        id: 1,
        title: 'Limited Time',
        subtitle: 'Online Only!',
        description: 'Get free shipping on all orders over ₹2000.',
        icon: 'Clock',
        color: 'bg-orange-500',
        href: '/products?sort=newest'
    },
    {
        id: 2,
        title: 'Extra Save',
        subtitle: '10% OFF',
        description: 'On all electronics this weekend.',
        icon: 'Tag',
        color: 'bg-blue-600',
        href: '/products?category=electronics'
    },
    {
        id: 3,
        title: 'Security Network',
        subtitle: 'Cameras',
        description: 'Protect your home with smart tech.',
        icon: 'ShieldCheck',
        color: 'bg-red-600',
        href: '/search?category=security'
    },
    {
        id: 4,
        title: 'Sale 50%',
        subtitle: 'Earbuds',
        description: 'Premium sound at half the price.',
        icon: 'Zap',
        color: 'bg-yellow-500',
        href: '/search?category=audio'
    }
]

export default function AdminPromoPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [cards, setCards] = useState<any[]>(DEFAULT_PROMOS)
    const [notInitialized, setNotInitialized] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('homepage_sections')
            .select('content_json')
            .eq('section_type', 'promo_grid')
            .single()

        if (error || !data) {
            setNotInitialized(true)
        } else if (data?.content_json?.cards) {
            setCards(data.content_json.cards)
        }
        setLoading(false)
    }

    const handleInitialize = async () => {
        setSaving(true)
        const { error } = await supabase
            .from('homepage_sections')
            .upsert({
                section_type: 'promo_grid',
                is_active: true,
                content_json: { cards: DEFAULT_PROMOS }
            })

        if (!error) {
            setNotInitialized(false)
            fetchData()
        } else {
            alert('Failed to initialize: ' + error.message)
        }
        setSaving(false)
    }

    const handleSave = async () => {
        setSaving(true)
        const { error } = await supabase
            .from('homepage_sections')
            .update({
                content_json: { cards: cards }
            })
            .eq('section_type', 'promo_grid')

        if (error) {
            alert('Error saving: ' + error.message)
        } else {
            alert('Saved successfully!')
        }
        setSaving(false)
    }

    const updateCard = (index: number, field: string, value: string) => {
        const newCards = [...cards]
        newCards[index] = { ...newCards[index], [field]: value }
        setCards(newCards)
    }

    if (loading) return <div className="p-8 text-white">Loading editor...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Promo Banners Editor</h1>
                    <p className="text-gray-400">Manage the 4 colorful promo cards on the homepage.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/dashboard" className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800">
                        Back
                    </Link>
                    {notInitialized ? (
                        <button
                            onClick={handleInitialize}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Initialize Defaults
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}

                </div>
            </div>

            {notInitialized && (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>No promo configuration found. Click "Initialize Defaults" to create it.</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card, idx) => (
                    <div key={card.id || idx} className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-2 h-full ${card.color.replace('bg-', 'bg-')}`}></div> {/* Visual indicator */}

                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-white text-lg">Card {idx + 1} ({card.color})</h3>
                            {/* Simple color picker dropdown could go here, for now text input */}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Small Title (Tag)</label>
                                <input
                                    value={card.title}
                                    onChange={(e) => updateCard(idx, 'title', e.target.value)}
                                    className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Main Headline</label>
                                <input
                                    value={card.subtitle}
                                    onChange={(e) => updateCard(idx, 'subtitle', e.target.value)}
                                    className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-sm text-white font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                <input
                                    value={card.description}
                                    onChange={(e) => updateCard(idx, 'description', e.target.value)}
                                    className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-sm text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Link URL</label>
                                    <input
                                        value={card.href}
                                        onChange={(e) => updateCard(idx, 'href', e.target.value)}
                                        className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-sm text-gray-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Color Class</label>
                                    <select
                                        value={card.color}
                                        onChange={(e) => updateCard(idx, 'color', e.target.value)}
                                        className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-sm text-white"
                                    >
                                        <option value="bg-orange-500">Orange</option>
                                        <option value="bg-blue-600">Blue</option>
                                        <option value="bg-red-600">Red</option>
                                        <option value="bg-yellow-500">Yellow</option>
                                        <option value="bg-purple-600">Purple</option>
                                        <option value="bg-green-600">Green</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
