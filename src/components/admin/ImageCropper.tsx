
import React, { useState, useRef, useEffect } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Loader2, Crop as CropIcon } from 'lucide-react'

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
    aspectRatio: number // e.g., 16/9, 4/3, etc.
    onCropComplete: (croppedBlob: Blob) => void
}

export function ImageCropper({ isOpen, onClose, imageFile, aspectRatio, onCropComplete }: ImageCropperProps) {
    const [imgSrc, setImgSrc] = useState('')
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [loading, setLoading] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    // Load image from file
    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader()
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
            reader.readAsDataURL(imageFile)
        }
    }, [imageFile])

    // Set initial crop when image loads
    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget
        setCrop(centerAspectCrop(width, height, aspectRatio))
    }

    // Generate the cropped blob
    async function handleSave() {
        if (!completedCrop || !imgRef.current) return

        setLoading(true)
        const image = imgRef.current
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        // High res output
        const pixelRatio = window.devicePixelRatio
        canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio)

        ctx.scale(pixelRatio, pixelRatio)
        ctx.imageSmoothingQuality = 'high'

        const cropX = completedCrop.x * scaleX
        const cropY = completedCrop.y * scaleY
        const cropWidth = completedCrop.width * scaleX
        const cropHeight = completedCrop.height * scaleY

        const centerX = image.naturalWidth / 2
        const centerY = image.naturalHeight / 2

        ctx.save()
        // 5) Move the crop origin to the canvas origin (0,0)
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
        }, 'image/jpeg', 0.95)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-4 min-h-[400px] bg-slate-900/5 rounded-lg overflow-hidden">
                    {imgSrc ? (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspectRatio}
                            className="max-h-[60vh]"
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                onLoad={onImageLoad}
                                style={{ maxHeight: '60vh' }}
                            />
                        </ReactCrop>
                    ) : (
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CropIcon className="w-4 h-4 mr-2" />}
                        Save Crop
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
