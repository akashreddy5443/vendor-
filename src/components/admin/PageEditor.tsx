'use client'

import { useState } from 'react'
import { createPage, updatePage } from '../actions'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PageEditor({ page }: { page?: any }) {
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState(page?.title || '')
    const [slug, setSlug] = useState(page?.slug || '')

    // Auto-generate slug from title if creating new
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setTitle(val)
        if (!page) { // Only auto-gen if new
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        if (page) {
            await updatePage(page.id, formData)
        } else {
            await createPage(formData)
        }
        setLoading(false)
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/pages" className="p-2 rounded-full hover:bg-zinc-800 text-gray-400 hover:text-white">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        {page ? 'Edit Page' : 'Create New Page'}
                    </h1>
                    <p className="text-gray-400">
                        {page ? `Editing: ${page.title}` : 'Add a new custom page to your store.'}
                    </p>
                </div>
            </div>

            <div className="grid gap-8 bg-zinc-900 p-8 rounded-xl border border-zinc-800">
                <div className="grid gap-4">
                    <label className="text-sm font-medium text-white">Page Title</label>
                    <input
                        name="title"
                        required
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full rounded-md border border-gray-700 bg-black p-3 text-white focus:border-orange-500 focus:outline-none"
                        placeholder="e.g., Shipping Policy"
                    />
                </div>

                <div className="grid gap-4">
                    <label className="text-sm font-medium text-white">URL Slug</label>
                    <div className="flex items-center rounded-md border border-gray-700 bg-black px-3">
                        <span className="text-gray-500 whitespace-nowrap">/pages/</span>
                        <input
                            name="slug"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full bg-transparent p-3 text-white focus:outline-none"
                            placeholder="shipping-policy"
                        />
                    </div>
                </div>

                <div className="grid gap-4">
                    <label className="text-sm font-medium text-white">Content (HTML)</label>
                    <p className="text-xs text-gray-500 mb-2">You can write basic HTML here (e.g. &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;).</p>
                    <textarea
                        name="content"
                        required
                        defaultValue={page?.content || ''}
                        rows={15}
                        className="w-full rounded-md border border-gray-700 bg-black p-4 text-white font-mono text-sm focus:border-orange-500 focus:outline-none"
                        placeholder="<h2>Shipping Policy</h2><p>We ship worldwide...</p>"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="is_published"
                        id="is_published"
                        defaultChecked={page?.is_published ?? true}
                        className="h-4 w-4 rounded border-gray-700 bg-black text-orange-600 focus:ring-orange-600"
                    />
                    <label htmlFor="is_published" className="text-sm text-white font-medium select-none cursor-pointer">
                        Publish immediately
                    </label>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center rounded-md bg-orange-600 px-8 py-3 font-bold text-white transition-colors hover:bg-orange-500 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {page ? 'Save Changes' : 'Create Page'}
                    </button>
                </div>
            </div>
        </form>
    )
}
