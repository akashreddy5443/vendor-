'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus } from 'lucide-react'
import { useState } from 'react'

export default function AdminMediaPage() {
    const [uploadedImages, setUploadedImages] = useState<string[]>([])

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Media Library</h2>
                <p className="text-gray-400">Manage your uploaded images and videos.</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-8">
                    <CldUploadWidget
                        uploadPreset="ml_default"
                        onSuccess={(result: any) => {
                            if (result.info?.secure_url) {
                                setUploadedImages((prev) => [result.info.secure_url, ...prev])
                            }
                        }}
                    >
                        {({ open }) => (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-500"
                            >
                                <ImagePlus className="h-4 w-4" />
                                Upload New Media
                            </button>
                        )}
                    </CldUploadWidget>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    {uploadedImages.length === 0 && (
                        <div className="col-span-full py-10 text-center text-gray-500 border border-dashed border-gray-800 rounded-lg">
                            No images uploaded in this session.
                            <br />
                            (Cloudinary Media Library API required to list all past images)
                        </div>
                    )}
                    {uploadedImages.map((url, idx) => (
                        <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-800 bg-black">
                            <img src={url} alt="Media" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
