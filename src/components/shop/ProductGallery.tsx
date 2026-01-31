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
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 group/stage">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="h-full w-full relative transition-transform duration-700 group-hover/stage:scale-105"
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
                            <div className="h-full w-full p-12">
                                <Image
                                    src={current.cloudinary_url}
                                    alt="Product View"
                                    fill
                                    className="object-contain"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${selectedIndex === idx
                                ? 'border-primary ring-4 ring-primary/10 scale-105'
                                : 'border-slate-50 bg-white hover:border-slate-200'
                                }`}
                        >
                            <Image
                                src={img.media_type === 'video' ? '/video-placeholder.png' : img.cloudinary_url} // Fallback for video thumb if no poster
                                alt={`Thumbnail ${idx}`}
                                fill
                                className="object-contain p-2"
                            />
                            {/* Video Indicator Overlay */}
                            {isVideo(img.cloudinary_url, img.media_type) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                    <div className="w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-primary">
                                        <Play className="h-4 w-4 fill-current ml-0.5" />
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
