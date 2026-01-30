'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { User, Camera, Loader2 } from 'lucide-react'
import { useState } from 'react'

export function AvatarUpload({ initialUrl, onUpload }: { initialUrl?: string | null, onUpload: (url: string) => void }) {
    const [url, setUrl] = useState(initialUrl)
    const [isUploading, setIsUploading] = useState(false)

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-muted flex items-center justify-center">
                    {url ? (
                        <img src={url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-12 h-12 text-muted-foreground" />
                    )}
                </div>

                <CldUploadWidget
                    uploadPreset="ml_default" // Use your preset
                    onSuccess={(result: any) => {
                        const secureUrl = result?.info?.secure_url
                        if (secureUrl) {
                            setUrl(secureUrl)
                            onUpload(secureUrl)
                        }
                        setIsUploading(false)
                    }}
                    onUploadAdded={() => setIsUploading(true)}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            disabled={isUploading}
                            className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-500 transition-all transform group-hover:scale-110 active:scale-95 disabled:opacity-50"
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                        </button>
                    )}
                </CldUploadWidget>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Profile Image</p>
        </div>
    )
}
