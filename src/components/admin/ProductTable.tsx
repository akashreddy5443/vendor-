'use client'

import { deleteProduct } from '@/app/admin/products/actions'
import { formatPrice } from '@/lib/utils'
import { Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

type Product = {
    id: string
    title: string
    price: number
    stock: number
    status: 'active' | 'draft'
    category_id: string
}

export function ProductTable({ products }: { products: any[] }) {
    if (products.length === 0) {
        return <div className="text-center text-gray-500 py-10">No products found.</div>
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
                <thead className="border-b border-gray-200 text-xs uppercase text-gray-500 bg-gray-50">
                    <tr>
                        <th className="px-4 py-3">Product Name</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{product.title}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${product.status === 'active'
                                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                                        : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                        }`}
                                >
                                    {product.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-900">
                                {product.price ? formatPrice(product.price) : formatPrice(0)}
                            </td>
                            <td className="px-4 py-3 text-gray-700">{product.stock}</td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <Link
                                        href={`/admin/products/${product.id}`}
                                        className="rounded p-1 hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <form action={async (formData) => {
                                        await deleteProduct(formData)
                                    }}>
                                        <input type="hidden" name="id" value={product.id} />
                                        <button className="rounded p-1 hover:bg-gray-100 text-gray-500 hover:text-red-500">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
