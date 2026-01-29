'use client'

import { useState } from 'react'
import { Plus, Trash2, Tag, ShieldCheck, Zap, Clock, ShoppingBag, Headphones, Camera, Gamepad } from 'lucide-react'
import { updatePromoGrid } from '@/app/admin/homepage/actions'

const ICON_OPTIONS = [
    { value: 'Tag', label: 'Tag', icon: Tag },
    { value: 'ShieldCheck', label: 'Shield', icon: ShieldCheck },
    { value: 'Zap', label: 'Zap', icon: Zap },
    { value: 'Clock', label: 'Clock', icon: Clock },
    { value: 'ShoppingBag', label: 'Bag', icon: ShoppingBag },
    { value: 'Headphones', label: 'Headphones', icon: Headphones },
    { value: 'Camera', label: 'Camera', icon: Camera },
    { value: 'Gamepad', label: 'Gamepad', icon: Gamepad },
]

export function PromoGridEditor({ initialCards }: { initialCards: any[] }) {
    const [cards, setCards] = useState<any[]>(initialCards || [])

    const addCard = () => {
        setCards([...cards, {
            id: Date.now(),
            title: 'New Promo',
            subtitle: 'Subtitle',
            description: 'Description...',
            icon: 'Tag',
            color: 'bg-white border border-gray-100',
            href: '/products'
        }])
    }

    const removeCard = (index: number) => {
        const newCards = [...cards]
        newCards.splice(index, 1)
        setCards(newCards)
    }

    const updateCard = (index: number, field: string, value: string) => {
        const newCards = [...cards]
        newCards[index] = { ...newCards[index], [field]: value }
        setCards(newCards)
    }

    const handleSubmit = async (formData: FormData) => {
        formData.append('cards', JSON.stringify(cards))
        await updatePromoGrid(formData)
    }

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-purple-600 flex items-center gap-2">
                <Tag className="h-5 w-5" /> Promo Banners
            </h3>
            <p className="mb-4 text-sm text-gray-500">Manage the 4-column promo grid (Subtitle, Description, Icon).</p>

            <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((card, index) => (
                        <div key={card.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 relative group">
                            <button
                                type="button"
                                onClick={() => removeCard(index)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>

                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    value={card.title}
                                    onChange={(e) => updateCard(index, 'title', e.target.value)}
                                    placeholder="Badge Title (e.g. Sale)"
                                    className="w-full bg-white border border-gray-300 p-2 rounded text-sm text-gray-900"
                                />
                                <select
                                    value={card.icon}
                                    onChange={(e) => updateCard(index, 'icon', e.target.value)}
                                    className="w-full bg-white border border-gray-300 p-2 rounded text-sm text-gray-900"
                                >
                                    {ICON_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <input
                                value={card.subtitle}
                                onChange={(e) => updateCard(index, 'subtitle', e.target.value)}
                                placeholder="Main Subtitle (e.g. 50% OFF)"
                                className="w-full bg-white border border-gray-300 p-2 rounded text-sm text-gray-900 font-bold"
                            />

                            <textarea
                                value={card.description}
                                onChange={(e) => updateCard(index, 'description', e.target.value)}
                                placeholder="Description (Restricted height, expands on hover)"
                                className="w-full bg-white border border-gray-300 p-2 rounded text-sm text-gray-900 h-20"
                            />

                            <input
                                value={card.href}
                                onChange={(e) => updateCard(index, 'href', e.target.value)}
                                placeholder="Link URL"
                                className="w-full bg-white border border-gray-300 p-2 rounded text-sm text-gray-900"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                    <button type="button" onClick={addCard} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <Plus className="h-4 w-4" /> Add Banner
                    </button>
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors">
                        Save Promo Banners
                    </button>
                </div>
            </form>
        </section>
    )
}
