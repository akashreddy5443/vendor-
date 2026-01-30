'use client'

import { createCategory } from '../actions'

export default function NewCategoryPage() {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900">Add Category</h2>
                <p className="text-gray-500">Create a new product category.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <form
                    action={async (formData) => {
                        await createCategory(formData)
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
                            required
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g. Smart Home"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="icon" className="text-sm font-medium text-gray-700">
                            Icon (Emoji)
                        </label>
                        <input
                            id="icon"
                            name="icon"
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-2xl h-12"
                            placeholder="🏠"
                        />
                        <p className="text-xs text-gray-500">Pick an emoji (Win + . on Windows) to represent this category.</p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 py-2 font-bold text-white transition-colors hover:bg-blue-700 shadow-sm"
                        >
                            Create Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
