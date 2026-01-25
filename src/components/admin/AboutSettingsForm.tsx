'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AboutSettingsForm({ initialData }: { initialData: any }) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(initialData?.content_json || {
        pageTitle: '',
        pageSubtitle: '',
        missionTitle: '',
        missionDescription: '',
        profile: { name: '', role: '', bio: '', imageUrl: '' },
        stats: []
    })
    const router = useRouter()
    const supabase = createClient()

    const handleChange = (field: string, value: any) => {
        setData((prev: any) => ({ ...prev, [field]: value }))
    }

    const handleProfileChange = (field: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            profile: { ...prev.profile, [field]: value }
        }))
    }

    // Simple Image Upload to Cloudinary (reusing logic if available) or generic URL input for now
    // For this step, I'll stick to URL input to keep it robust, user can paste Cloudinary URL

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase
            .from('homepage_sections')
            .update({ content_json: data, updated_at: new Date().toISOString() })
            .eq('section_type', 'about_page')

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

            {/* Header Section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">About Details Page</h3>

                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Page Title</label>
                        <input
                            type="text"
                            value={data.pageTitle}
                            onChange={(e) => handleChange('pageTitle', e.target.value)}
                            className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Page Subtitle</label>
                        <input
                            type="text"
                            value={data.pageSubtitle}
                            onChange={(e) => handleChange('pageSubtitle', e.target.value)}
                            className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">Mission Section</h3>

                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Mission Section Title</label>
                        <input
                            type="text"
                            value={data.missionTitle}
                            onChange={(e) => handleChange('missionTitle', e.target.value)}
                            className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Mission Description</label>
                        <textarea
                            rows={4}
                            value={data.missionDescription}
                            onChange={(e) => handleChange('missionDescription', e.target.value)}
                            className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-4">Meet the Influencer</h3>

                <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                            <input
                                type="text"
                                value={data.profile?.name || ''}
                                onChange={(e) => handleProfileChange('name', e.target.value)}
                                className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Role/Title</label>
                            <input
                                type="text"
                                value={data.profile?.role || ''}
                                onChange={(e) => handleProfileChange('role', e.target.value)}
                                className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Profile Image URL</label>
                        <input
                            type="text"
                            value={data.profile?.imageUrl || ''}
                            onChange={(e) => handleProfileChange('imageUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Bio / Quote</label>
                        <textarea
                            rows={4}
                            value={data.profile?.bio || ''}
                            onChange={(e) => handleProfileChange('bio', e.target.value)}
                            className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                    Save Changes
                </button>
            </div>
        </form>
    )
}
