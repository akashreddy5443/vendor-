'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useState } from 'react'
import { createCategory } from '../actions'
import { IconPicker } from '@/components/admin/IconPicker'

export default function NewCategoryPage() {
    const [imageUrl, setImageUrl] = useState('')
    const [icon, setIcon] = useState('')
    const [iconBgColor, setIconBgColor] = useState('#F3F4F6')
    const [iconColor, setIconColor] = useState('#6B7280')
    const [customIconUrl, setCustomIconUrl] = useState('')
    const [showIconPicker, setShowIconPicker] = useState(false)

    const renderIcon = () => {
        if (customIconUrl) {
            return <img src={customIconUrl} alt="Custom icon" className="w-8 h-8 object-contain" />
        }
        if (!icon) return null
        const IconComponent = (Icons as any)[icon]
        if (!IconComponent) return <span className="text-2xl">{icon}</span>
        return <IconComponent className="w-8 h-8" style={{ color: iconColor }} />
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900">New Category</h2>
                <p className="text-gray-500">Initialize a new unit in the collection.</p>
            </div>

            <div className="rounded-[2.5rem] border border-gray-100 bg-white/80 backdrop-blur-xl p-8 shadow-2xl shadow-indigo-100/50">
                <form
                    action={async (formData) => {
                        await createCategory(formData)
                    }}
                    className="space-y-8"
                >
                    <input type="hidden" name="image_url" value={imageUrl} />
                    <input type="hidden" name="icon" value={icon} />
                    <input type="hidden" name="icon_bg_color" value={iconBgColor} />
                    <input type="hidden" name="icon_color" value={iconColor} />
                    <input type="hidden" name="custom_icon_url" value={customIconUrl} />

                    {/* Visual Asset Section */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Visual Identity</label>
                        <div className="flex items-center gap-6">
                            <div className="relative h-32 w-28 shrink-0 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group transition-all hover:border-indigo-300">
                                {imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <CldUploadWidget
                                                uploadPreset="ml_default"
                                                onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
                                            >
                                                {({ open }) => (
                                                    <button type="button" onClick={() => open()} className="text-[10px] font-black text-white uppercase tracking-widest px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-md border border-white/30">
                                                        Change
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        </div>
                                    </>
                                ) : (
                                    <CldUploadWidget
                                        uploadPreset="ml_default"
                                        onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
                                    >
                                        {({ open }) => (
                                            <button type="button" onClick={() => open()} className="flex flex-col items-center text-gray-400 hover:text-indigo-600 transition-colors">
                                                <ImagePlus className="w-8 h-8 mb-2" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-center">Upload Cover</span>
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <h4 className="text-sm font-bold text-gray-900">Category Cover</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Define the visual signature for this category.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Category Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            required
                            className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-bold text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                            placeholder="e.g. Smart Home"
                        />
                    </div>

                    {/* Icon Picker Section */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category Icon</label>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setShowIconPicker(true)}
                                className="flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-400 bg-gray-50/50 hover:bg-indigo-50/50 transition-all group"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors"
                                    style={{ backgroundColor: iconBgColor }}
                                >
                                    {icon ? renderIcon() : <ImagePlus className="w-6 h-6" />}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-gray-900">
                                        {icon || 'Select Icon'}
                                    </div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                                        Click to choose
                                    </div>
                                </div>
                            </button>
                            {icon && (
                                <button
                                    type="button"
                                    onClick={() => setIcon('')}
                                    className="px-4 py-2 text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                            This icon will appear in the Navbar catalog dropdown beside the category name.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-gray-50">
                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-indigo-600 py-4 font-black text-white hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase text-xs tracking-[0.2em]"
                        >
                            Deploy Category
                        </button>
                    </div>
                </form>
            </div>

            {/* Icon Picker Modal */}
            {showIconPicker && (
                <IconPicker
                    value={icon}
                    bgColor={iconBgColor}
                    iconColor={iconColor}
                    customIconUrl={customIconUrl}
                    onChange={(data) => {
                        setIcon(data.icon)
                        setIconBgColor(data.bgColor)
                        setIconColor(data.iconColor)
                        setCustomIconUrl(data.customIconUrl || '')
                    }}
                    onClose={() => setShowIconPicker(false)}
                />
            )}
        </div>
    )
}
