'use client'

import { useState } from 'react'
import * as Icons from 'lucide-react'
import { Search, X } from 'lucide-react'

// Popular icon names for categories
const POPULAR_ICONS = [
    'Laptop', 'Smartphone', 'Headphones', 'Watch', 'Tablet', 'Monitor',
    'Keyboard', 'Mouse', 'Mic', 'Camera', 'Gamepad2', 'Cpu',
    'HardDrive', 'Speaker', 'Printer', 'Router', 'Usb', 'Battery',
    'Lightbulb', 'Zap', 'Wifi', 'Bluetooth', 'Cast', 'Radio',
    'Tv', 'Video', 'Music', 'Image', 'Film', 'Package',
    'ShoppingBag', 'ShoppingCart', 'Gift', 'Tag', 'Star', 'Heart'
]

interface IconPickerProps {
    value?: string
    onChange: (iconName: string) => void
    onClose?: () => void
}

export function IconPicker({ value, onChange, onClose }: IconPickerProps) {
    const [search, setSearch] = useState('')
    const [selectedIcon, setSelectedIcon] = useState(value || '')

    // Filter icons based on search
    const filteredIcons = POPULAR_ICONS.filter(name =>
        name.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = (iconName: string) => {
        setSelectedIcon(iconName)
        onChange(iconName)
        onClose?.()
    }

    const renderIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName]
        if (!IconComponent) return null
        return <IconComponent className="w-5 h-5" />
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Select Icon</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search icons..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Icon Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-6 gap-3">
                        {filteredIcons.map((iconName) => (
                            <button
                                key={iconName}
                                onClick={() => handleSelect(iconName)}
                                className={`
                                    flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                                    hover:border-blue-500 hover:bg-blue-50
                                    ${selectedIcon === iconName
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 bg-white'
                                    }
                                `}
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

                    {filteredIcons.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            No icons found matching "{search}"
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            {selectedIcon && (
                                <span className="flex items-center gap-2">
                                    Selected: <strong>{selectedIcon}</strong>
                                    {renderIcon(selectedIcon)}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
