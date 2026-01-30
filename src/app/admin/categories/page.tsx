import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Trash2, Edit } from 'lucide-react'
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
                    <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900">Categories</h2>
                    <p className="text-gray-500">Manage product categories.</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    Add Category
                </Link>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-16 text-center">Icon</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories?.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 text-center text-2xl">
                                        {category.icon || '📦'}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{category.slug}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/categories/${category.id}`}
                                                className="rounded-md p-2 hover:bg-gray-100 text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <form action={async (formData) => {
                                                'use server'
                                                await deleteCategory(formData)
                                            }}>
                                                <input type="hidden" name="id" value={category.id} />
                                                <button
                                                    className="rounded-md p-2 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!categories || categories.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                        No categories found. Click 'Add Category' to create one.
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
