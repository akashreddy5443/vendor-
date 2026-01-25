'use client'

import { useState, useTransition } from 'react'
import { updateNotificationSetting, updateNotificationTemplate } from '@/app/admin/settings/notifications/actions'
import { Save, Bell, Mail, ToggleLeft, ToggleRight, Edit2, X } from 'lucide-react'

export function NotificationSettingsForm({ settings, templates }: { settings: any[], templates: any[] }) {
    const [isPending, startTransition] = useTransition()
    const [activeTab, setActiveTab] = useState<'toggles' | 'templates'>('toggles')
    const [editingTemplate, setEditingTemplate] = useState<string | null>(null)
    const [editingSetting, setEditingSetting] = useState<string | null>(null)

    // State for template editing
    const [tempSubject, setTempSubject] = useState('')
    const [tempBody, setTempBody] = useState('')

    // State for setting editing
    const [tempLabel, setTempLabel] = useState('')
    const [tempDesc, setTempDesc] = useState('')

    const handleToggle = (key: string, currentStatus: boolean) => {
        startTransition(async () => {
            await updateNotificationSetting(key, { is_active: !currentStatus })
        })
    }

    const startEditTemplate = (template: any) => {
        setEditingTemplate(template.template_key)
        setTempSubject(template.subject)
        setTempBody(template.body_content)
    }

    const saveTemplate = async (key: string) => {
        startTransition(async () => {
            await updateNotificationTemplate(key, { subject: tempSubject, body_content: tempBody })
            setEditingTemplate(null)
        })
    }

    const startEditSetting = (setting: any) => {
        setEditingSetting(setting.key)
        setTempLabel(setting.label)
        setTempDesc(setting.description)
    }

    const saveSetting = async (key: string) => {
        startTransition(async () => {
            await updateNotificationSetting(key, { label: tempLabel, description: tempDesc })
            setEditingSetting(null)
        })
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-800 pb-2">
                <button
                    onClick={() => setActiveTab('toggles')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'toggles'
                        ? 'bg-gray-900 text-white border-b-2 border-blue-500'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        <span>Notification Toggles & Labels</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'templates'
                        ? 'bg-gray-900 text-white border-b-2 border-blue-500'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>Email Templates</span>
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                {activeTab === 'toggles' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">User Notification Preferences</h3>
                            <p className="text-sm text-gray-400">Control which notifications users can toggle and how they are described.</p>
                        </div>

                        <div className="grid gap-4">
                            {settings.map((setting) => (
                                <div key={setting.key} className="flex flex-col gap-4 p-4 bg-gray-950 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                                    <div className="flex items-start justify-between">
                                        {editingSetting === setting.key ? (
                                            <div className="flex-1 space-y-4 mr-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-500 uppercase">Label</label>
                                                    <input
                                                        type="text"
                                                        value={tempLabel}
                                                        onChange={(e) => setTempLabel(e.target.value)}
                                                        className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white text-sm focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                                                    <input
                                                        type="text"
                                                        value={tempDesc}
                                                        onChange={(e) => setTempDesc(e.target.value)}
                                                        className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white text-sm focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveSetting(setting.key)}
                                                        disabled={isPending}
                                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                                                    >
                                                        {isPending ? 'Saving...' : 'Save'}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingSetting(null)}
                                                        className="px-3 py-1.5 text-gray-400 hover:text-white text-xs"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium text-white">{setting.label}</div>
                                                    <button
                                                        onClick={() => startEditSetting(setting)}
                                                        className="text-gray-600 hover:text-gray-400"
                                                    >
                                                        <Edit2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="text-sm text-gray-500">{setting.description}</div>
                                                <div className="text-xs text-gray-600 font-mono">Key: {setting.key}</div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleToggle(setting.key, setting.is_active)}
                                            disabled={isPending}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${setting.is_active ? 'bg-blue-600' : 'bg-gray-700'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${setting.is_active ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Email Templates</h3>
                            <p className="text-sm text-gray-400">Edit the content of system emails.</p>
                        </div>

                        <div className="grid gap-6">
                            {templates.map((template) => (
                                <div key={template.template_key} className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                                    <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                                        <div>
                                            <h4 className="font-bold text-white">{template.template_key}</h4>
                                            <div className="text-xs text-gray-500 mt-1">Variables: {JSON.stringify(template.variables)}</div>
                                        </div>
                                        {!editingTemplate && (
                                            <button
                                                onClick={() => startEditTemplate(template)}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {editingTemplate === template.template_key ? (
                                        <div className="p-4 space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400">Subject Line</label>
                                                <input
                                                    type="text"
                                                    value={tempSubject}
                                                    onChange={(e) => setTempSubject(e.target.value)}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400">HTML Body Content</label>
                                                <textarea
                                                    rows={10}
                                                    value={tempBody}
                                                    onChange={(e) => setTempBody(e.target.value)}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-white font-mono text-xs focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-3 pt-2">
                                                <button
                                                    onClick={() => setEditingTemplate(null)}
                                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => saveTemplate(template.template_key)}
                                                    disabled={isPending}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-md transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {isPending ? 'Saving...' : 'Save Template'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 space-y-3 opacity-75">
                                            <div className="text-sm">
                                                <span className="text-gray-500 font-medium">Subject: </span>
                                                <span className="text-gray-300">{template.subject}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono bg-black/30 p-2 rounded truncate">
                                                {template.body_content.substring(0, 100)}...
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
