'use client'

import { updateHero } from './actions'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, X } from 'lucide-react'
import { useState } from 'react'

export default function AdminHomepagePage() {
    // Ideally we would fetch existing data to populate defaultValues, 
    // but for this iteration we'll start with empty/placeholders or need to fetch server-side and pass down.
    // For speed, let's keep it client-side simplistic or assume user types it in. 
    // Creating a proper hybrid component is better.

    const [imageUrl, setImageUrl] = useState('')

    const handleSubmit = async (formData: FormData) => {
        await updateHero(formData)
    }

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Homepage Builder</h2>
                <p className="text-gray-400">Manage your homepage content.</p>
            </div>

            {/* Hero Section Editor */}
            <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-xl font-bold text-orange-500">Hero Section</h3>
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">Main Headline</label>
                        <input
                            name="title"
                            placeholder="LEVEL UP YOUR SETUP"
                            className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-orange-500 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">Subtitle</label>
                        <textarea
                            name="subtitle"
                            rows={3}
                            placeholder="Premium gear for developers..."
                            className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-orange-500 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">Background Image</label>
                        <input type="hidden" name="imageUrl" value={imageUrl} />

                        {imageUrl ? (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-700">
                                <img src={imageUrl} alt="Hero Background" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImageUrl('')}
                                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <CldUploadWidget
                                uploadPreset="ml_default"
                                onSuccess={(result: any) => {
                                    if (result.info?.secure_url) {
                                        setImageUrl(result.info.secure_url)
                                    }
                                }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 hover:border-orange-500 hover:bg-gray-800/50"
                                    >
                                        <ImagePlus className="h-8 w-8 text-gray-400" />
                                        <span className="text-sm text-gray-400">Upload Hero Image</span>
                                    </button>
                                )}
                            </CldUploadWidget>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="rounded-md bg-orange-600 px-4 py-2 font-bold text-white transition-colors hover:bg-orange-500"
                        >
                            Update Hero
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
