import React, { useState, useRef, useEffect } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Loader2, Crop as CropIcon, X } from 'lucide-react'

// Helper to center the crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

interface ImageCropperProps {
    isOpen: boolean
    onClose: () => void
    imageFile: File | null
    aspectRatio: number
    onCropComplete: (croppedBlob: Blob) => void
}

export function ImageCropper({ isOpen, onClose, imageFile, aspectRatio, onCropComplete }: ImageCropperProps) {
    const [imgSrc, setImgSrc] = useState('')
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [loading, setLoading] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (imageFile) {
            setLoading(true)
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '')
                setLoading(false)
            })
            reader.readAsDataURL(imageFile)
        }
    }, [imageFile])

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget
        setCrop(centerAspectCrop(width, height, aspectRatio))
    }

    async function handleSave() {
        if (!completedCrop || !imgRef.current) return

        setLoading(true)
        const image = imgRef.current
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        const pixelRatio = window.devicePixelRatio
        canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio)

        ctx.scale(pixelRatio, pixelRatio)
        ctx.imageSmoothingQuality = 'high'

        const cropX = completedCrop.x * scaleX
        const cropY = completedCrop.y * scaleY

        ctx.save()
        ctx.translate(-cropX, -cropY)
        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
        )

        ctx.restore()

        canvas.toBlob((blob) => {
            if (blob) {
                onCropComplete(blob)
                onClose()
            }
            setLoading(false)
        }, 'image/webp', 0.95)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <CropIcon className="w-5 h-5 text-blue-600" />
                        Crop Image
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 bg-slate-50 flex items-center justify-center min-h-[400px]">
                    {imgSrc ? (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspectRatio}
                            className="shadow-xl rounded-lg overflow-hidden border border-slate-200 bg-white"
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                onLoad={onImageLoad}
                                style={{ maxHeight: '60vh', display: 'block' }}
                            />
                        </ReactCrop>
                    ) : (
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all transform active:scale-95"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CropIcon className="w-4 h-4" />}
                        Save Crop
                    </button>
                </div>
            </div>
        </div>
    )
}
