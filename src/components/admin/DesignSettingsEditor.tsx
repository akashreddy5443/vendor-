'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Palette, Type, Box, Save, RotateCcw } from 'lucide-react'

type DesignSettings = {
    primary_color: string
    accent_color: string
    heading_font: string
    body_font: string
    card_radius: string
    button_radius: string
    shadow_style: string
}

export function DesignSettingsEditor() {
    const [settings, setSettings] = useState<DesignSettings>({
        primary_color: '#2d5cf7',
        accent_color: '#f59e0b',
        heading_font: 'Outfit',
        body_font: 'Inter',
        card_radius: 'rounded-2xl',
        button_radius: 'rounded-xl',
        shadow_style: 'soft'
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        const supabase = createClient()
        const { data } = await supabase
            .from('design_settings')
            .select('*')
            .eq('setting_key', 'global')
            .single()

        if (data) {
            setSettings({
                primary_color: data.primary_color,
                accent_color: data.accent_color,
                heading_font: data.heading_font,
                body_font: data.body_font,
                card_radius: data.card_radius,
                button_radius: data.button_radius,
                shadow_style: data.shadow_style
            })
        }
        setLoading(false)
    }

    const handleSave = async () => {
        setSaving(true)
        const supabase = createClient()

        const { error } = await supabase
            .from('design_settings')
            .update(settings)
            .eq('setting_key', 'global')

        if (!error) {
            alert('Design settings saved! Refresh the page to see changes.')
        } else {
            alert('Error saving settings: ' + error.message)
        }
        setSaving(false)
    }

    const handleReset = () => {
        if (confirm('Reset to default design settings?')) {
            setSettings({
                primary_color: '#2d5cf7',
                accent_color: '#f59e0b',
                heading_font: 'Outfit',
                body_font: 'Inter',
                card_radius: 'rounded-2xl',
                button_radius: 'rounded-xl',
                shadow_style: 'soft'
            })
        }
    }

    if (loading) {
        return <div className="p-8">Loading design settings...</div>
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <Palette className="w-6 h-6 text-blue-600" />
                            Design Settings
                        </h2>
                        <p className="text-sm text-slate-600">
                            Customize your brand colors, typography, and visual style
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Color Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-600" />
                    Brand Colors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Primary Color (Blue)
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                value={settings.primary_color}
                                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                                className="w-16 h-16 rounded-xl border-2 border-slate-200 cursor-pointer"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={settings.primary_color}
                                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
                                    placeholder="#2d5cf7"
                                />
                                <p className="text-xs text-slate-500 mt-1">Used for CTAs, links, active states</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Accent Color (Yellow)
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                value={settings.accent_color}
                                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                                className="w-16 h-16 rounded-xl border-2 border-slate-200 cursor-pointer"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={settings.accent_color}
                                    onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
                                    placeholder="#f59e0b"
                                />
                                <p className="text-xs text-slate-500 mt-1">Used for badges, highlights, urgency</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs text-blue-700">
                        <strong>Phase 1 Recommendation:</strong> Keep primary blue (#2d5cf7) and yellow accent (#f59e0b) for brand consistency. Avoid using multiple accent colors.
                    </p>
                </div>
            </div>

            {/* Typography Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5 text-blue-600" />
                    Typography
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Heading Font
                        </label>
                        <select
                            value={settings.heading_font}
                            onChange={(e) => setSettings({ ...settings, heading_font: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                        >
                            <option value="Outfit">Outfit (Recommended)</option>
                            <option value="Inter">Inter</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Montserrat">Montserrat</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">Used for all headings (H1, H2, H3, etc.)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Body Font
                        </label>
                        <select
                            value={settings.body_font}
                            onChange={(e) => setSettings({ ...settings, body_font: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                        >
                            <option value="Inter">Inter (Recommended)</option>
                            <option value="Outfit">Outfit</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Open Sans">Open Sans</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">Used for body text, descriptions, labels</p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="text-xs text-amber-700">
                        <strong>Phase 1 Recommendation:</strong> Use Outfit for headings and Inter for body text. Limit to 2 fonts maximum for visual consistency.
                    </p>
                </div>
            </div>

            {/* Visual Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Box className="w-5 h-5 text-blue-600" />
                    Visual Style
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Card Radius
                        </label>
                        <select
                            value={settings.card_radius}
                            onChange={(e) => setSettings({ ...settings, card_radius: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                        >
                            <option value="rounded-lg">Small (0.5rem)</option>
                            <option value="rounded-xl">Medium (0.75rem)</option>
                            <option value="rounded-2xl">Large (1rem) - Recommended</option>
                            <option value="rounded-3xl">Extra Large (1.5rem)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Button Radius
                        </label>
                        <select
                            value={settings.button_radius}
                            onChange={(e) => setSettings({ ...settings, button_radius: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                        >
                            <option value="rounded-lg">Small (0.5rem)</option>
                            <option value="rounded-xl">Medium (0.75rem) - Recommended</option>
                            <option value="rounded-2xl">Large (1rem)</option>
                            <option value="rounded-full">Pill (9999px)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Shadow Style
                        </label>
                        <select
                            value={settings.shadow_style}
                            onChange={(e) => setSettings({ ...settings, shadow_style: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                        >
                            <option value="soft">Soft (Recommended)</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-xs text-emerald-700">
                        <strong>Phase 1 Goal:</strong> Consistent visual style across all components. All cards should use the same radius, all buttons should match, and shadows should be uniform.
                    </p>
                </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card Preview */}
                    <div className={`${settings.card_radius} border border-slate-200 p-6 ${settings.shadow_style === 'soft' ? 'shadow-lg' : settings.shadow_style === 'medium' ? 'shadow-xl' : settings.shadow_style === 'hard' ? 'shadow-2xl' : ''}`}>
                        <h4 className="text-xl font-bold mb-2" style={{ fontFamily: settings.heading_font, color: settings.primary_color }}>
                            Sample Heading
                        </h4>
                        <p className="text-sm text-slate-600" style={{ fontFamily: settings.body_font }}>
                            This is how your body text will look with the selected typography settings.
                        </p>
                        <button
                            className={`mt-4 px-6 py-2 text-white font-medium ${settings.button_radius}`}
                            style={{ backgroundColor: settings.primary_color }}
                        >
                            Primary Button
                        </button>
                    </div>

                    {/* Badge Preview */}
                    <div className="flex flex-col gap-4">
                        <div className={`inline-flex items-center px-4 py-2 ${settings.button_radius} font-bold text-xs uppercase`} style={{ backgroundColor: settings.accent_color, color: '#fff' }}>
                            Featured Badge
                        </div>
                        <div className={`${settings.card_radius} border-2 p-4`} style={{ borderColor: settings.primary_color }}>
                            <p className="text-sm" style={{ fontFamily: settings.body_font }}>
                                Card with primary border color
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
