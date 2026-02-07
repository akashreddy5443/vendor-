'use client'

import { updateAnnouncement } from '@/app/admin/homepage/actions'
import { Megaphone, Save } from 'lucide-react'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
            <Save className="w-4 h-4" />
            {pending ? 'Saving...' : 'Save Changes'}
        </button>
    )
}

export function AnnouncementSettingsForm({ initialData }: { initialData: any }) {
    const [isActive, setIsActive] = useState(initialData?.is_active ?? true)

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    <Megaphone className="w-5 h-5" /> Announcement Bar
                </h3>
                <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                            {isActive ? 'Active' : 'Disabled'}
                        </span>
                    </label>
                </div>
            </div>

            <form action={updateAnnouncement} className="space-y-4">
                <input type="hidden" name="is_active" value={isActive.toString()} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Announcement Text</label>
                        <input
                            name="text"
                            defaultValue={initialData?.content_json?.text || "WELCOME TO TECHDEV STORE! FREE SHIPPING ON ORDERS OVER ₹2000"}
                            placeholder="Entet announcement text..."
                            className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Link URL (Optional)</label>
                        <input
                            name="link"
                            defaultValue={initialData?.content_json?.link || "#"}
                            placeholder="/products/sale"
                            className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <SubmitButton />
                </div>
            </form>
        </section>
    )
}
