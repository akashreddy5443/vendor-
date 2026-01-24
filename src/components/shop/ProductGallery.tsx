'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
    images: {
        id: string
        cloudinary_url: string
        is_primary: boolean
    }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
    // Sort so primary is first or default
    const sortedImages = [...images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
    const [selectedImage, setSelectedImage] = useState(sortedImages[0]?.cloudinary_url || '')

    if (images.length === 0) {
        return (
            <div className="aspect-square w-full rounded-xl border border-gray-800 bg-gray-900 flex items-center justify-center text-gray-500">
                No Images
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                {selectedImage && (
                    <Image
                        src={selectedImage}
                        alt="Product Image"
                        fill
                        className="object-contain"
                        priority
                    />
                )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
                {sortedImages.map((image) => (
                    <button
                        key={image.id}
                        onClick={() => setSelectedImage(image.cloudinary_url)}
                        className={cn(
                            "relative aspect-square overflow-hidden rounded-lg border bg-gray-900 transition-all",
                            selectedImage === image.cloudinary_url
                                ? "border-orange-500 ring-2 ring-orange-500/50"
                                : "border-gray-800 hover:border-gray-600"
                        )}
                    >
                        <Image
                            src={image.cloudinary_url}
                            alt="Thumbnail"
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}
