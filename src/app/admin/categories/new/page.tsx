'use client'

import { createCategory } from '../actions'

export default function NewCategoryPage() {
    const handleSubmit = async (formData: FormData) => {
        await createCategory(formData)
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Add Category</h2>
                <p className="text-gray-400">Create a new product category.</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-200">
                            Category Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            required
                            className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-orange-500 focus:outline-none"
                            placeholder="e.g. Keyboards"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-orange-600 py-2 font-bold text-white transition-colors hover:bg-orange-500"
                        >
                            Create Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
