'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus } from 'lucide-react'
import { updateTrending } from '@/app/admin/homepage/actions'

type TrendingData = {
    hero: {
        image: string
        title: string
        tag: string
        link: string
    }
    sub1: {
        image: string
        title: string
        link: string
    }
    sub2: {
        image: string
        title: string
        link: string
    }
}

export function TrendingEditor({ initialData }: { initialData: TrendingData }) {
    const [data, setData] = useState<TrendingData>(initialData || {
        hero: { image: '', title: 'THE PRO GAMER EDIT', tag: 'New Arrival', link: '/search?category=laptops' },
        sub1: { image: '', title: 'CONSOLE READY', link: '/search?category=gaming' },
        sub2: { image: '', title: 'AUDIOPHILE GRADE', link: '/search?category=audio' }
    })

    const updateHero = (field: string, value: string) => {
        setData({ ...data, hero: { ...data.hero, [field]: value } })
    }
    const updateSub1 = (field: string, value: string) => {
        setData({ ...data, sub1: { ...data.sub1, [field]: value } })
    }
    const updateSub2 = (field: string, value: string) => {
        setData({ ...data, sub2: { ...data.sub2, [field]: value } })
    }

    const handleSubmit = async (formData: FormData) => {
        formData.append('data', JSON.stringify(data))
        await updateTrending(formData)
    }

    return (
        <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h3 className="mb-4 text-xl font-bold text-pink-500">Trending Spotlight (Editorial)</h3>
            <form action={handleSubmit} className="space-y-6">

                {/* Hero Item */}
                <div className="bg-gray-950 p-4 rounded border border-gray-800">
                    <h4 className="font-bold text-white mb-4">Main Feature (Large)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative aspect-video bg-gray-900 rounded border border-gray-700 overflow-hidden group">
                            {data.hero.image ? (
                                <CldUploadWidget uploadPreset="ml_default" onSuccess={(result: any) => updateHero('image', result.info.secure_url)}>
                                    {({ open }) => <img onClick={() => open()} src={data.hero.image} className="w-full h-full object-cover cursor-pointer hover:opacity-80" />}
                                </CldUploadWidget>
                            ) : (
                                <CldUploadWidget uploadPreset="ml_default" onSuccess={(result: any) => updateHero('image', result.info.secure_url)}>
                                    {({ open }) => <button type="button" onClick={() => open()} className="w-full h-full flex flex-col items-center justify-center text-gray-500"><ImagePlus /><span className="text-xs">Upload</span></button>}
                                </CldUploadWidget>
                            )}
                        </div>
                        <div className="space-y-2">
                            <input value={data.hero.tag} onChange={(e) => updateHero('tag', e.target.value)} placeholder="Tag (e.g. New Arrival)" className="w-full bg-black border border-gray-700 p-2 rounded text-white text-sm" />
                            <input value={data.hero.title} onChange={(e) => updateHero('title', e.target.value)} placeholder="Title" className="w-full bg-black border border-gray-700 p-2 rounded text-white text-sm" />
                            <input value={data.hero.link} onChange={(e) => updateHero('link', e.target.value)} placeholder="Link URL" className="w-full bg-black border border-gray-700 p-2 rounded text-white text-sm" />

                            <div className="pt-2 border-t border-gray-800">
                                <label className="text-xs text-gray-500 block mb-1">Hover Video URL (Optional)</label>
                                <div className="flex gap-2">
                                    <input
                                        value={(data.hero as any).video || ''}
                                        onChange={(e) => updateHero('video', e.target.value)}
                                        placeholder="https://...mp4"
                                        className="w-full bg-black border border-gray-700 p-2 rounded text-white text-sm"
                                    />
                                    <CldUploadWidget
                                        uploadPreset="ml_default"
                                        options={{ resourceType: 'video' }}
                                        onSuccess={(result: any) => updateHero('video', result.info.secure_url)}
                                    >
                                        {({ open }) => (
                                            <button
                                                type="button"
                                                onClick={() => open()}
                                                className="bg-gray-800 hover:bg-gray-700 text-white px-3 text-xs rounded border border-gray-700"
                                            >
                                                Upload
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sub Item 1 */}
                    <div className="bg-gray-950 p-4 rounded border border-gray-800">
                        <h4 className="font-bold text-gray-400 text-sm mb-2">Sub Item 1 (Top)</h4>
                        <div className="relative aspect-video bg-gray-900 rounded border border-gray-700 overflow-hidden group mb-2">
                            {data.sub1.image ? (
                                <CldUploadWidget uploadPreset="ml_default" onSuccess={(result: any) => updateSub1('image', result.info.secure_url)}>
                                    {({ open }) => <img onClick={() => open()} src={data.sub1.image} className="w-full h-full object-cover cursor-pointer hover:opacity-80" />}
                                </CldUploadWidget>
                            ) : (
                                <CldUploadWidget uploadPreset="ml_default" onSuccess={(result: any) => updateSub1('image', result.info.secure_url)}>
                                    {({ open }) => <button type="button" onClick={() => open()} className="w-full h-full flex flex-col items-center justify-center text-gray-500"><ImagePlus /><span className="text-xs">Upload</span></button>}
                                </CldUploadWidget>
                            )}
                        </div>
                        <input value={data.sub1.title} onChange={(e) => updateSub1('title', e.target.value)} placeholder="Title" className="w-full bg-black border border-gray-700 p-2 rounded text-white text-sm mb-2" />
                        <input value={data.sub1.link} onChange={(e) => updateSub1('link', e.target.value)} placeholder="Link URL" className="w-full bg-black border border-gray-700 p-2 rounded text-white text-sm" />
                    </div>

                    {/* Sub Item 2 */}
                    <div className="bg-gray-950 p-4 rounded border border-gray-800">
                        <h4 className="font-bold text-gray-400 text-sm mb-2">Sub Item 2 (Bottom)</h4>
                        <div className="relative aspect-video bg-gray-900 rounded border border-gray-700 overflow-hidden group mb-2">
                            {data.sub2.image ? (
                                <CldUploadWidget uploadPreset="ml_default" onSuccess={(result: any) => updateSub2('image', result.info.secure_url)}>
                                    {({ open }) => <img onClick={() => open()} src={data.sub2.image} className="w-full h-full object-cover cursor-pointer hover:opacity-80" />}
                                </CldUploadWidget>
                            ) : (
                                <CldUploadWidget uploadPreset="ml_default" onSuccess={(result: any) => updateSub2('image', result.info.secure_url)}>
                                    {({ open }) => <button type="button" onClick={() => open()} className="w-full h-full flex flex-col items-center justify-center text-gray-500"><ImagePlus /><span className="text-xs">Upload</span></button>}
                                </CldUploadWidget>
                            )}
                        </div>
                        <input value={data.sub2.title} onChange={(e) => updateSub2('title', e.target.value)} placeholder="Title" className="w-full bg-black border border-gray-700 p-2 rounded text-white text-sm mb-2" />
                        <input value={data.sub2.link} onChange={(e) => updateSub2('link', e.target.value)} placeholder="Link URL" className="w-full bg-black border border-gray-700 p-2 rounded text-white text-sm" />
                    </div>
                </div>

                <button type="submit" className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded font-bold text-sm">
                    Save Trending Spotlight
                </button>
            </form>
        </section>
    )
}
