'use client'

import { useState, useRef } from 'react'
import * as Icons from 'lucide-react'
import { Search, X, Upload, Palette, Package } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'

const POPULAR_ICONS = [
    'Laptop', 'Smartphone', 'Headphones', 'Watch', 'Tablet', 'Monitor',
    'Keyboard', 'Mouse', 'Mic', 'Camera', 'Gamepad2', 'Cpu',
    'HardDrive', 'Speaker', 'Printer', 'Router', 'Usb', 'Battery',
    'Lightbulb', 'Zap', 'Wifi', 'Bluetooth', 'Cast', 'Radio',
    'Tv', 'Video', 'Music', 'Image', 'Film', 'Package',
    'ShoppingBag', 'ShoppingCart', 'Gift', 'Tag', 'Star', 'Heart'
]

const POPULAR_EMOJIS = [
    '💻', '📱', '🎧', '⌚', '📲', '🖥️',
    '⌨️', '🖱️', '🎤', '📷', '🎮', '💾',
    '🔊', '🖨️', '📡', '🔌', '🔋', '💡',
    '⚡', '📶', '🛜', '📻', '📺', '🎬',
    '🎵', '🖼️', '📦', '🛍️', '🛒', '🎁',
    '🏷️', '⭐', '❤️', '🔥', '✨', '🎯'
]

const COLOR_PRESETS = [
    { name: 'Blue', bg: '#E3F2FD', icon: '#1976D2' },
    { name: 'Purple', bg: '#F3E5F5', icon: '#7B1FA2' },
    { name: 'Pink', bg: '#FCE4EC', icon: '#C2185B' },
    { name: 'Green', bg: '#E8F5E9', icon: '#388E3C' },
    { name: 'Orange', bg: '#FFF3E0', icon: '#F57C00' },
    { name: 'Teal', bg: '#E0F2F1', icon: '#00796B' },
    { name: 'Yellow', bg: '#FFF9C4', icon: '#F9A825' },
    { name: 'Lime', bg: '#F1F8E9', icon: '#689F38' },
]

type IconType = 'emoji' | 'lucide' | 'custom'

interface IconPickerProps {
    value?: string
    bgColor?: string
    iconColor?: string
    customIconUrl?: string
    onChange: (data: {
        icon: string
        bgColor: string
        iconColor: string
        customIconUrl?: string
    }) => void
    onClose?: () => void
}

export function IconPicker({
    value = '',
    bgColor = '#F3F4F6',
    iconColor = '#6B7280',
    customIconUrl = '',
    onChange,
    onClose
}: IconPickerProps) {
    const [activeTab, setActiveTab] = useState<IconType>('emoji')
    const [search, setSearch] = useState('')
    const [selectedIcon, setSelectedIcon] = useState(value)
    const [selectedBgColor, setSelectedBgColor] = useState(bgColor)
    const [selectedIconColor, setSelectedIconColor] = useState(iconColor)
    const [selectedCustomUrl, setSelectedCustomUrl] = useState(customIconUrl)
    const [showBgPicker, setShowBgPicker] = useState(false)
    const [showIconPicker, setShowIconPicker] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const filteredIcons = POPULAR_ICONS.filter(name =>
        name.toLowerCase().includes(search.toLowerCase())
    )

    const filteredEmojis = search
        ? POPULAR_EMOJIS.filter(emoji => emoji.includes(search))
        : POPULAR_EMOJIS

    const handleSelect = (icon: string) => {
        setSelectedIcon(icon)
    }

    const handleDone = () => {
        onChange({
            icon: selectedIcon,
            bgColor: selectedBgColor,
            iconColor: selectedIconColor,
            customIconUrl: selectedCustomUrl
        })
        onClose?.()
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 1024 * 1024) {
            alert('File size must be less than 1MB')
            return
        }

        const url = URL.createObjectURL(file)
        setSelectedCustomUrl(url)
        setSelectedIcon('custom')
        setActiveTab('custom')
    }

    const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
        setSelectedBgColor(preset.bg)
        setSelectedIconColor(preset.icon)
    }

    const renderIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName]
        if (!IconComponent) return null
        return <IconComponent className="w-6 h-6" style={{ color: selectedIconColor }} />
    }

    const renderPreview = () => {
        if (selectedCustomUrl && activeTab === 'custom') {
            return (
                <img
                    src={selectedCustomUrl}
                    alt="Custom icon"
                    className="w-8 h-8 object-contain"
                />
            )
        }

        if (selectedIcon) {
            const isEmoji = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(selectedIcon)
            if (isEmoji || selectedIcon.length <= 2) {
                return <span className="text-3xl">{selectedIcon}</span>
            }

            return renderIcon(selectedIcon)
        }

        return <Package className="w-6 h-6" style={{ color: selectedIconColor }} />
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Customize Category Icon</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveTab('emoji')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'emoji' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            😀 Emoji
                        </button>
                        <button
                            onClick={() => setActiveTab('lucide')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'lucide' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Package className="w-4 h-4 inline mr-2" />
                            Lucide Icons
                        </button>
                        <button
                            onClick={() => setActiveTab('custom')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Upload className="w-4 h-4 inline mr-2" />
                            Custom Upload
                        </button>
                    </div>

                    {activeTab !== 'custom' && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={activeTab === 'emoji' ? 'Search emojis...' : 'Search icons...'}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-hidden flex">
                    <div className="flex-1 overflow-y-auto p-6 border-r border-gray-200">
                        {activeTab === 'emoji' && (
                            <div className="grid grid-cols-8 gap-2">
                                {filteredEmojis.map((emoji, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(emoji)}
                                        className={`p-3 rounded-xl border-2 transition-all text-2xl hover:border-blue-500 hover:bg-blue-50 ${selectedIcon === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                                            }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTab === 'lucide' && (
                            <div className="grid grid-cols-6 gap-3">
                                {filteredIcons.map((iconName) => (
                                    <button
                                        key={iconName}
                                        onClick={() => handleSelect(iconName)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:border-blue-500 hover:bg-blue-50 ${selectedIcon === iconName ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                                            }`}
                                        title={iconName}
                                    >
                                        <div className="text-gray-700">
                                            {renderIcon(iconName)}
                                        </div>
                                        <span className="text-[9px] text-gray-500 text-center leading-tight">
                                            {iconName}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTab === 'custom' && (
                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/svg+xml"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                                >
                                    <Upload className="w-5 h-5" />
                                    Upload Icon Image
                                </button>
                                <p className="text-sm text-gray-500">PNG, JPG, or SVG • Max 1MB</p>
                                {selectedCustomUrl && (
                                    <div className="mt-4 p-4 border-2 border-gray-200 rounded-xl">
                                        <img src={selectedCustomUrl} alt="Preview" className="w-24 h-24 object-contain" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-80 p-6 bg-gray-50 flex flex-col gap-6">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Live Preview</h4>
                            <div className="flex items-center justify-center p-8 bg-white rounded-xl border-2 border-gray-200">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: selectedBgColor }}
                                >
                                    {renderPreview()}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Color Presets</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {COLOR_PRESETS.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => applyPreset(preset)}
                                        className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all"
                                        title={preset.name}
                                    >
                                        <div className="absolute inset-0" style={{ backgroundColor: preset.bg }} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.icon }} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-gray-700">Background Color</h4>
                                <button
                                    onClick={() => setShowBgPicker(!showBgPicker)}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <Palette className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                                    style={{ backgroundColor: selectedBgColor }}
                                    onClick={() => setShowBgPicker(!showBgPicker)}
                                />
                                <input
                                    type="text"
                                    value={selectedBgColor}
                                    onChange={(e) => setSelectedBgColor(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                                />
                            </div>
                            {showBgPicker && (
                                <div className="mt-2">
                                    <HexColorPicker color={selectedBgColor} onChange={setSelectedBgColor} />
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-gray-700">Icon Color</h4>
                                <button
                                    onClick={() => setShowIconPicker(!showIconPicker)}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <Palette className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                                    style={{ backgroundColor: selectedIconColor }}
                                    onClick={() => setShowIconPicker(!showIconPicker)}
                                />
                                <input
                                    type="text"
                                    value={selectedIconColor}
                                    onChange={(e) => setSelectedIconColor(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                                />
                            </div>
                            {showIconPicker && (
                                <div className="mt-2">
                                    <HexColorPicker color={selectedIconColor} onChange={setSelectedIconColor} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 bg-white flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {selectedIcon && (
                            <span>Selected: <strong>{selectedIcon.length > 20 ? 'Custom Icon' : selectedIcon}</strong></span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDone}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Apply Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
