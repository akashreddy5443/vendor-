import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Trash2 } from 'lucide-react'
import { deleteCategory } from './actions'

export default async function AdminCategoriesPage() {
    const supabase = await createClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Categories</h2>
                    <p className="text-gray-400">Manage product categories.</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="flex items-center gap-2 rounded bg-orange-600 px-4 py-2 font-bold text-white transition-colors hover:bg-orange-500"
                >
                    <Plus className="h-4 w-4" />
                    Add Category
                </Link>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="border-b border-gray-800 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {categories?.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-800/50">
                                    <td className="px-4 py-3 font-medium text-white">{category.name}</td>
                                    <td className="px-4 py-3">{category.slug}</td>
                                    <td className="px-4 py-3 text-right">
                                        <form action={async (formData) => {
                                            'use server'
                                            await deleteCategory(formData)
                                        }}>
                                            <input type="hidden" name="id" value={category.id} />
                                            <button className="rounded p-1 hover:bg-gray-800 hover:text-red-400">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {(!categories || categories.length === 0) && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
