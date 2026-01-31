'use client'

import { useState } from 'react'
import { updateFooter } from '@/app/admin/homepage/actions'
import { Plus, Trash2, ChevronDown, ChevronUp, Palette, Link as LinkIcon, ShieldCheck, Mail, Globe } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'

type LinkItem = {
    label: string
    href: string
}

type LinkGroup = {
    title: string
    links: LinkItem[]
}

type TrustBadge = {
    icon: string
    title: string
    desc: string
}

type FooterConfig = {
    style: {
        backgroundColor: string
        textColor: string
        accentColor: string
    }
    contact: {
        email: string
        phone: string
    }
    socialLinks: {
        twitter: string
        instagram: string
        youtube: string
        facebook: string
    }
    trustBadges: TrustBadge[]
    linkGroups: LinkGroup[]
    copyrightText: string
    creditsText: string
}

export function FooterEditor({ initialConfig }: { initialConfig: any }) {
    // Default fallback state
    const [config, setConfig] = useState<FooterConfig>({
        style: {
            backgroundColor: initialConfig?.style?.backgroundColor || '#050a18',
            textColor: initialConfig?.style?.textColor || '#ffffff',
            accentColor: initialConfig?.style?.accentColor || '#3b82f6'
        },
        contact: {
            email: initialConfig?.contact?.email || 'support@techdev.store',
            phone: initialConfig?.contact?.phone || '+1 (800) 555-0199'
        },
        socialLinks: {
            twitter: initialConfig?.socialLinks?.twitter || '',
            instagram: initialConfig?.socialLinks?.instagram || '',
            youtube: initialConfig?.socialLinks?.youtube || '',
            facebook: initialConfig?.socialLinks?.facebook || ''
        },
        trustBadges: initialConfig?.trustBadges || [
            { icon: 'PackageCheck', title: 'Global Shipping', desc: 'Free expedited delivery on all orders.' },
            { icon: 'RotateCcw', title: '30-Day Returns', desc: 'No-questions-asked return policy.' },
            { icon: 'ShieldCheck', title: 'Secure Warranty', desc: '2-year manufacturer warranty included.' }
        ],
        linkGroups: initialConfig?.linkGroups || [
            {
                title: 'Shop', links: [
                    { label: 'All Products', href: '/products' },
                    { label: 'New Arrivals', href: '/products?sort=newest' }
                ]
            },
            {
                title: 'Support', links: [
                    { label: 'Order Status', href: '/user/orders' },
                    { label: 'Contact Us', href: '/contact' }
                ]
            },
            {
                title: 'Legal', links: [
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Terms', href: '/terms' }
                ]
            }
        ],
        copyrightText: initialConfig?.copyrightText || 'TECHDEV',
        creditsText: initialConfig?.creditsText || 'Authorized Dealer'
    })

    const [activeTab, setActiveTab] = useState<'content' | 'links' | 'style'>('content')

    const handleSubmit = async (formData: FormData) => {
        // Inject the full JSON into the form data before sending
        // We'll effectively ignore the granular formData fields in the server action if we send the JSON
        // but looking at existing action, it expects fields. We might need to override the action or pass a specific JSON field.
        // Let's assume we update the action to handle 'fullConfig'.
        formData.append('fullConfig', JSON.stringify(config))
        await updateFooter(formData)
    }

    // --- Helpers ---
    const updateStyle = (key: keyof FooterConfig['style'], val: string) => {
        setConfig(prev => ({ ...prev, style: { ...prev.style, [key]: val } }))
    }

    const updateContact = (key: keyof FooterConfig['contact'], val: string) => {
        setConfig(prev => ({ ...prev, contact: { ...prev.contact, [key]: val } }))
    }

    const updateSocial = (key: keyof FooterConfig['socialLinks'], val: string) => {
        setConfig(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: val } }))
    }

    const updateTrustBadge = (idx: number, field: keyof TrustBadge, val: string) => {
        const newBadges = [...config.trustBadges]
        newBadges[idx] = { ...newBadges[idx], [field]: val }
        setConfig(prev => ({ ...prev, trustBadges: newBadges }))
    }

    // Link Groups
    const updateGroupTitle = (idx: number, val: string) => {
        const newGroups = [...config.linkGroups]
        newGroups[idx].title = val
        setConfig(prev => ({ ...prev, linkGroups: newGroups }))
    }

    const addLink = (groupIdx: number) => {
        const newGroups = [...config.linkGroups]
        newGroups[groupIdx].links.push({ label: 'New Link', href: '/' })
        setConfig(prev => ({ ...prev, linkGroups: newGroups }))
    }

    const updateLink = (groupIdx: number, linkIdx: number, field: keyof LinkItem, val: string) => {
        const newGroups = [...config.linkGroups]
        newGroups[groupIdx].links[linkIdx] = { ...newGroups[groupIdx].links[linkIdx], [field]: val }
        setConfig(prev => ({ ...prev, linkGroups: newGroups }))
    }

    const removeLink = (groupIdx: number, linkIdx: number) => {
        const newGroups = [...config.linkGroups]
        newGroups[groupIdx].links.splice(linkIdx, 1)
        setConfig(prev => ({ ...prev, linkGroups: newGroups }))
    }

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" /> Dynamic Footer
                </h3>
                <div className="flex gap-2">
                    {['content', 'links', 'style'].map(tab => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <form action={handleSubmit} className="space-y-6">

                {/* --- STYLE TAB --- */}
                {activeTab === 'style' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Background</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={config.style.backgroundColor} onChange={e => updateStyle('backgroundColor', e.target.value)} className="h-10 w-10 rounded cursor-pointer border-0 p-0" />
                                <input type="text" value={config.style.backgroundColor} onChange={e => updateStyle('backgroundColor', e.target.value)} className="flex-1 text-sm border-gray-200 rounded-md" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Text Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={config.style.textColor} onChange={e => updateStyle('textColor', e.target.value)} className="h-10 w-10 rounded cursor-pointer border-0 p-0" />
                                <input type="text" value={config.style.textColor} onChange={e => updateStyle('textColor', e.target.value)} className="flex-1 text-sm border-gray-200 rounded-md" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-400">Accent Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={config.style.accentColor} onChange={e => updateStyle('accentColor', e.target.value)} className="h-10 w-10 rounded cursor-pointer border-0 p-0" />
                                <input type="text" value={config.style.accentColor} onChange={e => updateStyle('accentColor', e.target.value)} className="flex-1 text-sm border-gray-200 rounded-md" />
                            </div>
                        </div>
                        <div className="space-y-2 col-span-full">
                            <label className="text-xs font-bold uppercase text-gray-400">Copyright Brand</label>
                            <input
                                value={config.copyrightText}
                                onChange={e => setConfig({ ...config, copyrightText: e.target.value })}
                                className="w-full text-sm border-gray-200 rounded-md"
                            />
                        </div>
                    </div>
                )}

                {/* --- CONTENT TAB --- */}
                {activeTab === 'content' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Contact */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2"><Mail className="w-4 h-4" /> Contact Info</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input placeholder="Support Email" value={config.contact.email} onChange={e => updateContact('email', e.target.value)} className="text-sm border-gray-200 rounded-md" />
                                <input placeholder="Support Phone" value={config.contact.phone} onChange={e => updateContact('phone', e.target.value)} className="text-sm border-gray-200 rounded-md" />
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2"><Palette className="w-4 h-4" /> Social Links</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input placeholder="Twitter URL" value={config.socialLinks.twitter} onChange={e => updateSocial('twitter', e.target.value)} className="text-sm border-gray-200 rounded-md" />
                                <input placeholder="Instagram URL" value={config.socialLinks.instagram} onChange={e => updateSocial('instagram', e.target.value)} className="text-sm border-gray-200 rounded-md" />
                                <input placeholder="YouTube URL" value={config.socialLinks.youtube} onChange={e => updateSocial('youtube', e.target.value)} className="text-sm border-gray-200 rounded-md" />
                                <input placeholder="Facebook URL" value={config.socialLinks.facebook} onChange={e => updateSocial('facebook', e.target.value)} className="text-sm border-gray-200 rounded-md" />
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Trust Badges</h4>
                            {config.trustBadges.map((badge, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Icon Name (Lucide)</label>
                                        <input value={badge.icon} onChange={e => updateTrustBadge(idx, 'icon', e.target.value)} className="w-full text-xs border-gray-200 rounded" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Title</label>
                                        <input value={badge.title} onChange={e => updateTrustBadge(idx, 'title', e.target.value)} className="w-full text-xs border-gray-200 rounded" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Description</label>
                                        <input value={badge.desc} onChange={e => updateTrustBadge(idx, 'desc', e.target.value)} className="w-full text-xs border-gray-200 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- LINKS TAB --- */}
                {activeTab === 'links' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {config.linkGroups.map((group, groupIdx) => (
                            <div key={groupIdx} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                                <div className="mb-4">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Column Title</label>
                                    <input
                                        value={group.title}
                                        onChange={e => updateGroupTitle(groupIdx, e.target.value)}
                                        className="font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    {group.links.map((link, linkIdx) => (
                                        <div key={linkIdx} className="flex gap-2 items-center">
                                            <input
                                                value={link.label}
                                                onChange={e => updateLink(groupIdx, linkIdx, 'label', e.target.value)}
                                                className="flex-1 text-sm border-gray-200 rounded shadow-sm"
                                                placeholder="Label"
                                            />
                                            <input
                                                value={link.href}
                                                onChange={e => updateLink(groupIdx, linkIdx, 'href', e.target.value)}
                                                className="flex-1 text-sm border-gray-200 rounded shadow-sm text-gray-500 font-mono text-xs"
                                                placeholder="/url"
                                            />
                                            <button type="button" onClick={() => removeLink(groupIdx, linkIdx)} className="text-red-400 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addLink(groupIdx)}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"
                                    >
                                        <Plus className="w-3 h-3" /> Add Link
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-6 py-2.5 font-bold text-white transition-all hover:bg-blue-700 shadow-md flex items-center gap-2"
                    >
                        <ShieldCheck className="w-4 h-4" /> Save Footer Configuration
                    </button>
                </div>
            </form>
        </section>
    )
}
