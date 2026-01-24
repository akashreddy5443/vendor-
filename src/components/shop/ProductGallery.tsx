'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
    images: {
        id: string
        cloudinary_url: string
        is_primary: boolean
        media_type?: 'image' | 'video'
    }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
    // Sort so primary is first or default
    const sortedImages = [...images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))

    // Store selected media object (url + type)
    const [selectedMedia, setSelectedMedia] = useState(
        sortedImages[0]
            ? { url: sortedImages[0].cloudinary_url, type: sortedImages[0].media_type || 'image' }
            : null
    )

    if (!selectedMedia) {
        return (
            <div className="aspect-square w-full rounded-xl border border-gray-800 bg-gray-900 flex items-center justify-center text-gray-500">
                No Media
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Media View */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                {selectedMedia.type === 'video' ? (
                    <video
                        src={selectedMedia.url}
                        className="h-full w-full object-contain"
                        controls
                        autoPlay
                        loop
                        muted
                    />
                ) : (
                    <Image
                        src={selectedMedia.url}
                        alt="Product Image"
                        fill
                        className="object-contain" // Changed to contain to ensure full product visibility
                        priority
                    />
                )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
                {sortedImages.map((image) => (
                    <button
                        key={image.id}
                        onClick={() => setSelectedMedia({ url: image.cloudinary_url, type: image.media_type || 'image' })}
                        className={cn(
                            "relative aspect-square overflow-hidden rounded-lg border bg-gray-900 transition-all",
                            selectedMedia.url === image.cloudinary_url
                                ? "border-orange-500 ring-2 ring-orange-500/50"
                                : "border-gray-800 hover:border-gray-600"
                        )}
                    >
                        {image.media_type === 'video' ? (
                            <div className="relative w-full h-full">
                                <video src={image.cloudinary_url} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div className="rounded-full bg-black/50 p-1">
                                        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Image
                                src={image.cloudinary_url}
                                alt="Thumbnail"
                                fill
                                className="object-cover"
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}
