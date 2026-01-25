'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'

// Helper to determine if url is video if media_type is missing, though DB has media_type
const isVideo = (url: string, type?: string) => {
    if (type === 'video') return true
    if (url.endsWith('.mp4') || url.endsWith('.webm')) return true
    return false
}

interface ProductImage {
    cloudinary_url: string
    media_type?: 'image' | 'video'
    is_primary?: boolean
}

export function ProductGallery({ images }: { images: ProductImage[] }) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    // Sort so primary is first if index 0 logic is desired, but usually passed in order or primary flag
    // We assume images[selectedIndex] is the target
    const current = images[selectedIndex]

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square w-full rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gray-500">
                No Media Available
            </div>
        )
    }

    const currentIsVideo = isVideo(current.cloudinary_url, current.media_type)

    return (
        <div className="flex flex-col gap-4">
            {/* Main Stage */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black border border-zinc-800 shadow-2xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full relative"
                    >
                        {currentIsVideo ? (
                            <div className="h-full w-full flex items-center justify-center bg-black">
                                <video
                                    src={current.cloudinary_url}
                                    controls
                                    autoPlay
                                    loop
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        ) : (
                            <Image
                                src={current.cloudinary_url}
                                alt="Product View"
                                fill
                                className="object-contain"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${selectedIndex === idx
                                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                                    : 'border-transparent hover:border-gray-600'
                                }`}
                        >
                            <Image
                                src={img.media_type === 'video' ? '/video-placeholder.png' : img.cloudinary_url} // Fallback for video thumb if no poster
                                alt={`Thumbnail ${idx}`}
                                fill
                                className="object-cover"
                            />
                            {/* Video Indicator Overlay */}
                            {isVideo(img.cloudinary_url, img.media_type) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <Play className="h-6 w-6 text-white fill-current" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
