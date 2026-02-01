'use client'

import { updateSettings, fixDatabasePermissions } from '@/app/admin/settings/actions'
import React, { useState, useTransition, useEffect } from 'react'
import { Save, AlertTriangle, ImagePlus, X, Plus, Trash2 } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'

export function SettingsForm({ settings, categories = [] }: { settings: any, categories?: any[] }) {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState('')
    const [logoUrl, setLogoUrl] = useState(settings?.logo_url || '')

    {/* Filter Configuration Removed as per request (Now Dynamic) */ }


    {/* Danger Zone */ }
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-red-600 flex items-center gap-2 border-b border-red-100 pb-2">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                </h3>

                <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div>
                        <div className="font-medium text-red-900">Maintenance Mode</div>
                        <div className="text-sm text-red-700">Disable store access for customers.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="maintenance_mode"
                            defaultChecked={settings?.maintenance_mode}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-md"
                >
                    <Save className="h-4 w-4" />
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>

                <div className="text-right">
                    <button
                        type="button"
                        onClick={async () => {
                            if (!confirm('Run database repair? This will reset order permissions.')) return
                            startTransition(async () => {
                                const res = await import('@/app/admin/settings/actions').then(m => m.fixDatabasePermissions())
                                if (res.error) setMessage(res.error)
                                else setMessage(res.success || 'Fixed!')
                            })
                        }}
                        className="text-xs text-gray-500 hover:text-red-500 underline"
                    >
                        Repair Database Permissions
                    </button>
                </div>
            </div>
        </form >
    )
}
