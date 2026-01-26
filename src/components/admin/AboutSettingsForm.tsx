'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, ImagePlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CldUploadWidget } from 'next-cloudinary'

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

    const handleStatChange = (index: number, field: string, value: string) => {
        const newStats = [...(data.stats || [])]
        newStats[index] = { ...newStats[index], [field]: value }
        setData((prev: any) => ({ ...prev, stats: newStats }))
    }

    const addStat = () => {
        setData((prev: any) => ({
            ...prev,
            stats: [...(prev.stats || []), { value: '', label: '' }]
        }))
    }

    const removeStat = (index: number) => {
        const newStats = [...(data.stats || [])]
        newStats.splice(index, 1)
        setData((prev: any) => ({ ...prev, stats: newStats }))
    }

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

            {/* Stats Section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <h3 className="text-xl font-bold text-white">Key Stats</h3>
                    <button
                        type="button"
                        onClick={addStat}
                        className="text-sm bg-blue-600/10 text-blue-400 px-3 py-1 rounded-md hover:bg-blue-600/20 transition-colors"
                    >
                        + Add Stat
                    </button>
                </div>

                <div className="grid gap-4">
                    {(data.stats || []).map((stat: any, index: number) => (
                        <div key={index} className="flex gap-4 items-end bg-black/30 p-4 rounded-lg border border-zinc-800">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Value (e.g. 50K+)</label>
                                <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                                    className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Label (e.g. Reviews)</label>
                                <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                                    className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeStat(index)}
                                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                    ))}
                    {(data.stats || []).length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-4">No stats added yet.</p>
                    )}
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
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Profile Image <span className="text-gray-500 text-xs ml-2">(Recommended: 500x500px, 1:1 Aspect Ratio)</span>
                        </label>

                        {data.profile?.imageUrl ? (
                            <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-zinc-700 group">
                                <img src={data.profile.imageUrl} alt="Profile" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleProfileChange('imageUrl', '')}
                                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <CldUploadWidget
                                uploadPreset="ml_default"
                                options={{
                                    cropping: true,
                                    croppingAspectRatio: 1,
                                    validateMaxWidthHeight: true,
                                }}
                                onSuccess={(result: any) => {
                                    if (result.info?.secure_url) {
                                        handleProfileChange('imageUrl', result.info.secure_url)
                                    }
                                }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 bg-black hover:border-blue-500 hover:bg-zinc-900 transition-colors"
                                    >
                                        <ImagePlus className="h-6 w-6 text-gray-400" />
                                        <span className="text-xs text-gray-400">Upload Image</span>
                                    </button>
                                )}
                            </CldUploadWidget>
                        )}
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
