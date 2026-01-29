'use client'

import { useState } from 'react'
import { updateAnnouncementBar, updateFooter } from '@/app/admin/layout-site/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, Trash2, ToggleLeft, ToggleRight, Check } from 'lucide-react'

export default function LayoutBuilder({ announcement, footer }: { announcement: any, footer: any }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    // Announcement State
    const [announcementData, setAnnouncementData] = useState(announcement?.content_json || { text: '', link: '', show: true })

    // Footer State
    const [footerData, setFooterData] = useState(footer?.content_json || {
        newsletterTitle: 'SUBSCRIBE TO OUR NEWSLETTER',
        socialLinks: { twitter: '', facebook: '', instagram: '', youtube: '' },
        infoLinks: [],
        supportLinks: []
    })

    // Handlers for Announcement
    const handleAnnouncementSubmit = async (formData: FormData) => {
        setLoading(true)
        setMessage('')
        // Add 'show' manually since checkbox might not send if unchecked or handled via state
        formData.set('show', announcementData.show ? 'on' : 'off')

        const res = await updateAnnouncementBar(formData)
        setLoading(false)
        if (res?.error) setMessage('Error updated announcement')
        else setMessage('Announcement updated!')
    }

    // Handlers for Footer
    const handleFooterSave = async () => {
        setLoading(true)
        const res = await updateFooter(footerData)
        setLoading(false)
        if (res?.error) setMessage('Error updating footer')
        else setMessage('Footer updated!')
    }

    const addLink = (column: 'infoLinks' | 'supportLinks') => {
        setFooterData({
            ...footerData,
            [column]: [...(footerData[column] || []), { label: 'New Link', url: '#' }]
        })
    }

    const updateLink = (column: 'infoLinks' | 'supportLinks', index: number, field: 'label' | 'url', value: string) => {
        const newLinks = [...footerData[column]]
        newLinks[index][field] = value
        setFooterData({ ...footerData, [column]: newLinks })
    }

    const removeLink = (column: 'infoLinks' | 'supportLinks', index: number) => {
        const newLinks = [...footerData[column]]
        newLinks.splice(index, 1)
        setFooterData({ ...footerData, [column]: newLinks })
    }

    return (
        <div className="space-y-8 max-w-4xl">
            {message && (
                <div className="p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex items-center gap-2 shadow-sm">
                    <Check className="h-4 w-4" /> {message}
                </div>
            )}

            {/* Announcement Bar Section */}
            <Card className="bg-white border-gray-200 text-gray-900 shadow-sm">
                <CardHeader>
                    <CardTitle>Top Announcement Bar</CardTitle>
                    <CardDescription>Manage the banner at the very top of the site.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleAnnouncementSubmit} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Active</label>
                            <button
                                type="button"
                                onClick={() => setAnnouncementData({ ...announcementData, show: !announcementData.show })}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                {announcementData.show ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8 text-gray-400" />}
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Text</label>
                            <input
                                name="text"
                                value={announcementData.text}
                                onChange={(e) => setAnnouncementData({ ...announcementData, text: e.target.value })}
                                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g., Free Shipping on orders over ₹2000"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Link URL (Optional)</label>
                            <input
                                name="link"
                                value={announcementData.link}
                                onChange={(e) => setAnnouncementData({ ...announcementData, link: e.target.value })}
                                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="#"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Announcement
                        </button>
                    </form>
                </CardContent>
            </Card>

            {/* Footer Section */}
            <Card className="bg-white border-gray-200 text-gray-900 shadow-sm">
                <CardHeader>
                    <CardTitle>Footer Configuration</CardTitle>
                    <CardDescription>Customize the footer links and text.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Newsletter Title</label>
                        <input
                            value={footerData.newsletterTitle}
                            onChange={(e) => setFooterData({ ...footerData, newsletterTitle: e.target.value })}
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Twitter URL</label>
                            <input
                                value={footerData.socialLinks?.twitter || ''}
                                onChange={(e) => setFooterData({ ...footerData, socialLinks: { ...footerData.socialLinks, twitter: e.target.value } })}
                                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Facebook URL</label>
                            <input
                                value={footerData.socialLinks?.facebook || ''}
                                onChange={(e) => setFooterData({ ...footerData, socialLinks: { ...footerData.socialLinks, facebook: e.target.value } })}
                                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Instagram URL</label>
                            <input
                                value={footerData.socialLinks?.instagram || ''}
                                onChange={(e) => setFooterData({ ...footerData, socialLinks: { ...footerData.socialLinks, instagram: e.target.value } })}
                                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">YouTube URL</label>
                            <input
                                value={footerData.socialLinks?.youtube || ''}
                                onChange={(e) => setFooterData({ ...footerData, socialLinks: { ...footerData.socialLinks, youtube: e.target.value } })}
                                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 grid md:grid-cols-2 gap-8">
                        {/* Info Column */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Info Column</label>
                                <button
                                    onClick={() => addLink('infoLinks')}
                                    className="flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                                >
                                    <Plus className="h-3 w-3" /> Add Link
                                </button>
                            </div>
                            <div className="space-y-2">
                                {footerData.infoLinks?.map((link: any, i: number) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            value={link.label}
                                            onChange={(e) => updateLink('infoLinks', i, 'label', e.target.value)}
                                            placeholder="Label"
                                            className="flex-1 rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                        />
                                        <input
                                            value={link.url}
                                            onChange={(e) => updateLink('infoLinks', i, 'url', e.target.value)}
                                            placeholder="URL"
                                            className="flex-1 rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                        />
                                        <button
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            onClick={() => removeLink('infoLinks', i)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Support Column */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Support Column</label>
                                <button
                                    onClick={() => addLink('supportLinks')}
                                    className="flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                                >
                                    <Plus className="h-3 w-3" /> Add Link
                                </button>
                            </div>
                            <div className="space-y-2">
                                {footerData.supportLinks?.map((link: any, i: number) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            value={link.label}
                                            onChange={(e) => updateLink('supportLinks', i, 'label', e.target.value)}
                                            placeholder="Label"
                                            className="flex-1 rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                        />
                                        <input
                                            value={link.url}
                                            onChange={(e) => updateLink('supportLinks', i, 'url', e.target.value)}
                                            placeholder="URL"
                                            className="flex-1 rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                        />
                                        <button
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            onClick={() => removeLink('supportLinks', i)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleFooterSave}
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Footer Settings
                    </button>
                </CardContent>
            </Card>
        </div>
    )
}
