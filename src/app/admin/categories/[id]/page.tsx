import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateCategory } from '../actions'

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!category) {
        redirect('/admin/categories')
    }

    const updateCategoryWithId = updateCategory.bind(null, category.id)

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900">Edit Category</h2>
                <p className="text-gray-500">Update category details.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <form
                    action={async (formData) => {
                        await updateCategoryWithId(formData)
                    }}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Category Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            defaultValue={category.name}
                            required
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g. Keyboards"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="slug" className="text-sm font-medium text-gray-700">
                            Slug (URL Identifier)
                        </label>
                        <input
                            id="slug"
                            name="slug"
                            defaultValue={category.slug}
                            required
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                            placeholder="e.g. keyboards"
                        />
                        <p className="text-xs text-gray-500">Unique identifier for URLs (e.g., example.com/categories/<b>keyboards</b>)</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="icon" className="text-sm font-medium text-gray-700">
                            Icon (Emoji or Text)
                        </label>
                        <input
                            id="icon"
                            name="icon"
                            defaultValue={category.icon}
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-2xl h-12"
                            placeholder="⌨️"
                        />
                        <p className="text-xs text-gray-500">Pick an emoji (Win + . on Windows) or enter a short text code.</p>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 rounded-md bg-blue-600 py-2 font-bold text-white transition-colors hover:bg-blue-700 shadow-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
