import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Edit, Trash2, Globe, EyeOff } from 'lucide-react'
import { deletePage } from './actions'

export default async function PagesAdminPage() {
    const supabase = await createClient()
    const { data: pages } = await supabase.from('pages').select('*').order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pages</h1>
                    <p className="text-gray-500">Manage custom content pages (e.g., Shipping Policy, About Us).</p>
                </div>
                <Link
                    href="/admin/pages/new"
                    className="flex items-center rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-transform hover:scale-105 hover:bg-blue-700 shadow-md"
                >
                    <Plus className="mr-2 h-4 w-4" /> Create Page
                </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Slug</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Last Updated</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pages && pages.length > 0 ? (
                            pages.map((page) => (
                                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-blue-600">/pages/{page.slug}</td>
                                    <td className="px-6 py-4">
                                        {page.is_published ? (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                <Globe className="mr-1 h-3 w-3" /> Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                                                <EyeOff className="mr-1 h-3 w-3" /> Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{new Date(page.updated_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/pages/${page.id}`}
                                            className="rounded p-2 hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <form action={async () => {
                                            'use server'
                                            await deletePage(page.id)
                                        }}>
                                            <button className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <p className="text-base font-medium text-gray-900">No pages created yet.</p>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new page.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
